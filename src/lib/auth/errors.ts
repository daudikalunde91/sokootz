/**
 * Firebase Auth error codes → bilingual messages in the Android app's
 * "Kiswahili (English)" style. Returns null for codes that need no message
 * (e.g. the user closed the Google popup).
 */
export function authErrorMessage(e: unknown): string | null {
  const code =
    typeof e === "object" && e && "code" in e ? String((e as { code: unknown }).code) : "";
  switch (code) {
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
    case "auth/user-cancelled":
      return null;
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/invalid-login-credentials":
      return "Barua pepe au nenosiri sio sahihi (Incorrect email or password).";
    case "auth/user-not-found":
      return "Akaunti hii haipo. Tafadhali jisajili kwanza (Account not found. Please register).";
    case "auth/email-already-in-use":
      return "Barua pepe hii tayari imesajiliwa. Tafadhali ingia (Email already in use. Please log in).";
    case "auth/weak-password":
      return "Nenosiri ni dhaifu (Password is too weak).";
    case "auth/invalid-email":
      return "Barua pepe sio sahihi (Invalid email address).";
    case "auth/user-disabled":
      return "Akaunti hii imezimwa (This account has been disabled).";
    case "auth/too-many-requests":
      return "Majaribio mengi mno. Subiri kidogo kisha ujaribu tena (Too many attempts. Please wait and try again).";
    case "auth/network-request-failed":
      return "Hitilafu ya mtandao. Angalia intaneti yako (Network error. Check your connection).";
    case "auth/popup-blocked":
      return "Kivinjari kimezuia dirisha la Google. Ruhusu popups kisha ujaribu tena (Your browser blocked the Google window. Allow pop-ups and try again).";
    case "auth/unauthorized-domain":
      return "Tovuti hii bado haijaruhusiwa kwa kuingia na Google (This website's domain is not yet authorised for Google sign-in in Firebase).";
    case "auth/operation-not-allowed":
      return "Njia hii ya kuingia haijawashwa (This sign-in method is not enabled in Firebase).";
    case "auth/account-exists-with-different-credential":
      return "Barua pepe hii inatumia njia nyingine ya kuingia (This email uses a different sign-in method).";
    case "auth/expired-action-code":
      return "Kiungo kimeisha muda. Omba kingine (This link has expired. Request a new one).";
    case "auth/invalid-action-code":
      return "Kiungo si sahihi au kimeshatumika (This link is invalid or was already used).";
    case "auth/requires-recent-login":
      return "Tafadhali ingia tena kisha ujaribu (Please log in again and retry).";
    case "auth/invalid-api-key":
    case "auth/api-key-not-valid.-please-pass-a-valid-api-key.":
      return "Muunganisho wa SokoTZ haujawekwa sawa (The SokoTZ Firebase connection is not configured correctly).";
    default:
      return "Imeshindikana. Tafadhali jaribu tena (Something went wrong. Please try again).";
  }
}
