import { Coins, TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { creditLedger, teachers } from "../../lib/mockData";

export default function AdminCredits() {
  const totalPool = 200_000;
  const consumed = teachers.reduce((s, t) => s + (t.creditMonthlyQuota - t.creditBalance), 0);

  return (
    <div className="mx-auto max-w-6xl space-y-4 p-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-800 dark:text-white">积分管理</h1>
        <p className="mt-0.5 text-xs text-slate-400">管理学校积分池、消耗规则与教师额度分配</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="flex items-center gap-1.5 text-xs text-slate-400">
            <Coins size={13} /> 学校总积分池
          </p>
          <p className="mt-1 text-xl font-semibold text-slate-800 dark:text-white">{totalPool.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="flex items-center gap-1.5 text-xs text-slate-400">
            <TrendingDown size={13} className="text-rose-500" /> 本月已消耗
          </p>
          <p className="mt-1 text-xl font-semibold text-slate-800 dark:text-white">{consumed.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="flex items-center gap-1.5 text-xs text-slate-400">
            <TrendingUp size={13} className="text-emerald-500" /> 剩余可用
          </p>
          <p className="mt-1 text-xl font-semibold text-slate-800 dark:text-white">{(totalPool - consumed).toLocaleString()}</p>
        </Card>
      </div>

      <Card className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-300">积分消耗规则</h2>
          <Button size="sm" variant="secondary">
            编辑规则
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
          {[
            ["AI 助手对话", "1 积分 / 40 字符"],
            ["图片生成", "6 积分 / 张"],
            ["PPT 生成", "20 积分 / 份"],
            ["视频生成", "80 积分 / 次"],
          ].map(([label, rule]) => (
            <div key={label} className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-700/40">
              <p className="text-slate-500 dark:text-slate-400">{label}</p>
              <p className="mt-0.5 font-medium text-slate-700 dark:text-slate-200">{rule}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-600 dark:text-slate-300">消耗流水明细</h2>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 dark:border-slate-700">
              <th className="py-2 font-medium">教师</th>
              <th className="py-2 font-medium">变动</th>
              <th className="py-2 font-medium">原因</th>
              <th className="py-2 font-medium">时间</th>
            </tr>
          </thead>
          <tbody>
            {creditLedger.map((c) => (
              <tr key={c.id} className="border-b border-slate-50 last:border-0 dark:border-slate-800">
                <td className="py-2.5 text-slate-600 dark:text-slate-300">{c.userName}</td>
                <td className={`py-2.5 font-medium ${c.change > 0 ? "text-emerald-600" : "text-rose-500"}`}>
                  {c.change > 0 ? "+" : ""}
                  {c.change}
                </td>
                <td className="py-2.5 text-slate-500 dark:text-slate-400">{c.reason}</td>
                <td className="py-2.5 text-slate-400">{c.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
