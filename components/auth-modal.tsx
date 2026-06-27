"use client";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { authErrorMessage } from "@/lib/auth-errors";
import { ensureUserProfile, isProfileComplete } from "@/lib/repositories/firestore";

function authCode(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error
    ? String((error as { code?: unknown }).code)
    : "";
}

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
  returnTo?: string;
  message?: string;
  onSuccess?: () => void | Promise<void>;
};

export function AuthModal({
  open,
  onClose,
  returnTo,
  message = "Please sign in to continue",
  onSuccess,
}: AuthModalProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"signin" | "join">("signin");
  const [creatingProfile, setCreatingProfile] = useState(false);

  if (!open) return null;

  async function done() {
    const currentUser = auth.currentUser;
    const fallbackReturnTo = returnTo || window.location.pathname || "/";

    if (currentUser) {
      setCreatingProfile(true);
      const profile = await ensureUserProfile(currentUser);
      setCreatingProfile(false);
      if (!isProfileComplete(profile)) {
        onClose();
        router.push(`/profile/complete?returnTo=${encodeURIComponent(fallbackReturnTo)}`);
        return;
      }
    }

    if (onSuccess) {
      await onSuccess();
      return;
    }

    onClose();
    router.push(fallbackReturnTo);
  }

  async function google() {
    setError("");
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      await done();
    } catch (e) {
      setCreatingProfile(false);
      setError(authErrorMessage(e));
    }
  }

  async function email(formData: FormData) {
    setError("");
    const emailValue = String(formData.get("email")).trim();
    const password = String(formData.get("password"));

    try {
      if (mode === "join") {
        await createUserWithEmailAndPassword(auth, emailValue, password);
      } else {
        try {
          await signInWithEmailAndPassword(auth, emailValue, password);
        } catch (e) {
          if (authCode(e) !== "auth/user-not-found" && authCode(e) !== "auth/invalid-credential") {
            throw e;
          }
          await createUserWithEmailAndPassword(auth, emailValue, password);
        }
      }
      await done();
    } catch (e) {
      setError(authErrorMessage(e));
    }
  }

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4 backdrop-blur">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#07111f] p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm uppercase tracking-[.3em] text-blue-300">Protected action</p>
            <h2 className="mt-2 font-display text-3xl">Sign In / Sign Up</h2>
            <p className="mt-2 text-sm text-white/60">{message}</p>
            <p className="mt-2 text-xs text-white/45">
              New email and Google sign-ins create a member account automatically. Admins can upgrade roles later.
            </p>
          </div>
          <button aria-label="Close" onClick={onClose} className="rounded-full border border-white/10 p-2">
            <X size={18} />
          </button>
        </div>

        <button className="mt-6 w-full rounded-full bg-white px-5 py-3 font-semibold text-navy" onClick={google}>
          Continue with Google
        </button>

        <div className="my-4 flex rounded-full border border-white/10 bg-black/20 p-1">
          <button
            type="button"
            className={`flex-1 rounded-full px-4 py-2 text-sm ${mode === "signin" ? "bg-blue-400 text-navy" : "text-white/65"}`}
            onClick={() => setMode("signin")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`flex-1 rounded-full px-4 py-2 text-sm ${mode === "join" ? "bg-blue-400 text-navy" : "text-white/65"}`}
            onClick={() => setMode("join")}
          >
            Create Account
          </button>
        </div>

        <form action={email} className="grid gap-3">
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="rounded-xl border border-white/10 bg-black/30 p-3"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            className="rounded-xl border border-white/10 bg-black/30 p-3"
          />
          <button className="rounded-full bg-blue-400 px-5 py-3 font-semibold text-navy">Continue with Email</button>
        </form>

        {creatingProfile && <p className="mt-4 rounded-xl border border-blue-300/20 bg-blue-500/10 p-3 text-sm text-blue-100">Creating your member profile…</p>}
        {error && <p className="mt-4 rounded-xl border border-red-300/20 bg-red-500/10 p-3 text-sm text-red-100">{error.includes("permission") ? "Could not create member profile. Please retry or contact admin." : error}</p>}
      </div>
    </div>
  );
}
