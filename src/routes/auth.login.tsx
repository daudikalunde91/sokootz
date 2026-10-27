import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";
import { AuthForm } from "@/components/site/AuthForm";
import { useAuth } from "@/lib/auth/AuthProvider";
import { safeRedirect } from "@/lib/auth/redirect";
import { loginSchema } from "@/lib/validation/auth";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/auth/login")({
  validateSearch: z.object({ redirect: z.string().max(200).optional() }),
  head: () => seo("Log in", "Log in to your SokoTZ account."),
  component: Login,
});

function Login() {
  const auth = useAuth();
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const target = safeRedirect(redirect);

  useEffect(() => {
    if (!auth.loading && auth.user) navigate({ to: target });
  }, [auth.loading, auth.user, navigate, target]);

  return (
    <div className="px-4 py-16">
      <AuthForm
        title="Welcome back"
        subtitle="Ingia kwa akaunti ileile unayotumia kwenye programu ya SokoTZ (Use the same account as the SokoTZ Android app)."
        configured={auth.configured}
        schema={loginSchema}
        submitLabel="Log in"
        fields={[
          { name: "email", label: "Email", type: "email", autoComplete: "email" },
          {
            name: "password",
            label: "Password",
            type: "password",
            autoComplete: "current-password",
          },
        ]}
        onSubmit={(d) => auth.signInEmail(d.email, d.password)}
        onGoogle={auth.signInGoogle}
        footer={
          <>
            <Link to="/auth/forgot-password" className="text-neon hover:underline">
              Forgot password?
            </Link>{" "}
            · New here?{" "}
            <Link to="/auth/register" className="text-neon hover:underline">
              Create an account
            </Link>
          </>
        }
      />
    </div>
  );
}
