import { ObjectiveExecutionClient } from "@/components/execution-admin-client";
export default async function Page({params}:{params:Promise<{id:string}>}){ const { id } = await params; return <ObjectiveExecutionClient id={id}/>; }
