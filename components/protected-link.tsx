"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

type Props = React.ComponentProps<typeof Link> & { message?: string };
export function ProtectedLink({ href, onClick, message = "Please sign in to continue", ...props }: Props) {
  const { user, requestAuth } = useAuth();
  const router = useRouter();
  return <Link href={href} {...props} onClick={(event) => { onClick?.(event); if (event.defaultPrevented) return; if (!user) { event.preventDefault(); const target = typeof href === "string" ? href : href.toString(); requestAuth({ message, returnTo: target, onSuccess: () => router.push(target) }); } }} />;
}
