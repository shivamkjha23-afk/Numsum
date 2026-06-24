"use client";
import { useEffect, useState } from "react";
import {
  getCompetitions,
  getKnowledgeAssets,
  getProblemStatements,
  getResearchPosts,
} from "@/lib/repositories/firestore";
import type { AssociatedType } from "@/lib/types";

type Option = { id: string; title: string };
const typeLabels: Array<[AssociatedType, string]> = [
  ["problem_statement", "Problem Statement"],
  ["research", "Research"],
  ["competition", "Competition"],
  ["knowledge_asset", "Knowledge Asset"],
];

export function DocumentSelector({
  defaultType,
  defaultId,
}: {
  defaultType?: string | null;
  defaultId?: string | null;
}) {
  const initial = typeLabels.some(([value]) => value === defaultType)
    ? (defaultType as AssociatedType)
    : "problem_statement";
  const [type, setType] = useState<AssociatedType>(initial);
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const load =
      type === "problem_statement"
        ? getProblemStatements(100)
        : type === "research"
          ? getResearchPosts()
          : type === "competition"
            ? getCompetitions()
            : getKnowledgeAssets();
    load
      .then((rows) => {
        if (mounted)
          setOptions(rows.map((row) => ({ id: row.id, title: row.title })));
      })
      .catch(() => {
        if (mounted) setOptions([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [type]);
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <label className="grid gap-2 text-sm text-white/60">
        Document Type
        <select
          name="associatedType"
          value={type}
          onChange={(event) => setType(event.target.value as AssociatedType)}
          className="rounded-xl border border-white/10 bg-black/30 p-3 text-white"
        >
          {typeLabels.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm text-white/60">
        Associated Document
        <select
          name="associatedId"
          defaultValue={defaultId || ""}
          className="rounded-xl border border-white/10 bg-black/30 p-3 text-white"
        >
          <option value="">General discussion / no associated document</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.title}
            </option>
          ))}
        </select>
        {loading && (
          <span className="text-xs text-blue-200">
            Loading matching records...
          </span>
        )}
      </label>
    </div>
  );
}
