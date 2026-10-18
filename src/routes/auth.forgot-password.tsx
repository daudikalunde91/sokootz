import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthForm } from "@/components/site/AuthForm";
import { authService } from "@/lib/api/services";
import { forgotSchema } from "@/lib/validation/auth";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/auth/forgot-password")({
  head: () => seo("Forgot password", "Request a SokoTZ password reset link."),
  component: () => (
    <div className="px-4 py-16">
      <AuthForm
        title="Reset your password"
        subtitle="Enter your email and we'll send you a reset link."
        schema={forgotSchema}
        submitLabel="Send reset link"
        fields={[{ name: "email", label: "Email", type: "email", autoComplete: "email" }]}
        onSubmit={(d) => authService.requestPasswordReset({ email: d.email })}
        footer={<Link to="/auth/login" className="text-neon hover:underline">Back to log in</Link>}
      />
    </div>
  ),
});
