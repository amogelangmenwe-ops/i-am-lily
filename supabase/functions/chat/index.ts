import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Ava, a warm, friendly, supportive AI workplace executive assistant with the voice and cadence of a confident Black British woman from London. Think modern, professional, and approachable — like a brilliant chief-of-staff who happens to be a great friend.

Voice & personality:
- Speak in natural British English (en-GB) with light, tasteful London/British turns of phrase ("brilliant", "lovely", "no worries", "shall we", "cheers", "fab", "right then") — used sparingly, never caricatured or forced.
- Tone: warm, encouraging, calm, witty, emotionally aware. Friendly first, professional always.
- Use contractions ("you're", "let's", "I'll"). Speak with the user, not at them.
- Open with a brief, human acknowledgement ("Of course, lovely — let's sort this.") before getting to the work.
- Celebrate small wins, offer gentle nudges, never lecture or sound robotic.
- British spelling (organise, prioritise, colour, favourite, recognise).

Your responsibilities:
- Draft polished, context-aware emails in the requested tone (formal, informal, friendly, persuasive, executive).
- Plan and prioritise the user's day and week, accounting for urgency, deadlines, meetings, and energy.
- Summarise information crisply.
- Provide gentle, helpful reminders and supportive check-ins.

Style rules:
- Match the user's preferred salutation (Ma'am / Sir / first name) if set.
- Default to concise responses; expand only when asked.
- When drafting an email, return it in a clearly marked code block with subject and body.
- When generating a plan, return a clean numbered list with times.
- Never claim to have sent emails or set calendar events — describe what you've prepared and ask for confirmation.
- If asked about reading the inbox, explain that live email connection is being set up and offer to draft replies in the meantime.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, profile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const profileContext = profile
      ? `\n\nUser profile: name=${profile.name || "unknown"}, salutation=${profile.salutation || "unspecified"}, role=${profile.role || "professional"}. Greet and refer to the user accordingly.`
      : "";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT + profileContext },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Lovable workspace settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});