import { useState } from "react";
import { FileText, Upload, Search, Loader2 } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { knowledgeDocs as initialDocs } from "../../lib/mockData";
import type { KnowledgeDoc } from "../../lib/types";

export default function AdminKnowledge() {
  const [docs, setDocs] = useState<KnowledgeDoc[]>(initialDocs);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);

  function simulateUpload() {
    setUploading(true);
    setTimeout(() => {
      const doc: KnowledgeDoc = {
        id: crypto.randomUUID(),
        name: "2026秋季学期教学计划.pdf",
        subject: "通用",
        type: "校本资料",
        chunks: 0,
        updatedAt: new Date().toISOString().slice(0, 10),
        visibility: "全校可见",
      };
      setDocs((prev) => [doc, ...prev]);
      setUploading(false);
      setTimeout(() => {
        setDocs((prev) => prev.map((d) => (d.id === doc.id ? { ...d, chunks: 216 } : d)));
      }, 1500);
    }, 1200);
  }

  const filtered = docs.filter((d) => d.name.includes(search) || d.subject.includes(search));

  return (
    <div className="mx-auto max-w-6xl space-y-4 p-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-lg font-semibold text-slate-800 dark:text-white">知识库管理</h1>
          <p className="mt-0.5 text-xs text-slate-400">共 {docs.length} 份文档 · {docs.reduce((s, d) => s + d.chunks, 0).toLocaleString()} 个知识片段</p>
        </div>
        <Button size="sm" onClick={simulateUpload} disabled={uploading}>
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? "上传中…" : "上传文档"}
        </Button>
      </div>

      <div className="relative w-64">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索文档名称/学科"
          className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-2 text-xs outline-none focus:border-brand-400 dark:border-slate-600 dark:bg-slate-800"
        />
      </div>

      <Card className="divide-y divide-slate-100 dark:divide-slate-700">
        {filtered.map((d) => (
          <div key={d.id} className="flex items-center justify-between gap-3 p-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-200">
                <FileText size={16} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{d.name}</p>
                <p className="text-[11px] text-slate-400">
                  {d.subject} · {d.type} · 更新于 {d.updatedAt}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Badge tone="neutral">{d.visibility}</Badge>
              {d.chunks === 0 ? (
                <span className="flex items-center gap-1 text-[11px] text-amber-500">
                  <Loader2 size={11} className="animate-spin" /> 解析中
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">{d.chunks} 个片段</span>
              )}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
