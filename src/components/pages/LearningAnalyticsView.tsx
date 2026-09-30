import React, { useMemo, useState } from "react";
import { User, LearningClassProfile, PracticeSuggestion } from "../../types";
import { LEARNING_CLASSES, PRACTICE_LIBRARY } from "../../mockData";
import {
  ChartLine,
  Users,
  UserRound,
  Target,
  ClipboardList,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  TriangleAlert,
  Award,
  Timer,
  Send,
} from "lucide-react";

interface LearningAnalyticsViewProps {
  currentUser: User;
  onSendToAssistant: (prompt: string) => void;
}

const WEAK_THRESHOLD = 70;
const ATTENTION_THRESHOLD = 90; // 低于该分数（满分150）列为待关注

const average = (values: number[]) =>
  values.reduce((sum, v) => sum + v, 0) / (values.length || 1);

const masteryTone = (value: number) => {
  if (value < 60) return { bar: "bg-rose-500", text: "text-rose-600", badge: "bg-rose-50 text-rose-700 border-rose-200", label: "薄弱" };
  if (value < WEAK_THRESHOLD) return { bar: "bg-amber-500", text: "text-amber-600", badge: "bg-amber-50 text-amber-700 border-amber-200", label: "待巩固" };
  return { bar: "bg-emerald-500", text: "text-emerald-600", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "良好" };
};

const difficultyTone: Record<PracticeSuggestion["difficulty"], string> = {
  基础巩固: "bg-blue-50 text-blue-700 border-blue-200",
  变式提升: "bg-purple-50 text-purple-700 border-purple-200",
  综合拔高: "bg-amber-50 text-amber-700 border-amber-200",
};

// 轻量 SVG 折线图：主线 + 对比虚线
const TrendChart: React.FC<{
  labels: string[];
  primary: number[];
  compare: number[];
  primaryLabel: string;
  compareLabel: string;
}> = ({ labels, primary, compare, primaryLabel, compareLabel }) => {
  const width = 640;
  const height = 240;
  const pad = { top: 20, right: 24, bottom: 36, left: 40 };
  const all = [...primary, ...compare];
  const lo = Math.floor((Math.min(...all) - 5) / 5) * 5;
  const step = Math.ceil((Math.max(...all) + 5 - lo) / 4 / 5) * 5;
  const min = lo;
  const max = lo + step * 4;
  const x = (i: number) =>
    pad.left + (i * (width - pad.left - pad.right)) / Math.max(labels.length - 1, 1);
  const y = (v: number) =>
    pad.top + ((max - v) * (height - pad.top - pad.bottom)) / (max - min || 1);
  const path = (values: number[]) =>
    values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ");
  const ticks = Array.from({ length: 5 }, (_, i) => min + step * i);
  const areaPath = `${path(primary)} L${x(primary.length - 1)},${height - pad.bottom} L${x(0)},${height - pad.bottom} Z`;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 rounded bg-[#0F2C59]" />
          {primaryLabel}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 border-t-2 border-dashed border-slate-400" />
          {compareLabel}
        </span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img" aria-label="成绩趋势图">
        <defs>
          <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.left} x2={width - pad.right} y1={y(t)} y2={y(t)} stroke="#e2e8f0" strokeWidth={1} />
            <text x={pad.left - 8} y={y(t) + 4} textAnchor="end" fontSize={11} fill="#94a3b8">
              {Math.round(t)}
            </text>
          </g>
        ))}
        <path d={areaPath} fill="url(#trendFill)" />
        <path d={path(compare)} fill="none" stroke="#94a3b8" strokeWidth={2} strokeDasharray="6 5" />
        <path d={path(primary)} fill="none" stroke="#0F2C59" strokeWidth={2.5} strokeLinejoin="round" />
        {primary.map((v, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(v)} r={4} fill="#fff" stroke="#0F2C59" strokeWidth={2} />
            <text x={x(i)} y={y(v) - 10} textAnchor="middle" fontSize={11} fontWeight={600} fill="#0F2C59">
              {v % 1 === 0 ? v : v.toFixed(1)}
            </text>
          </g>
        ))}
        {labels.map((l, i) => (
          <text key={l} x={x(i)} y={height - 12} textAnchor="middle" fontSize={11} fill="#64748b">
            {l}
          </text>
        ))}
      </svg>
    </div>
  );
};

