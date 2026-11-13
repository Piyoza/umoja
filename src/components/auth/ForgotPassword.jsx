
import { ArrowLeft, Mail } from "lucide-react";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthLink, SubmitButton } from "@/components/auth/parts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { safeReturnTo } from "@/lib/authReturnTo";

export function ForgotPasswordPage() {
  const returnTo = safeReturnTo();

  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);

    try {
      await sendPasswordResetEmail(auth, email);
    } catch {
      // Keep the response generic.
    } finally {
      setBusy(false);
      setSent(true);
    }
  }

  return (
    <AuthLayout
      icon={Mail}
      title="Reset password"
      subtitle="We'll send you a link to reset it"
    >
      {sent ? (
        <p className="text-center text-sm text-foreground">
          If an account exists with that email, you'll receive a password
          reset link shortly.
        </p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="forgot-email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="forgot-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 pl-10"
                required
              />
            </div>
          </div>

          <SubmitButton busy={busy} busyLabel="Sending...">
            Send reset link
          </SubmitButton>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <AuthLink to="/login" returnTo={returnTo}>
          <ArrowLeft className="mr-1 inline h-3 w-3" />
          Back to log in
        </AuthLink>
      </p>
    </AuthLayout>
  );
}
