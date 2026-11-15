import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  KeyRound,
  Save,
  Shield,
  User,
  Volume2,
  Captions,
  Eye,
  Accessibility,
  Vibrate,
  BookOpen,
  Languages,
} from "lucide-react";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/AuthContext";
import {
  saveUserProfile,
  saveUserPreferences,
  DEFAULT_USER_PREFERENCES,
  ASTRA_LANGUAGES,
} from "@/lib/user-profile";

export const Route = createFileRoute("/_authed/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [{ title: "Settings · Junior Astronaut Mission Trainer" }],
  }),
});

const PREFERENCE_GROUPS = [
  {
    title: "Sound effects",
    description: "Hear optional interface and mission sound effects.",
    key: "soundEffects",
    icon: Volume2,
  },
  {
    title: "Audio narration",
    description: "Enable spoken explanations and learning narration.",
    key: "audioNarration",
    icon: Volume2,
  },
  {
    title: "Captions",
    description: "Show text alongside supported audio and video.",
    key: "captions",
    icon: Captions,
  },
  {
    title: "Reduced motion",
    description: "Reduce animations and motion effects where supported.",
    key: "reducedMotion",
    icon: Accessibility,
  },
  {
    title: "Plain-language mode",
    description: "Prefer simpler explanations of scientific concepts.",
    key: "plainLanguage",
    icon: BookOpen,
  },
  {
    title: "High visual contrast",
    description: "Use stronger visual contrast where supported.",
    key: "highContrast",
    icon: Eye,
  },
  {
    title: "Haptic feedback",
    description: "Enable vibration feedback on supported devices.",
    key: "hapticFeedback",
    icon: Vibrate,
  },
];

function SettingsPage() {
  const { user, profile, refresh } = useAuth();

  const [name, setName] = useState(user?.displayName || "");
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const [preferences, setPreferences] = useState({
    ...DEFAULT_USER_PREFERENCES,
    ...(profile?.preferences || {}),
  });

  const [preferenceStatus, setPreferenceStatus] = useState(null);
  const [savingPreferences, setSavingPreferences] = useState(false);

  useEffect(() => {
    setName(user?.displayName || "");
  }, [user?.displayName]);

  useEffect(() => {
    setPreferences({
      ...DEFAULT_USER_PREFERENCES,
      ...(profile?.preferences || {}),
    });
  }, [profile?.preferences]);

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

      await saveUserProfile(auth.currentUser, {
        displayName,
      });

      await refresh();

      setName(displayName);
      setStatus("Profile updated.");
    } catch (error) {
      console.error("Profile update failed:", error);
      setStatus("Could not save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function updatePreference(key, value) {
    setPreferences((current) => ({
      ...current,
      [key]: value,
    }));
    setPreferenceStatus(null);
  }

  async function savePreferences(event) {
    event.preventDefault();
    setSavingPreferences(true);
    setPreferenceStatus(null);

    try {
      if (!auth.currentUser) {
        throw new Error("You must be signed in to save preferences.");
      }

      await saveUserPreferences(auth.currentUser, preferences);
      await refresh();

      setPreferenceStatus("Your language and accessibility preferences were saved.");
    } catch (error) {
      console.error("Preference update failed:", error);
      setPreferenceStatus("Could not save preferences. Please try again.");
    } finally {
      setSavingPreferences(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <p className="eyebrow">Account</p>
        <h1 className="mt-1 text-2xl font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Personalise your astronaut training experience.
        </p>
      </div>

      <form onSubmit={save} className="panel space-y-4 p-5">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <User className="h-4 w-4 text-primary" />
          Trainee profile
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
            <p role="status" className="text-[11px] text-muted-foreground">
              {status}
            </p>
          )}
        </div>
      </form>

      <form onSubmit={savePreferences} className="panel space-y-5 p-5">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Languages className="h-4 w-4 text-primary" />
            ASTRA language
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Choose the language ASTRA should use when explaining space science
            and answering your questions.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="astra-language">Preferred language</Label>
          <select
            id="astra-language"
            value={preferences.language || "en"}
            onChange={(event) =>
              updatePreference("language", event.target.value)
            }
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {ASTRA_LANGUAGES.map((language) => (
              <option key={language.code} value={language.code}>
                {language.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            Spoken language availability depends on the voices installed on
            your device and browser.
          </p>
        </div>

        <div className="border-t border-border/60 pt-5">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Accessibility className="h-4 w-4 text-primary" />
            Sensory & accessibility preferences
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Choose how you prefer to experience your astronaut training.
            Your preferences are saved to your learner profile.
          </p>
        </div>

        <div className="space-y-4">
          {PREFERENCE_GROUPS.map((item) => {
            const Icon = item.icon;

            return (
              <label
                key={item.key}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/60 p-3 transition-colors hover:bg-accent/40"
              >
                <span className="mt-0.5 rounded-lg bg-primary/10 p-2">
                  <Icon className="h-4 w-4 text-primary" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </span>
                </span>

                <input
                  type="checkbox"
                  checked={Boolean(preferences[item.key])}
                  onChange={(event) =>
                    updatePreference(item.key, event.target.checked)
                  }
                  className="mt-1 h-4 w-4 shrink-0 accent-primary"
                />
              </label>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" size="sm" disabled={savingPreferences}>
            <Save className="mr-1.5 h-3.5 w-3.5" />
            {savingPreferences ? "Saving…" : "Save preferences"}
          </Button>

          {preferenceStatus && (
            <p role="status" className="text-xs text-muted-foreground">
              {preferenceStatus}
            </p>
          )}
        </div>
      </form>

      <div className="panel p-5">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Shield className="h-4 w-4 text-primary" />
          Account security
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