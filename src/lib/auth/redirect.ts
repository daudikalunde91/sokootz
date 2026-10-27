/** Only same-site paths are allowed as post-login redirects (no open redirects). */
export function safeRedirect(raw: string | undefined | null, fallback = "/dashboard"): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\"))
    return fallback;
  if (raw.startsWith("/auth/")) return fallback;
  return raw;
}
