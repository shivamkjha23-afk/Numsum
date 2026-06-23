import Link from "next/link";
import { cn } from "@/lib/utils";
export function Button({href,children,variant="primary"}:{href:string;children:React.ReactNode;variant?:"primary"|"secondary"}){return <Link href={href} className={cn("rounded-full px-5 py-3 text-sm font-semibold transition",variant==="primary"?"bg-white text-black hover:bg-blue-100":"glass text-white hover:border-blue-300")}>{children}</Link>}
export function Card({children,className}:{children:React.ReactNode;className?:string}){return <div className={cn("glass rounded-3xl p-6",className)}>{children}</div>}
