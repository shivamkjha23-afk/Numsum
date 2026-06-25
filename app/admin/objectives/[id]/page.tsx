import { ObjectivesClient } from "@/components/governance-admin-client";
export default async function Page({params}:{params:Promise<{id:string}>}){ const { id } = await params; return <ObjectivesClient id={id}/>; }
