import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthForm } from "@/components/site/AuthForm";
import { authService } from "@/lib/api/services";
import { registerSchema } from "@/lib/validation/auth";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/auth/register")({
  head: () => seo("Create an account", "Join SokoTZ to list your business or save listings."),
  component: () => (
    <div className="px-4 py-16">
      <AuthForm
        title="Create your account"
        plannedGoogle
        schema={registerSchema}
        submitLabel="Create account"
        fields={[
          { name: "name", label: "Full name", autoComplete: "name" },
          { name: "email", label: "Email", type: "email", autoComplete: "email" },
          { name: "password", label: "Password", type: "password", autoComplete: "new-password" },
          { name: "confirm", label: "Confirm password", type: "password", autoComplete: "new-password" },
        ]}
        onSubmit={(d) => authService.register({ name: d.name, email: d.email, password: d.password })}
        footer={<>Already have an account? <Link to="/auth/login" className="text-neon hover:underline">Log in</Link></>}
      />
    </div>
  ),
});
