"use client";
import { useEffect, useState } from "react";
import { AuthGate } from "@/components/auth-gate";
import { useAuth } from "@/components/auth-provider";
import { Card } from "@/components/ui";
import { getMyCompetitionParticipations, getMyCompetitionTeams, getMyCompetitionSubmissions, getPublicCompetitionResults } from "@/lib/repositories/firestore";
export default function MyCompetitions() { const { user } = useAuth(); const [data,setData]=useState<any>({p:[],t:[],s:[],r:[]}); useEffect(()=>{ if(user) Promise.all([getMyCompetitionParticipations(user.uid),getMyCompetitionTeams(user.uid),getMyCompetitionSubmissions(user.uid),getPublicCompetitionResults()]).then(([p,t,s,r])=>setData({p,t,s,r}));},[user]); return <AuthGate><main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">My Competitions</h1><div className="mt-8 grid gap-4 md:grid-cols-4">{[["Registrations",data.p.length],["Teams",data.t.length],["Drafts",data.s.filter((x:any)=>x.status==='draft').length],["Submitted",data.s.filter((x:any)=>x.status&&x.status!=='draft').length]].map(([l,v])=><Card key={l as string}><p className="text-white/50">{l}</p><p className="text-3xl text-blue-200">{v}</p></Card>)}</div><Card className="mt-6"><pre className="text-xs text-white/70">{JSON.stringify(data,null,2)}</pre></Card></main></AuthGate> }
