export function authErrorMessage(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String((error as { code?: string }).code) : "";
  switch (code) {
    case "auth/popup-blocked": return "Your browser blocked the Google sign-in popup. Allow popups for this site or use email sign-in.";
    case "auth/popup-closed-by-user": case "auth/cancelled-popup-request": return "Sign-in was cancelled. You can try again when ready.";
    case "auth/unauthorized-domain": return "This domain is not authorized for Firebase Authentication. Add numsum.in, www.numsum.in, and numsum.vercel.app in Firebase Authentication settings.";
    case "auth/invalid-email": return "Enter a valid email address.";
    case "auth/invalid-credential": case "auth/wrong-password": return "The email or password is incorrect.";
    case "auth/user-not-found": return "No account exists for that email yet.";
    case "auth/email-already-in-use": return "An account already exists for that email. Try signing in instead.";
    case "auth/weak-password": return "Use a stronger password with at least 6 characters.";
    default: return error instanceof Error ? error.message : "Authentication failed. Please try again.";
  }
}
