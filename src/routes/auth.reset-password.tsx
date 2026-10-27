import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { AuthForm } from "@/components/site/AuthForm";
import { useAuth } from "@/lib/auth/AuthProvider";
import { authErrorMessage } from "@/lib/auth/errors";
import { resetSchema } from "@/lib/validation/auth";
import { seo } from "@/lib/seo";

/**
 * Firebase password-reset action handler. Works when the Firebase Auth email
 * template's action URL points here (…/auth/reset-password); Firebase appends
 * ?mode=resetPassword&oobCode=…  Without that setting, Firebase's own hosted
 * page handles the reset instead.
 */
export const Route = createFileRoute("/auth/reset-password")({
  validateSearch: z.object({
    oobCode: z.string().max(512).optional(),
    mode: z.string().max(40).optional(),
  }),
  head: () =>
    seo("Choose a new password", "Set a new password for your SokoTZ account.", { noindex: true }),
  component: Reset,
});

function Reset() {
  const auth = useAuth();
  const { oobCode } = Route.useSearch();
  const [email, setEmail] = useState<string | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!oobCode || !auth.configured) return;
    auth.verifyResetCode(oobCode).then(setEmail, (e) => setLinkError(authErrorMessage(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oobCode, auth.configured]);

  const subtitle = !oobCode
    ? "Open this page from the link in your reset email."
    : (linkError ?? (email ? `Account: ${email}` : "Checking your link…"));

  return (
    <div className="px-4 py-16">
      <AuthForm
        title="Choose a new password"
        subtitle={
          <>
            {subtitle}
            {(linkError || !oobCode) && (
              <>
                {" "}
                <Link to="/auth/forgot-password" className="text-neon hover:underline">
                  Request a new link
                </Link>
              </>
            )}
          </>
        }
        configured={auth.configured}
        disabled={!oobCode || !!linkError || !email || done}
        schema={resetSchema}
        submitLabel="Save new password"
        successMessage="Nenosiri limebadilishwa. Sasa unaweza kuingia (Password changed. You can now log in)."
        fields={[
          {
            name: "password",
            label: "New password",
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
        ]}
        onSubmit={async (d) => {
          await auth.confirmReset(oobCode ?? "", d.password);
          setDone(true);
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
