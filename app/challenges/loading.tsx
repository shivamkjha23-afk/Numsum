import { LoadingState } from "@/components/data-states";

export default function Loading() {
  return <main className="min-h-screen bg-navy px-6 py-10"><LoadingState label="Loading challenges from Firestore" /></main>;
}
