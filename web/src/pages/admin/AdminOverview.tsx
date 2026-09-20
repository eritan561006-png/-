import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { TrendingUp, TrendingDown, Users, Zap, FileStack, AlertTriangle } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { teachers } from "../../lib/mockData";

const usageTrend = [
  { day: "9/9", chats: 210, creations: 34 },
  { day: "9/10", chats: 265, creations: 41 },
  { day: "9/11", chats: 190, creations: 28 },
  { day: "9/12", chats: 312, creations: 52 },
  { day: "9/13", chats: 340, creations: 60 },
  { day: "9/14", chats: 118, creations: 15 },
  { day: "9/15", chats: 96, creations: 12 },
];

const moduleShare = [
  { name: "AI 助手对话", value: 48 },
  { name: "命题/审题", value: 20 },
  { name: "教案生成", value: 14 },
  { name: "PPT/绘图", value: 12 },
  { name: "视频/数字人/3D", value: 6 },
];
const PIE_COLORS = ["#1c3d7d", "#2a539f", "#4d78bf", "#cda23a", "#dfbd5c"];

const deptRanking = [
  { dept: "高三年级组", count: 486 },
  { dept: "高二年级组", count: 412 },
  { dept: "高一年级组", count: 358 },
  { dept: "教务处", count: 120 },
];

function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  positive = true,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  delta: string;
  positive?: boolean;
}) {
  return (
    <Card className="p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-200">
          <Icon size={16} />
        </span>
        <span className={`flex items-center gap-0.5 text-xs ${positive ? "text-emerald-600" : "text-rose-500"}`}>
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {delta}
        </span>
      </div>
      <p className="text-xl font-semibold text-slate-800 dark:text-white">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </Card>
  );
}

export default function AdminOverview() {
  const atRiskTeachers = teachers.filter((t) => t.creditBalance < t.creditMonthlyQuota * 0.1 && t.status === "active");

  return (
    <div className="mx-auto max-w-6xl space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-800 dark:text-white">数据看板</h1>
          <p className="mt-0.5 text-xs text-slate-400">全校 AI 教学工具使用总览</p>
        </div>
        <select className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs dark:border-slate-600 dark:bg-slate-800">
          <option>本周</option>
          <option>本月</option>
          <option>本学期</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Users} label="活跃教师数" value="86" delta="+12.4%" />
        <StatCard icon={Zap} label="本月对话总数" value="4,236" delta="+8.1%" />
        <StatCard icon={FileStack} label="本月内容生成数" value="1,024" delta="+15.7%" />
        <StatCard icon={AlertTriangle} label="积分消耗总量" value="38,920" delta="-3.2%" positive={false} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold text-slate-600 dark:text-slate-300">使用趋势（近7天）</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageTrend}>
                <defs>
                  <linearGradient id="chats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1c3d7d" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#1c3d7d" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="creations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#cda23a" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#cda23a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Area type="monotone" dataKey="chats" name="对话次数" stroke="#1c3d7d" strokeWidth={2} fill="url(#chats)" />
                <Area type="monotone" dataKey="creations" name="内容生成数" stroke="#cda23a" strokeWidth={2} fill="url(#creations)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="mb-3 text-sm font-semibold text-slate-600 dark:text-slate-300">各功能模块使用占比</h2>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={moduleShare} dataKey="value" nameKey="name" innerRadius={40} outerRadius={64} paddingAngle={2}>
                  {moduleShare.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-1 space-y-1">
            {moduleShare.map((m, i) => (
              <div key={m.name} className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  {m.name}
                </span>
                <span>{m.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold text-slate-600 dark:text-slate-300">年级组使用排行</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptRanking} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="dept" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="count" fill="#2a539f" radius={[0, 6, 6, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <AlertTriangle size={14} className="text-amber-500" /> 积分预警
          </h2>
          <div className="space-y-2">
            {atRiskTeachers.length === 0 ? (
              <p className="text-xs text-slate-400">暂无积分即将超支的教师</p>
            ) : (
              atRiskTeachers.map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 dark:border-amber-900/40 dark:bg-amber-900/20">
                  <div>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-200">{t.name} · {t.department}</p>
                    <p className="text-[10px] text-slate-400">剩余 {t.creditBalance} / {t.creditMonthlyQuota}</p>
                  </div>
                  <Badge tone="warning">积分不足</Badge>
                </div>
              ))
            )}
            <div className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 dark:border-slate-700">
              <div>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-200">刘洋 · 高二年级组</p>
                <p className="text-[10px] text-slate-400">已连续 44 天未登录</p>
              </div>
              <Badge tone="neutral">长期未登录</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
