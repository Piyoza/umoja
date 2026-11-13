import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordPage } from "@/components/auth/ResetPassword";

export const Route = createFileRoute("/reset-password")({ ssr: false, component: ResetPasswordPage });
