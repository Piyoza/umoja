
import { Button } from "@/components/ui/button";
import { MfaHeader } from "@/components/auth/MfaParts";

export function MfaMethodSetup({ method, onBack }) {
  return (
    <div className="space-y-4">
      <MfaHeader
        title="Two-factor authentication"
        description={
          method === "totp"
            ? "Authenticator app setup is not yet connected to Firebase."
            : "SMS verification setup is not yet connected to Firebase."
        }
      />

      <div
        role="status"
        className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-muted-foreground"
      >
        The original MFA setup used Base44 authentication services.
        This project is now migrating to Firebase, and the Firebase
        MFA enrollment flow still needs to be implemented.
        No authentication method has been enabled or changed.
      </div>

      <Button className="w-full" variant="outline" onClick={onBack}>
        Go Back
      </Button>
    </div>
  );
}

export default MfaMethodSetup;
