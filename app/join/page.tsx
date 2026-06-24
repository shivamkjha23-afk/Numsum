"use client";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui";
import { auth, db } from "@/lib/firebase";
import { createAdminApplication } from "@/lib/repositories/firestore";

export default function Join() {
  const router = useRouter();
  const [error, setError] = useState("");
  async function submit(formData: FormData) {
    setError("");
    try {
      const displayName = String(formData.get("displayName"));
      const email = String(formData.get("email"));
      const roleChoice = String(formData.get("role"));
      const role = roleChoice === "pending_admin" ? "pending_admin" : "member";
      const credential = await createUserWithEmailAndPassword(auth, email, String(formData.get("password")));
      await updateProfile(credential.user, { displayName });
      await setDoc(doc(db, "users", credential.user.uid), { displayName, email: credential.user.email, role, status: "active", createdAt: serverTimestamp() }, { merge: true });
      if (role === "pending_admin") await createAdminApplication({ userId: credential.user.uid, name: displayName, email, motivation: "Requested admin role during signup", skills: [] });
      router.push("/dashboard");
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to create account."); }
  }
  return <main className="min-h-screen bg-navy px-6 py-10"><Card className="mx-auto max-w-lg"><h1 className="font-display text-4xl">Join NumSum</h1><p className="mt-3 text-white/60">Create a Firebase Authentication account to contribute.</p><form action={submit} className="mt-6 grid gap-3"><input name="displayName" placeholder="Full name" className="rounded-xl border border-white/10 bg-black/30 p-3" required /><input name="email" type="email" placeholder="Email" className="rounded-xl border border-white/10 bg-black/30 p-3" required /><input name="password" type="password" placeholder="Password" className="rounded-xl border border-white/10 bg-black/30 p-3" required /><fieldset className="rounded-2xl border border-white/10 p-4"><legend className="px-2 text-blue-300">Select Role</legend><label className="mt-2 flex gap-3 text-white/70"><input name="role" type="radio" value="member" defaultChecked /> Member</label><label className="mt-2 flex gap-3 text-white/70"><input name="role" type="radio" value="pending_admin" /> Admin Applicant</label></fieldset><button className="rounded-full bg-blue-400 px-5 py-3 font-semibold text-navy">Join Community</button></form>{error && <p className="mt-4 text-sm text-red-100">{error}</p>}</Card></main>;
}
