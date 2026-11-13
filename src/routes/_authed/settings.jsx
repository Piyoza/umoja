import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { KeyRound, Save, Shield, User } from "lucide-react";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/AuthContext";

export const Route = createFileRoute("/_authed/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [{ title: "Settings · Junior Astronaut Mission Trainer" }],
  }),
});

function SettingsPage() {
  const { user, refresh } = useAuth();
  const [name, setName] = useState(user?.displayName || "");
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      const displayName = name.trim();

      if (!auth.currentUser) {
        throw new Error("You must be signed in to update your profile.");
      }

      await updateProfile(auth.currentUser, { displayName });
      await refresh();
      setStatus("Profile updated.");
    } catch (error) {
      console.error("Profile update failed:", error);
      setStatus("Could not save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <p className="eyebrow">Account</p>
        <h1 className="mt-1 text-2xl font-semibold">Settings</h1>
      </div>

      <form onSubmit={save} className="panel space-y-4 p-5">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <User className="h-4 w-4 text-primary" /> Trainee profile
        </p>

        <div>
          <Label className="text-xs text-muted-foreground">
            Display name
          </Label>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1.5"
            placeholder="Astronaut Trainee"
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Email</Label>
          <Input
            value={user?.email || ""}
            readOnly
            disabled
            className="mt-1.5"
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Role</Label>
          <Input
            value="Astronaut Trainee"
            readOnly
            disabled
            className="mt-1.5"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" size="sm" disabled={saving}>
            <Save className="mr-1.5 h-3.5 w-3.5" />
            {saving ? "Saving…" : "Save profile"}
          </Button>

          {status && (
            <p className="text-[11px] text-muted-foreground">{status}</p>
          )}
        </div>
      </form>

      <div className="panel p-5">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Shield className="h-4 w-4 text-primary" /> Account security
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Two-factor authentication setup is not yet connected to Firebase.
        </p>
        <Button asChild size="sm" variant="secondary" className="mt-3">
          <Link to="/mfa">
            <KeyRound className="mr-1.5 h-3.5 w-3.5" />
            Two-factor authentication
          </Link>
        </Button>
      </div>

      <div className="panel p-5">
        <p className="text-sm font-semibold">About this simulator</p>
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
          Junior Astronaut Mission Trainer is an educational platform.
          Emergency simulations use illustrative values and scenario logic
          written for training, not official NASA flight procedures or real
          spacecraft emergency instructions. Planetary data comes from NASA
          Solar System Exploration and NASA mission pages.
        </p>
      </div>
    </div>
  );
}