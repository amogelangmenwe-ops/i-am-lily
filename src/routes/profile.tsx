import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { loadProfile, saveProfile, addressFor, type Profile, type Salutation } from "@/lib/assistant";
import { PageHeader, PageShell, ResponsibleAINotice } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Lilly" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(() => loadProfile());
  const [saved, setSaved] = useState(false);

  function update<K extends keyof Profile>(k: K, v: Profile[K]) {
    setProfile((p) => ({ ...p, [k]: v }));
    setSaved(false);
  }
  function submit() {
    const next = { ...profile, name: profile.name.trim(), role: profile.role.trim() || "Executive" };
    saveProfile(next);
    setProfile(next);
    setSaved(true);
  }

  return (
    <PageShell>
      <PageHeader title="Profile" subtitle={`Lilly will address you as "${addressFor(profile) || "you"}".`} />
      <div className="max-w-xl rounded-2xl bg-card border border-border shadow-soft p-6 space-y-5">
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Name</span>
          <input
            value={profile.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="e.g. Aisha Khan"
            className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Role</span>
          <input
            value={profile.role}
            onChange={(e) => update("role", e.target.value)}
            placeholder="e.g. Product Manager"
            className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <div>
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Preferred address</span>
          <div className="mt-1 grid grid-cols-3 gap-2">
            {(["Ma'am", "Sir", "first-name"] as Salutation[]).map((s) => (
              <button
                key={s}
                onClick={() => update("salutation", s)}
                className={`rounded-lg px-3 py-2 text-sm border transition-all ${
                  profile.salutation === s
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border hover:border-primary/50"
                }`}
              >
                {s === "first-name" ? "First name" : s}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={submit} className="bg-primary text-primary-foreground rounded-lg px-5 py-2 text-sm font-medium hover:opacity-90">
            Save profile
          </button>
          {saved && <span className="text-xs text-muted-foreground">Saved.</span>}
        </div>
      </div>
      <div className="mt-5 max-w-xl">
        <ResponsibleAINotice />
      </div>
    </PageShell>
  );
}