export const LearningAnalyticsView: React.FC<LearningAnalyticsViewProps> = ({
  currentUser,
  onSendToAssistant,
}) => {
  const [classId, setClassId] = useState<string>(LEARNING_CLASSES[0].id);
  const [mode, setMode] = useState<"class" | "student">("class");
  const [studentId, setStudentId] = useState<string | null>(null);

  const cls: LearningClassProfile =
    LEARNING_CLASSES.find((c) => c.id === classId) || LEARNING_CLASSES[0];
  const student =
    mode === "student"
      ? cls.students.find((s) => s.id === studentId) || cls.students[0]
      : null;

  const latestIdx = cls.exams.length - 1;
  const latestScores = cls.students.map((s) => s.scores[latestIdx]);
  const excellentRate = latestScores.filter((s) => s >= cls.fullScore * 0.8).length / latestScores.length;
  const passRate = latestScores.filter((s) => s >= cls.fullScore * 0.6).length / latestScores.length;
  const attentionStudents = cls.students.filter(
    (s) => s.scores[latestIdx] < ATTENTION_THRESHOLD || s.scores[latestIdx] < s.scores[latestIdx - 1] - 1
  );

  // 当前视角下的知识点掌握度（班级或个人），按掌握度升序
  const knowledgeRows = useMemo(
    () =>
      cls.knowledgePoints
        .map((kp, i) => ({
          name: kp.name,
          value: student ? student.mastery[i] : kp.classMastery,
          compare: student ? kp.classMastery : kp.gradeMastery,
        }))
        .sort((a, b) => a.value - b.value),
    [cls, student]
  );
  const weakPoints = knowledgeRows.filter((r) => r.value < WEAK_THRESHOLD);
  const suggestions = (weakPoints.length ? weakPoints : knowledgeRows.slice(0, 2))
    .slice(0, 3)
    .map((r) => ({ ...PRACTICE_LIBRARY[r.name], mastery: r.value }))
    .filter((s) => s.title);

  const trendPrimary = student ? student.scores : cls.classAvg;
  const trendCompare = student ? cls.classAvg : cls.gradeAvg;
  const latest = trendPrimary[latestIdx];
  const delta = latest - trendPrimary[latestIdx - 1];

  const subjectName = student ? `${student.name}（${cls.name}）` : cls.name;
  const buildPrompt = (s: PracticeSuggestion) =>
    `请为${subjectName}${cls.subject}设计一套「${s.title}」跟进练习：共${s.questionCount}题，难度定位为${s.difficulty}，预计用时${s.minutes}分钟。` +
    `重点突破：${s.focus}。当前该知识点掌握度约为${
      knowledgeRows.find((r) => r.name === s.knowledgePoint)?.value ?? "--"
    }%。请按“题目 + 答案 + 解析 + 易错提示”格式输出。`;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/10 text-blue-700 border border-blue-600/20">
              <ChartLine className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              学情分析 · 班级与学生画像
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {currentUser.name} 老师 · {cls.grade}{cls.subject} · 追踪成绩走势、定位薄弱知识点，并一键生成跟进练习（演示数据）
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 text-xs">
            {LEARNING_CLASSES.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setClassId(c.id);
                  setStudentId(null);
                }}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  classId === c.id ? "bg-[#0F2C59] text-white font-medium" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 text-xs">
            {[
              { id: "class", label: "班级总览", icon: Users },
              { id: "student", label: "学生个人", icon: UserRound },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as "class" | "student")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    mode === m.id ? "bg-blue-600 text-white font-medium" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">{student ? "最近一次成绩" : "最近一次班级均分"}</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{latest.toFixed(student ? 0 : 1)}</span>
            <span className="text-xs text-slate-400">/ {cls.fullScore}</span>
          </div>
          <div className={`flex items-center gap-1 text-[11px] font-medium ${delta >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {delta >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            <span>较上次 {delta >= 0 ? "+" : ""}{delta.toFixed(1)} 分</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">{student ? "对比班级均分" : "对比年级均分"}</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {latest - trendCompare[latestIdx] >= 0 ? "+" : ""}
              {(latest - trendCompare[latestIdx]).toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">分</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            {student ? "班级" : "年级"}均分 {trendCompare[latestIdx].toFixed(1)}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">{student ? "薄弱知识点" : "优秀率 / 及格率"}</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            {student ? (
              <>
                <span className="text-2xl sm:text-3xl font-bold text-slate-900">{weakPoints.length}</span>
                <span className="text-xs text-slate-400">个（掌握度 &lt; {WEAK_THRESHOLD}%）</span>
              </>
            ) : (
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">
                {Math.round(excellentRate * 100)}%
                <span className="text-base text-slate-400 font-semibold"> / {Math.round(passRate * 100)}%</span>
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            {student ? `最弱：${knowledgeRows[0].name}` : `优秀 ≥ ${cls.fullScore * 0.8}，及格 ≥ ${cls.fullScore * 0.6}`}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">待关注学生</span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <TriangleAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{attentionStudents.length}</span>
            <span className="text-xs text-slate-400">/ {cls.students.length} 人</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium truncate">
            低于 {ATTENTION_THRESHOLD} 分或成绩下滑
          </div>
        </div>
      </div>

      {/* Row: trend + student list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {student ? `${student.name} · 成绩走势` : `${cls.name} · 班级均分走势`}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">本学期 {cls.exams.length} 次测评，满分 {cls.fullScore} 分</p>
            </div>
            <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
              学期累计 {trendPrimary[latestIdx] - trendPrimary[0] >= 0 ? "+" : ""}
              {(trendPrimary[latestIdx] - trendPrimary[0]).toFixed(1)} 分
            </span>
          </div>
          <TrendChart
            labels={cls.exams}
            primary={trendPrimary}
            compare={trendCompare}
            primaryLabel={student ? student.name : `${cls.name}均分`}
            compareLabel={student ? `${cls.name}均分` : `${cls.grade}年级均分`}
          />
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { label: "学期最高", value: Math.max(...trendPrimary) },
              { label: "学期最低", value: Math.min(...trendPrimary) },
              {
                label: `高于${student ? "班级" : "年级"}均分`,
                value: trendPrimary.filter((v, i) => v > trendCompare[i]).length,
                suffix: ` / ${cls.exams.length} 次`,
              },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[11px] text-slate-500">{item.label}</div>
                <div className="text-lg font-bold text-slate-900">
                  {item.value % 1 === 0 ? item.value : item.value.toFixed(1)}
                  <span className="text-xs font-normal text-slate-400">{item.suffix ?? " 分"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">学生名单</h3>
            <span className="text-[11px] text-slate-400">点击查看个人画像</span>
          </div>
          <div className="divide-y divide-slate-100">
            {[...cls.students]
              .sort((a, b) => b.scores[latestIdx] - a.scores[latestIdx])
              .map((s) => {
                const d = s.scores[latestIdx] - s.scores[latestIdx - 1];
                const weakCount = s.mastery.filter((m) => m < WEAK_THRESHOLD).length;
                const isSelected = student?.id === s.id;
                const needsAttention = attentionStudents.some((a) => a.id === s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setStudentId(s.id);
                      setMode("student");
                    }}
                    className={`w-full flex items-center gap-3 py-2.5 px-2 -mx-2 rounded-xl text-left transition-colors cursor-pointer ${
                      isSelected ? "bg-blue-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                      needsAttention ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-600"
                    }`}>
                      {s.name.slice(-1)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-800 truncate">{s.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {weakCount > 0 ? `${weakCount} 个薄弱点` : "暂无薄弱点"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">{s.scores[latestIdx]}</div>
                      <div className={`text-[11px] font-medium ${d >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        {d >= 0 ? "+" : ""}{d}
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Row: weak knowledge points + practice */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">知识点掌握度</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                按掌握度由低到高排列，竖线为{student ? "班级" : "年级"}平均
              </p>
            </div>
            <span className="text-xs text-rose-600 font-medium bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
              {weakPoints.length} 个薄弱点
            </span>
          </div>
          <div className="space-y-3.5">
            {knowledgeRows.map((r) => {
              const tone = masteryTone(r.value);
              return (
                <div key={r.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-700">{r.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${tone.badge}`}>{tone.label}</span>
                    </div>
                    <span className={`font-bold ${tone.text}`}>{r.value}%</span>
                  </div>
                  <div className="relative h-2 rounded-full bg-slate-100">
                    <div className={`h-2 rounded-full ${tone.bar}`} style={{ width: `${r.value}%` }} />
                    <div
                      className="absolute -top-1 w-0.5 h-4 bg-slate-500 rounded"
                      style={{ left: `${r.compare}%` }}
                      title={`${student ? "班级" : "年级"}平均 ${r.compare}%`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">跟进练习推荐</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                针对{student ? `${student.name}` : "全班"}最薄弱的知识点，可发送到 AI 助手生成题目
              </p>
            </div>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-3">
            {suggestions.map((s) => (
              <div
                key={s.knowledgePoint}
                className="p-4 rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/80 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">{s.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {s.knowledgePoint} · 当前掌握度 <span className={masteryTone(s.mastery).text}>{s.mastery}%</span>
                    </div>
                  </div>
                  <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded border ${difficultyTone[s.difficulty]}`}>
                    {s.difficulty}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">重点：{s.focus}</p>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <ClipboardList className="w-3 h-3" />
                      {s.questionCount} 题
                    </span>
                    <span className="flex items-center gap-1">
                      <Timer className="w-3 h-3" />
                      约 {s.minutes} 分钟
                    </span>
                  </div>
                  <button
                    onClick={() => onSendToAssistant(buildPrompt(s))}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F2C59] hover:bg-blue-900 text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    生成练习
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
