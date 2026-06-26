"use client";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui";
import { auth } from "@/lib/firebase";
import { createAdminApplication, ensureUserProfile } from "@/lib/repositories/firestore";

export default function Join() {
  const router = useRouter();
  const [error, setError] = useState("");
  async function submit(formData: FormData) {
    setError("");
    try {
      const displayName = String(formData.get("displayName"));
      const email = String(formData.get("email"));
      const roleChoice = String(formData.get("role"));
      const requestedRole = roleChoice.toLowerCase();
      const credential = await createUserWithEmailAndPassword(auth, email, String(formData.get("password")));
      await updateProfile(credential.user, { displayName });
      await ensureUserProfile(credential.user);
      if (requestedRole !== "member") await createAdminApplication({ userId: credential.user.uid, name: displayName, email, requestedRole: requestedRole as never, motivation: `Requested ${roleChoice} role during signup`, skills: [] });
      router.push("/profile/complete?returnTo=/dashboard");
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to create account."); }
  }
  return <main className="min-h-screen bg-navy px-6 py-10"><Card className="mx-auto max-w-lg"><h1 className="font-display text-4xl">Join NumSum Labs</h1><p className="mt-3 text-white/60">Create a Firebase Authentication account to contribute.</p><form action={submit} className="mt-6 grid gap-3"><input name="displayName" placeholder="Full name" className="rounded-xl border border-white/10 bg-black/30 p-3" required /><input name="email" type="email" placeholder="Email" className="rounded-xl border border-white/10 bg-black/30 p-3" required /><input name="password" type="password" placeholder="Password" className="rounded-xl border border-white/10 bg-black/30 p-3" required /><label className="grid gap-2 text-sm text-white/70">Role Requested<select name="role" className="rounded-xl border border-white/10 bg-black/30 p-3" defaultValue="member">{["member", "reviewer", "admin", "moderator", "organization"].map((role) => <option key={role} value={role}>{role.replace("_", " ")}</option>)}</select></label><button className="rounded-full bg-blue-400 px-5 py-3 font-semibold text-navy">Create Account</button></form>{error && <p className="mt-4 text-sm text-red-100">{error}</p>}</Card></main>;
}
