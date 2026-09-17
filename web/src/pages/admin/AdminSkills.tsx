import { useState } from "react";
import { Check, X, Star, PlayCircle } from "lucide-react";
import clsx from "clsx";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { skills as initialSkills } from "../../lib/mockData";
import type { SkillItem } from "../../lib/types";

export default function AdminSkills() {
  const [list, setList] = useState<SkillItem[]>(initialSkills);
  const [tab, setTab] = useState<"pending" | "published">("pending");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const pending = list.filter((s) => s.status === "pending");
  const published = list.filter((s) => s.status === "published" && s.scope === "public");

  function approve(id: string) {
    setList((prev) => prev.map((s) => (s.id === id ? { ...s, status: "published", official: false } : s)));
  }

  function reject(id: string) {
    setList((prev) => prev.map((s) => (s.id === id ? { ...s, status: "rejected" } : s)));
    setRejectingId(null);
    setRejectReason("");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4 p-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-800 dark:text-white">Skill 管理</h1>
        <p className="mt-0.5 text-xs text-slate-400">审核教师提交的公共 Skill 申请，管理已发布 Skill</p>
      </div>

      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-700">
        {(["pending", "published"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              "px-4 py-2 text-sm font-medium",
              tab === t ? "border-b-2 border-brand-600 text-brand-700 dark:text-brand-200" : "text-slate-400",
            )}
          >
            {t === "pending" ? `待审核 (${pending.length})` : `已发布公共 Skill (${published.length})`}
          </button>
        ))}
      </div>

      {tab === "pending" ? (
        pending.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400">暂无待审核 Skill</p>
        ) : (
          <div className="space-y-3">
            {pending.map((s) => (
              <Card key={s.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <span className="text-2xl">{s.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{s.name}</p>
                      <p className="text-[11px] text-slate-400">
                        {s.ownerName} 提交 · {s.subject} · {s.type}
                      </p>
                      <p className="mt-1 max-w-lg text-xs text-slate-500 dark:text-slate-400">{s.description}</p>
                      <div className="mt-2 rounded-lg bg-slate-50 p-2 dark:bg-slate-700/40">
                        <code className="text-[11px] text-slate-500 dark:text-slate-300">{s.promptTemplate}</code>
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1.5">
                    <Button size="sm" variant="secondary">
                      <PlayCircle size={13} /> 测试运行
                    </Button>
                    <Button size="sm" onClick={() => approve(s.id)}>
                      <Check size={13} /> 通过
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => setRejectingId(s.id)}>
                      <X size={13} /> 驳回
                    </Button>
                  </div>
                </div>

                {rejectingId === s.id && (
                  <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3 dark:border-slate-700">
                    <input
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="请填写驳回原因"
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs dark:border-slate-600 dark:bg-slate-900"
                    />
                    <Button size="sm" variant="danger" disabled={!rejectReason.trim()} onClick={() => reject(s.id)}>
                      确认驳回
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setRejectingId(null)}>
                      取消
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {published.map((s) => (
            <Card key={s.id} className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-2xl">{s.icon}</span>
                {s.official ? <Badge tone="brand">学校认证</Badge> : <Badge tone="success">已发布</Badge>}
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{s.name}</p>
              <p className="mt-1 line-clamp-2 text-[11px] text-slate-400">{s.description}</p>
              <p className="mt-2 flex items-center gap-1 text-[11px] text-gold-600 dark:text-gold-300">
                <Star size={11} className="fill-gold-400 text-gold-400" /> {s.rating || "-"} · {s.usageCount.toLocaleString()} 次使用
              </p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="secondary" className="flex-1">
                  调整推荐位
                </Button>
                <Button size="sm" variant="ghost">
                  下架
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
