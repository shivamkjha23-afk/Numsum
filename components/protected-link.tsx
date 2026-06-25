"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

const completeProfilePath = (target: string) => `/profile/complete?returnTo=${encodeURIComponent(target)}`;
type Props = React.ComponentProps<typeof Link> & { message?: string; requireComplete?: boolean };
export function ProtectedLink({ href, onClick, message = "Please sign in to continue", requireComplete = true, ...props }: Props) {
  const { user, profileComplete, requestAuth } = useAuth();
  const router = useRouter();
  return <Link href={href} {...props} onClick={(event) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    const target = typeof href === "string" ? href : href.toString();
    if (!user) {
      event.preventDefault();
      requestAuth({ message, returnTo: target, onSuccess: () => router.push(target) });
      return;
    }
    if (requireComplete && !profileComplete && target !== "/profile/complete") {
      event.preventDefault();
      router.push(completeProfilePath(target));
    }
  }} />;
}
