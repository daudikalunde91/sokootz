/**
 * Shared error model for every data call. The marketplace data source is the
 * Android app's Firebase project (Auth + named Firestore DB); Firebase errors are
 * normalised here so pages render one consistent set of states.
 */
export type ApiErrorCode =
  | "not_configured"
  | "network"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "validation"
  | "rate_limited"
  | "index_required"
  | "server";

export class ApiError extends Error {
  constructor(
    public code: ApiErrorCode,
    message: string,
    public status?: number,
    public fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Maps a Firestore / Firebase error (`{ code: "permission-denied" }`) to an ApiError. */
export function toApiError(e: unknown): ApiError {
  if (e instanceof ApiError) return e;
  const code =
    typeof e === "object" && e && "code" in e ? String((e as { code: unknown }).code) : "";
  const message = e instanceof Error ? e.message : "";
  switch (code.replace(/^firestore\//, "")) {
    case "permission-denied":
      return new ApiError("forbidden", "You don't have permission to do that.");
    case "unauthenticated":
      return new ApiError("unauthorized", "Please log in to continue.");
    case "not-found":
      return new ApiError("not_found", "Not found.");
    case "unavailable":
    case "deadline-exceeded":
      return new ApiError("network", "Network error. Check your connection and try again.");
    case "resource-exhausted":
      return new ApiError("rate_limited", "Too many requests. Please wait a moment and try again.");
    case "invalid-argument":
      return new ApiError("validation", "Some details are not valid. Please check the form.");
    case "failed-precondition":
      if (/index/i.test(message)) {
        // Firestore includes a console link to create the index; keep it in the console for admins.
        console.error("[SokoTZ] Firestore index required:", message);
        return new ApiError(
          "index_required",
          "This view needs a database index that has not been created yet.",
        );
      }
      return new ApiError("server", "The request could not be completed.");
    default:
      return new ApiError("server", "Something went wrong. Please try again.");
  }
}

export function errorMessage(e: unknown): string {
  if (e instanceof ApiError) return e.message;
  // Plain local errors (no Firebase code) carry a message written for the user.
  if (e instanceof Error && !("code" in e) && e.message) return e.message;
  return toApiError(e).message;
}
