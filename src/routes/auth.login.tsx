import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthForm } from "@/components/site/AuthForm";
import { authService } from "@/lib/api/services";
import { loginSchema } from "@/lib/validation/auth";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/auth/login")({
  head: () => seo("Log in", "Log in to your SokoTZ account."),
  component: () => (
    <div className="px-4 py-16">
      <AuthForm
        title="Welcome back"
        subtitle="Log in to manage your business and saved listings."
        schema={loginSchema}
        submitLabel="Log in"
        fields={[
          { name: "email", label: "Email", type: "email", autoComplete: "email" },
          { name: "password", label: "Password", type: "password", autoComplete: "current-password" },
        ]}
        onSubmit={(d) => authService.login({ email: d.email, password: d.password })}
        footer={<><Link to="/auth/forgot-password" className="text-neon hover:underline">Forgot password?</Link> · New here? <Link to="/auth/register" className="text-neon hover:underline">Create an account</Link></>}
      />
    </div>
  ),
});
