"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminQuestionnaireForm } from "@/components/admin-questionnaire-form";
import { EmptyState, LoadingState } from "@/components/data-states";
import { getQuestionnaireTemplateById } from "@/lib/repositories/firestore";
import type { QuestionnaireTemplate } from "@/lib/types";
export default function EditQuestionnairePage() { const { id } = useParams<{ id: string }>(); const [template, setTemplate] = useState<QuestionnaireTemplate | null>(null); const [loading, setLoading] = useState(true); useEffect(() => { getQuestionnaireTemplateById(id).then(setTemplate).finally(()=>setLoading(false)); }, [id]); if (loading) return <LoadingState label="Loading questionnaire" />; if (!template) return <main className="px-4 py-8 md:px-8"><EmptyState title="Questionnaire not found" /></main>; return <main className="px-4 py-8 md:px-8"><div className="mx-auto max-w-5xl"><Link href="/admin/questionnaires" className="text-sm text-blue-200">← Back to questionnaires</Link><p className="mt-6 text-sm uppercase tracking-[.28em] text-blue-300">Admin forms</p><h1 className="mt-3 font-display text-4xl md:text-5xl">Edit Questionnaire</h1><div className="mt-6"><AdminQuestionnaireForm template={template} /></div></div></main>; }
