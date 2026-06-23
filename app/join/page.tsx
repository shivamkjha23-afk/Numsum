"use client";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui";
import { auth, db } from "@/lib/firebase";

export default function Join() {
  const router = useRouter();
  const [error, setError] = useState("");
  async function submit(formData: FormData) {
    setError("");
    try {
      const displayName = String(formData.get("displayName"));
      const credential = await createUserWithEmailAndPassword(auth, String(formData.get("email")), String(formData.get("password")));
      await updateProfile(credential.user, { displayName });
      await setDoc(doc(db, "users", credential.user.uid), { displayName, email: credential.user.email, role: "member", status: "active", createdAt: serverTimestamp() }, { merge: true });
      router.push("/organizations/dashboard");
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to create account."); }
  }
  return <main className="min-h-screen bg-navy px-6 py-10"><Card className="mx-auto max-w-lg"><h1 className="font-display text-4xl">Join NumSum</h1><p className="mt-3 text-white/60">Create a Firebase Authentication account to contribute.</p><form action={submit} className="mt-6 grid gap-3"><input name="displayName" placeholder="Full name" className="rounded-xl border border-white/10 bg-black/30 p-3" required /><input name="email" type="email" placeholder="Email" className="rounded-xl border border-white/10 bg-black/30 p-3" required /><input name="password" type="password" placeholder="Password" className="rounded-xl border border-white/10 bg-black/30 p-3" required /><button className="rounded-full bg-blue-400 px-5 py-3 font-semibold text-navy">Join</button></form>{error && <p className="mt-4 text-sm text-red-100">{error}</p>}</Card></main>;
}
