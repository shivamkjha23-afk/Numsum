"use client";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { authErrorMessage } from "@/lib/auth-errors";
import { ensureUserProfile, isProfileComplete } from "@/lib/repositories/firestore";

function authCode(error: unknown) { return typeof error === "object" && error !== null && "code" in error ? String((error as { code?: unknown }).code) : ""; }

export function AuthModal({ open, onClose, returnTo, message = "Please sign in to continue", onSuccess }: { open: boolean; onClose: () => void; returnTo?: string; message?: string; onSuccess?: () => void | Promise<void> }) {
  const router = useRouter();
  const [error, setError] = useState("");
  if (!open) return null;
  async function done() {
    const currentUser = auth.currentUser;
    const fallbackReturnTo = returnTo || window.location.pathname || "/";
    if (currentUser) {
      const profile = await ensureUserProfile(currentUser);
      if (!isProfileComplete(profile)) {
        onClose();
        router.push(`/profile/complete?returnTo=${encodeURIComponent(fallbackReturnTo)}`);
        return;
      }
    }
    if (onSuccess) { await onSuccess(); return; }
    onClose();
    router.push(fallbackReturnTo);
  }
  async function google() { setError(""); try { await signInWithPopup(auth, new GoogleAuthProvider()); await done(); } catch (e) { setError(authErrorMessage(e)); } }
  async function email(formData: FormData) {
    setError("");
    const emailValue = String(formData.get("email")).trim();
    const password = String(formData.get("password"));
    try {
      try { await signInWithEmailAndPassword(auth, emailValue, password); }
      catch (e) {
        if (authCode(e) !== "auth/user-not-found" && authCode(e) !== "auth/invalid-credential") throw e;
        await createUserWithEmailAndPassword(auth, emailValue, password);
      }
      await done();
    } catch (e) { setError(authErrorMessage(e)); }
  }
  return <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4 backdrop-blur"><div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#07111f] p-6 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-sm uppercase tracking-[.3em] text-blue-300">Protected action</p><h2 className="mt-2 font-display text-3xl">Sign In</h2><p className="mt-2 text-sm text-white/60">{message}</p><p className="mt-2 text-xs text-white/45">Enter your email to continue. If this is your first time, a member account is created automatically.</p></div><button aria-label="Close" onClick={onClose} className="rounded-full border border-white/10 p-2"><X size={18} /></button></div><button className="mt-6 w-full rounded-full bg-white px-5 py-3 font-semibold text-navy" onClick={google}>Continue with Google</button><form action={email} className="mt-4 grid gap-3"><input name="email" type="email" required placeholder="Email" className="rounded-xl border border-white/10 bg-black/30 p-3" /><input name="password" type="password" required placeholder="Password" className="rounded-xl border border-white/10 bg-black/30 p-3" /><button className="rounded-full bg-blue-400 px-5 py-3 font-semibold text-navy">Continue with Email</button></form>{error && <p className="mt-4 rounded-xl border border-red-300/20 bg-red-500/10 p-3 text-sm text-red-100">{error}</p>}</div></div>;
}
