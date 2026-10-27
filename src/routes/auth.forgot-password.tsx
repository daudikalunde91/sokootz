import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthForm } from "@/components/site/AuthForm";
import { useAuth } from "@/lib/auth/AuthProvider";
import { forgotSchema } from "@/lib/validation/auth";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/auth/forgot-password")({
  head: () => seo("Forgot password", "Request a SokoTZ password reset link."),
  component: Forgot,
});

function Forgot() {
  const auth = useAuth();
  return (
    <div className="px-4 py-16">
      <AuthForm
        title="Reset your password"
        subtitle="Enter your email and we'll send you a reset link."
        configured={auth.configured}
        schema={forgotSchema}
        submitLabel="Send reset link"
        successMessage="Kama akaunti ipo, tumetuma kiungo kwa barua pepe yako (If an account exists, a reset link has been sent to your email)."
        fields={[{ name: "email", label: "Email", type: "email", autoComplete: "email" }]}
        onSubmit={async (d) => {
          try {
            await auth.sendReset(d.email);
          } catch (e) {
            // Don't reveal whether an account exists.
            if ((e as { code?: string }).code !== "auth/user-not-found") throw e;
          }
        }}
        footer={
          <Link to="/auth/login" className="text-neon hover:underline">
            Back to log in
          </Link>
        }
      />
    </div>
  );
}
