import { AuthGate } from "@/components/auth-gate";
import { MemberContributionsPage } from "@/components/contribution-client";
export default function Page(){return <AuthGate><MemberContributionsPage/></AuthGate>}
