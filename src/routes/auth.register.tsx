import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AuthForm } from "@/components/site/AuthForm";
import { useAuth } from "@/lib/auth/AuthProvider";
import { registerSchema } from "@/lib/validation/auth";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/auth/register")({
  head: () => seo("Create an account", "Join SokoTZ to list your business or find local sellers."),
  component: Register,
});

function Register() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.loading && auth.user) navigate({ to: "/dashboard" });
  }, [auth.loading, auth.user, navigate]);

  return (
    <div className="px-4 py-16">
      <AuthForm
        title="Create your account"
        subtitle="One account works on the SokoTZ website and Android app."
        configured={auth.configured}
        schema={registerSchema}
        submitLabel="Create account"
        fields={[
          { name: "name", label: "Full name", autoComplete: "name" },
          { name: "email", label: "Email", type: "email", autoComplete: "email" },
          {
            name: "phone",
            label: "Phone number",
            type: "tel",
            autoComplete: "tel",
            placeholder: "0712 345 678",
          },
          {
            name: "role",
            label: "I want to",
            type: "radio",
            defaultValue: "CUSTOMER",
            options: [
              { value: "CUSTOMER", label: "Find products & services" },
              { value: "BUSINESS_OWNER", label: "Sell as a business" },
            ],
          },
          {
            name: "password",
            label: "Password",
            type: "password",
            autoComplete: "new-password",
            hint: "At least 8 characters with a letter and a number.",
          },
          {
            name: "confirm",
            label: "Confirm password",
            type: "password",
            autoComplete: "new-password",
          },
          {
            name: "terms",
            label:
              "Nakubali Vigezo na Masharti ya SokoTZ (I accept the SokoTZ terms and conditions).",
            type: "checkbox",
          },
        ]}
        onSubmit={(d) =>
          auth.registerEmail(d.email, d.password, {
            displayName: d.name,
            phoneNumber: d.phone,
            role: d.role,
            hasAcceptedTerms: true,
          })
        }
        onGoogle={auth.signInGoogle}
        footer={
          <>
            Already have an account?{" "}
            <Link to="/auth/login" className="text-neon hover:underline">
              Log in
            </Link>
            <p className="mt-2 text-xs">
              Continuing with Google creates a customer account and accepts the terms.
            </p>
          </>
        }
      />
    </div>
  );
}
