import { useNavigate } from "react-router-dom";
import {
  MessagesSquare,
  PenSquare,
  SearchCheck,
  NotebookPen,
  Presentation,
  Palette,
  UserRound,
  Clapperboard,
  Music2,
  Box,
  ArrowRight,
  Flame,
  Sparkles,
} from "lucide-react";
import { TeacherShell } from "../components/layout/TeacherShell";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { useAuth } from "../lib/auth";
import { initialConversations, skills } from "../lib/mockData";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

const quickActions = [
  { key: "assistant", label: "AI 助手", icon: MessagesSquare, desc: "多轮对话，随时答疑解惑", to: "/assistant", badge: null },
  { key: "compose", label: "命题", icon: PenSquare, desc: "按知识点智能生成试题", to: "/assistant?skill=sk-001", badge: "学校推荐" },
  { key: "review", label: "审题", icon: SearchCheck, desc: "核查覆盖率与难度梯度", to: "/assistant?skill=sk-003", badge: null },
  { key: "lesson", label: "教案", icon: NotebookPen, desc: "生成完整课时教案", to: "/assistant?skill=sk-004", badge: null },
  { key: "ppt", label: "PPT", icon: Presentation, desc: "一键生成教学课件", to: "/studio?type=ppt", badge: null },
  { key: "image", label: "绘图", icon: Palette, desc: "板书插画 / 课件配图", to: "/studio?type=image", badge: null },
  { key: "avatar", label: "数字人", icon: UserRound, desc: "AI 教师形象播报", to: "/studio?type=avatar", badge: "新" },
  { key: "video", label: "视频", icon: Clapperboard, desc: "微课讲解 / 知识点动画", to: "/studio?type=video", badge: null },
  { key: "music", label: "音乐", icon: Music2, desc: "课间铃声 / 朗诵配乐", to: "/studio?type=music", badge: null },
  { key: "3d", label: "3D 模型", icon: Box, desc: "几何体 / 结构模型生成", to: "/studio?type=3d", badge: "新" },
];

const usageTrend = [
  { day: "周一", count: 12 },
  { day: "周二", count: 18 },
  { day: "周三", count: 9 },
  { day: "周四", count: 24 },
  { day: "周五", count: 31 },
  { day: "周六", count: 6 },
  { day: "周日", count: 4 },
];

function formatRelative(ts: number) {
  const diffMin = Math.round((Date.now() - ts) / 60_000);
  if (diffMin < 60) return `${diffMin} 分钟前`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `${diffH} 小时前`;
  return `${Math.round(diffH / 24)} 天前`;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "早上好" : hour < 18 ? "下午好" : "晚上好";
  const recommendedSkills = skills.filter((s) => s.official).slice(0, 4);

  return (
    <TeacherShell>
      <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
        {/* Welcome */}
        <div className="flex flex-col justify-between gap-3 rounded-2xl bg-gradient-to-r from-brand-700 to-brand-600 p-6 text-white sm:flex-row sm:items-center">
          <div>
            <h1 className="text-xl font-semibold">
              {greeting}，{user.name}老师 👋
            </h1>
            <p className="mt-1 text-sm text-brand-100">
              今天是{" "}
              {new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
              　教学金句：因材施教，AI 让每一次备课都更懂学生。
            </p>
          </div>
          <button
            onClick={() => navigate("/assistant")}
            className="flex items-center gap-1.5 self-start rounded-lg bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur hover:bg-white/25 sm:self-auto"
          >
            <Sparkles size={15} /> 立即开始对话
          </button>
        </div>

        {/* Quick actions grid */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-slate-600 dark:text-slate-300">快捷功能</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {quickActions.map((item) => (
              <Card
                key={item.key}
                onClick={() => navigate(item.to)}
                className="group relative cursor-pointer p-4 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {item.badge && (
                  <Badge tone={item.badge === "新" ? "success" : "gold"} className="absolute right-2.5 top-2.5">
                    {item.badge}
                  </Badge>
                )}
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-900/40 dark:text-brand-200">
                  <item.icon size={19} />
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">{item.label}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-slate-400 dark:text-slate-400">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Recent work */}
          <Card className="p-4 lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-300">继续上次的工作</h2>
              <button onClick={() => navigate("/assistant")} className="flex items-center gap-1 text-xs text-brand-600 hover:underline dark:text-brand-300">
                查看全部 <ArrowRight size={12} />
              </button>
            </div>
            <div className="space-y-2">
              {initialConversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => navigate(`/assistant?conv=${c.id}`)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-100 p-3 text-left hover:border-brand-200 hover:bg-brand-50/40 dark:border-slate-700 dark:hover:bg-slate-700/40"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-100">{c.title}</p>
                    <p className="mt-0.5 truncate text-[11px] text-slate-400">
                      {c.messages[c.messages.length - 1]?.content.slice(0, 44)}…
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] text-slate-400">{formatRelative(c.updatedAt)}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Usage mini panel */}
          <Card className="p-4">
            <h2 className="mb-1 text-sm font-semibold text-slate-600 dark:text-slate-300">本月使用概览</h2>
            <div className="mb-3 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-semibold text-brand-700 dark:text-brand-200">42</p>
                <p className="text-[10px] text-slate-400">教案</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-brand-700 dark:text-brand-200">128</p>
                <p className="text-[10px] text-slate-400">试题</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-brand-700 dark:text-brand-200">17</p>
                <p className="text-[10px] text-slate-400">课件</p>
              </div>
            </div>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={usageTrend} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                  <defs>
                    <linearGradient id="usageFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2a539f" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#2a539f" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                    labelStyle={{ fontSize: 11 }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#2a539f" strokeWidth={2} fill="url(#usageFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              积分消耗：{(2000 - user.creditBalance).toLocaleString()} / {user.creditMonthlyQuota.toLocaleString()}
            </p>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-gold-400"
                style={{ width: `${Math.min(100, ((user.creditMonthlyQuota - user.creditBalance) / user.creditMonthlyQuota) * 100)}%` }}
              />
            </div>
          </Card>
        </div>

        {/* Recommended skills */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <Flame size={14} className="text-gold-500" /> 学校本学期重点推荐 Skill
            </h2>
            <button onClick={() => navigate("/skills")} className="flex items-center gap-1 text-xs text-brand-600 hover:underline dark:text-brand-300">
              前往 Skill 中心 <ArrowRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {recommendedSkills.map((s) => (
              <Card
                key={s.id}
                onClick={() => navigate(`/assistant?skill=${s.id}`)}
                className="cursor-pointer p-4 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-2xl">{s.icon}</span>
                  <Badge tone="brand">学校认证</Badge>
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">{s.name}</p>
                <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-400">{s.description}</p>
                <p className="mt-2 text-[11px] text-gold-600 dark:text-gold-300">
                  ⭐ {s.rating} · {s.usageCount.toLocaleString()} 次使用
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </TeacherShell>
  );
}
