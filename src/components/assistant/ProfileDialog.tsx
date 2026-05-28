import { useState } from "react";
import { saveProfile, type Profile, type Salutation } from "@/lib/assistant";
import { X } from "lucide-react";

export function ProfileDialog({
  initial,
  onClose,
  onSaved,
}: {
  initial: Profile;
  onClose: () => void;
  onSaved: (p: Profile) => void;
}) {
  const [name, setName] = useState(initial.name);
  const [salutation, setSalutation] = useState<Salutation>(initial.salutation);
  const [role, setRole] = useState(initial.role);

  function submit() {
    const p: Profile = { name: name.trim(), salutation, role: role.trim() || "Executive" };
    saveProfile(p);
    onSaved(p);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4">
      <div className="bg-card rounded-2xl shadow-glow border border-border w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium tracking-tight">Your profile</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>
        <p className="text-sm text-muted-foreground mb-5">
          Lilly will use this to address you and tailor responses.
        </p>
        <div className="space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aisha Khan"
              className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Preferred address</span>
            <div className="mt-1 grid grid-cols-3 gap-2">
              {(["Ma'am", "Sir", "first-name"] as Salutation[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSalutation(s)}
                  className={`rounded-lg px-3 py-2 text-sm border transition-all ${
                    salutation === s
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:border-primary/50"
                  }`}
                >
                  {s === "first-name" ? "First name" : s}
                </button>
              ))}
            </div>
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Role</span>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. CEO, Product Manager"
              className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        </div>
        <button
          onClick={submit}
          className="mt-6 w-full bg-primary text-primary-foreground rounded-lg py-2.5 font-medium hover:opacity-90 transition-opacity"
        >
          Save
        </button>
      </div>
    </div>
  );
}