import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordPage } from "@/components/auth/ForgotPassword";

export const Route = createFileRoute("/forgot-password")({ ssr: false, component: ForgotPasswordPage });
