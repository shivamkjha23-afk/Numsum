"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Card } from "@/components/ui";
import { createQuestionnaireTemplate, updateQuestionnaireTemplate } from "@/lib/repositories/firestore";
import type { QuestionnaireQuestion, QuestionnaireQuestionType, QuestionnaireTemplate, QuestionnaireUsageType } from "@/lib/types";

const sectors = ["Manufacturing", "Textile", "Food processing", "Auto components", "Electronics", "Chemical", "Packaging", "Logistics", "Services", "Other"];
const usageTypes: QuestionnaireUsageType[] = ["problem_submission", "onboarding_meeting", "follow_up"];
const statuses: Array<NonNullable<QuestionnaireTemplate["status"]>> = ["draft", "active", "archived"];
const questionTypes: QuestionnaireQuestionType[] = ["text", "textarea", "select", "multi_select", "number", "date", "file_or_link", "rating", "yes_no"];
const input = "rounded-xl border border-white/10 bg-black/30 p-3 text-white placeholder:text-white/35";

function slug(label: string, fallback: string) { return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || fallback; }
function blankQuestion(order: number): QuestionnaireQuestion { return { id: `q-${order}`, label: "", type: "textarea", required: false, options: [], order }; }

export function AdminQuestionnaireForm({ template }: { template?: QuestionnaireTemplate | null }) {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState(template?.title || template?.name || "");
  const [sector, setSector] = useState(template?.sector || String(template?.category || "Manufacturing"));
  const [description, setDescription] = useState(template?.description || "");
  const [usageType, setUsageType] = useState<QuestionnaireUsageType>(template?.usageType || "onboarding_meeting");
  const [status, setStatus] = useState<NonNullable<QuestionnaireTemplate["status"]>>(template?.status || "draft");
  const [questions, setQuestions] = useState<QuestionnaireQuestion[]>(template?.questions?.length ? template.questions : [blankQuestion(1), blankQuestion(2), blankQuestion(3)]);
  const [message, setMessage] = useState("");

  useEffect(() => { if (template) { setTitle(template.title || template.name || ""); setSector(template.sector || String(template.category || "Manufacturing")); setDescription(template.description || ""); setUsageType(template.usageType || "onboarding_meeting"); setStatus(template.status || "draft"); setQuestions(template.questions?.length ? template.questions : [blankQuestion(1)]); } }, [template]);
  function patch(index: number, patchValue: Partial<QuestionnaireQuestion>) { setQuestions((rows) => rows.map((q, i) => i === index ? { ...q, ...patchValue, id: patchValue.label ? slug(patchValue.label, q.id) : q.id } : q)); }
  function remove(index: number) { setQuestions((rows) => rows.filter((_, i) => i !== index).map((q, i) => ({ ...q, order: i + 1 }))); }
  async function save() {
    if (!user) return;
    const clean = questions.filter((q) => q.label.trim()).map((q, index) => ({ ...q, id: slug(q.label, `q-${index + 1}`), order: index + 1, options: q.options || [] }));
    if (!title.trim() || !clean.length) { setMessage("Add a title and at least one question."); return; }
    const payload: Omit<QuestionnaireTemplate, "id" | "createdAt" | "updatedAt"> = { title, name: title, sector, category: sector, industrySegment: sector, description, usageType, status, visibility: usageType === "problem_submission" ? "public" : "admin_only", createdBy: template?.createdBy || user.uid, updatedBy: user.uid, isDefault: false, questions: clean, sections: [{ id: "section-1", title: `${sector} ${usageType.replaceAll("_", " ")}`, description, order: 1, questions: clean }] };
    if (template?.id) await updateQuestionnaireTemplate(template.id, payload); else await createQuestionnaireTemplate(payload);
    setMessage("Questionnaire saved.");
    window.setTimeout(() => router.push("/admin/questionnaires"), 600);
  }
  return <Card><div className="grid gap-4 md:grid-cols-2"><label className="grid gap-2 text-sm text-white/65">Title<input value={title} onChange={(e) => setTitle(e.target.value)} className={input} placeholder="Manufacturing onboarding questionnaire" /></label><label className="grid gap-2 text-sm text-white/65">Sector<select value={sector} onChange={(e) => setSector(e.target.value)} className={input}>{sectors.map((item) => <option key={item}>{item}</option>)}</select></label><label className="grid gap-2 text-sm text-white/65">Usage type<select value={usageType} onChange={(e) => setUsageType(e.target.value as QuestionnaireUsageType)} className={input}>{usageTypes.map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}</select></label><label className="grid gap-2 text-sm text-white/65">Status<select value={status} onChange={(e) => setStatus(e.target.value as NonNullable<QuestionnaireTemplate["status"]>)} className={input}>{statuses.map((item) => <option key={item}>{item}</option>)}</select></label><label className="grid gap-2 text-sm text-white/65 md:col-span-2">Description<textarea value={description} onChange={(e) => setDescription(e.target.value)} className={`${input} min-h-24`} placeholder="When admins should use this template" /></label></div><div className="mt-6 space-y-3"><div className="flex items-center justify-between gap-3"><h2 className="font-display text-2xl">Questions</h2><button type="button" onClick={() => setQuestions((rows) => [...rows, blankQuestion(rows.length + 1)])} className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">Add question</button></div>{questions.map((question, index) => <div key={`${question.id}-${index}`} className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:grid-cols-6"><input value={question.label} onChange={(e) => patch(index, { label: e.target.value })} className={`${input} md:col-span-2`} placeholder="Question label" /><select value={question.type} onChange={(e) => patch(index, { type: e.target.value as QuestionnaireQuestionType })} className={input}>{questionTypes.map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}</select><input value={question.placeholder || ""} onChange={(e) => patch(index, { placeholder: e.target.value })} className={input} placeholder="Placeholder" /><input value={(question.options || []).join(", ")} onChange={(e) => patch(index, { options: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) })} className={input} placeholder="Options" /><label className="flex items-center gap-2 text-sm text-white/70"><input checked={Boolean(question.required)} onChange={(e) => patch(index, { required: e.target.checked })} type="checkbox" /> Required</label><input value={question.helpText || ""} onChange={(e) => patch(index, { helpText: e.target.value })} className={`${input} md:col-span-4`} placeholder="Help text" /><label className="flex items-center gap-2 text-sm text-white/70"><input checked={Boolean(question.adminOnly)} onChange={(e) => patch(index, { adminOnly: e.target.checked })} type="checkbox" /> Admin only later</label><button type="button" onClick={() => remove(index)} className="rounded-full bg-red-500/20 px-4 py-2 text-sm text-red-100">Remove</button></div>)}</div><div className="mt-6 flex flex-wrap items-center gap-3"><button type="button" onClick={save} className="rounded-full bg-blue-400 px-5 py-3 font-semibold text-navy">Save questionnaire</button>{message && <p className="text-sm text-white/65">{message}</p>}</div></Card>;
}
