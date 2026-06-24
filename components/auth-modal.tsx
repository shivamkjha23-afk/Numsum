"use client";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { authErrorMessage } from "@/lib/auth-errors";

export function AuthModal({ open, onClose, returnTo, message = "Please sign in to continue", onSuccess }: { open: boolean; onClose: () => void; returnTo?: string; message?: string; onSuccess?: () => void | Promise<void> }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"signin" | "join">("signin");
  if (!open) return null;
  async function done() { if (onSuccess) { await onSuccess(); return; } onClose(); router.push(returnTo || window.location.pathname); }
  async function google() { setError(""); try { await signInWithPopup(auth, new GoogleAuthProvider()); await done(); } catch (e) { setError(authErrorMessage(e)); } }
  async function email(formData: FormData) { setError(""); const emailValue = String(formData.get("email")); const password = String(formData.get("password")); try { if (mode === "join") await createUserWithEmailAndPassword(auth, emailValue, password); else await signInWithEmailAndPassword(auth, emailValue, password); await done(); } catch (e) { setError(authErrorMessage(e)); } }
  return <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4 backdrop-blur"><div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#07111f] p-6 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-sm uppercase tracking-[.3em] text-blue-300">Protected action</p><h2 className="mt-2 font-display text-3xl">Sign In / Sign Up</h2><p className="mt-2 text-sm text-white/60">{message}</p></div><button aria-label="Close" onClick={onClose} className="rounded-full border border-white/10 p-2"><X size={18} /></button></div><button className="mt-6 w-full rounded-full bg-white px-5 py-3 font-semibold text-navy" onClick={google}>Continue with Google</button><div className="my-4 flex rounded-full border border-white/10 bg-black/20 p-1"><button type="button" className={`flex-1 rounded-full px-4 py-2 text-sm ${mode === "signin" ? "bg-blue-400 text-navy" : "text-white/65"}`} onClick={() => setMode("signin")}>Sign In</button><button type="button" className={`flex-1 rounded-full px-4 py-2 text-sm ${mode === "join" ? "bg-blue-400 text-navy" : "text-white/65"}`} onClick={() => setMode("join")}>Sign Up</button></div><form action={email} className="grid gap-3"><input name="email" type="email" required placeholder="Email" className="rounded-xl border border-white/10 bg-black/30 p-3" /><input name="password" type="password" required placeholder="Password" className="rounded-xl border border-white/10 bg-black/30 p-3" /><button className="rounded-full bg-blue-400 px-5 py-3 font-semibold text-navy">Continue with Email</button></form>{error && <p className="mt-4 rounded-xl border border-red-300/20 bg-red-500/10 p-3 text-sm text-red-100">{error}</p>}</div></div>;
}
