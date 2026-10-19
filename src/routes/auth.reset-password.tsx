import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AuthForm } from "@/components/site/AuthForm";
import { authService } from "@/lib/api/services";
import { resetSchema } from "@/lib/validation/auth";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/auth/reset-password")({
  validateSearch: z.object({ token: z.string().max(512).optional() }),
  head: () => seo("Choose a new password", "Set a new password for your SokoTZ account.", { noindex: true }),
  component: Reset,
});

function Reset() {
  const { token } = Route.useSearch();
  return (
    <div className="px-4 py-16">
      <AuthForm
        title="Choose a new password"
        subtitle={token ? undefined : "Open this page from the link in your reset email."}
        schema={resetSchema}
        submitLabel="Save new password"
        fields={[
          { name: "password", label: "New password", type: "password", autoComplete: "new-password" },
          { name: "confirm", label: "Confirm password", type: "password", autoComplete: "new-password" },
        ]}
        onSubmit={(d) => authService.confirmPasswordReset({ token: token ?? "", password: d.password })}
      />
    </div>
  );
}
