import { GovernanceDocumentEditorClient } from "@/components/governance-admin-client";
export default async function Page({params}:{params:Promise<{id:string}>}){ const { id } = await params; return <GovernanceDocumentEditorClient id={id}/>; }
