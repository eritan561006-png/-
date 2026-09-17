import { useState } from "react";
import { Cpu, Gauge, Percent } from "lucide-react";
import clsx from "clsx";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { modelConfigs as initial } from "../../lib/mockData";
import type { ModelConfig } from "../../lib/types";

export default function AdminModels() {
  const [models, setModels] = useState<ModelConfig[]>(initial);

  function toggle(id: string) {
    setModels((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: m.status === "enabled" ? "disabled" : "enabled" } : m)),
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4 p-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-800 dark:text-white">模型管理</h1>
        <p className="mt-0.5 text-xs text-slate-400">配置接入的大模型、积分倍率与降级策略</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {models.map((m) => (
          <Card key={m.id} className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-200">
                  <Cpu size={16} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{m.name}</p>
                  <p className="text-[11px] text-slate-400">{m.provider}</p>
                </div>
              </div>
              <button
                onClick={() => toggle(m.id)}
                className={clsx(
                  "relative h-5 w-9 rounded-full transition-colors",
                  m.status === "enabled" ? "bg-brand-600" : "bg-slate-300 dark:bg-slate-600",
                )}
              >
                <span
                  className={clsx(
                    "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
                    m.status === "enabled" ? "translate-x-4" : "translate-x-0.5",
                  )}
                />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg bg-slate-50 py-2 dark:bg-slate-700/40">
                <p className="flex items-center justify-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
                  <Percent size={11} /> {m.creditMultiplier}x
                </p>
                <p className="text-[10px] text-slate-400">积分倍率</p>
              </div>
              <div className="rounded-lg bg-slate-50 py-2 dark:bg-slate-700/40">
                <p className="font-semibold text-emerald-600">{m.successRate}%</p>
                <p className="text-[10px] text-slate-400">调用成功率</p>
              </div>
              <div className="rounded-lg bg-slate-50 py-2 dark:bg-slate-700/40">
                <p className="flex items-center justify-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
                  <Gauge size={11} /> {m.latencyMs}ms
                </p>
                <p className="text-[10px] text-slate-400">平均延迟</p>
              </div>
            </div>
            <div className="mt-3">
              <Badge tone={m.status === "enabled" ? "success" : "neutral"}>{m.status === "enabled" ? "已启用" : "已停用"}</Badge>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <h2 className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-300">降级策略</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          当主模型 <b>DeepSeek-V3</b> 调用异常率超过 5% 时，自动切换至备用模型 <b>通义千问-Max</b>，并向管理员发送告警通知。
        </p>
      </Card>
    </div>
  );
}
