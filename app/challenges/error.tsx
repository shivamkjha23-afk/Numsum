"use client";

import { ErrorState } from "@/components/data-states";

export default function Error({ error }: { error: Error }) {
  return <main className="min-h-screen bg-navy px-6 py-10"><ErrorState message={error.message} /></main>;
}
