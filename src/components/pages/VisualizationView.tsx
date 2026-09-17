import React, { useState } from "react";
import { User } from "../../types";
import { VISUALIZATION_DATA } from "../../mockData";
import {
  BarChart3,
  TrendingUp,
  Award,
  Layers,
  Calendar,
  Filter,
  Download,
  Clock,
  Sparkles,
  BookOpen,
  PieChart,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";

interface VisualizationViewProps {
  currentUser: User;
}

export const VisualizationView: React.FC<VisualizationViewProps> = ({
  currentUser,
}) => {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "semester">("30d");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [activeChartMetric, setActiveChartMetric] = useState<"questions" | "ppts" | "lessonPlans">("questions");

  const data = VISUALIZATION_DATA;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/10 text-blue-700 border border-blue-600/20">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              西附两江 · 全校智能教研数据可视化大屏
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            实时监测备课组智能命题、大单元教案创编、课件多模态生成与高考考点覆盖热力。
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Grade filter */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 text-xs">
            {["all", "高一", "高二", "高三"].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  selectedGrade === g
                    ? "bg-[#0F2C59] text-white font-medium"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {g === "all" ? "全学段" : g}
              </button>
            ))}
          </div>

          {/* Time range */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 text-xs">
            {[
              { id: "7d", label: "近7天" },
              { id: "30d", label: "近30天" },
              { id: "semester", label: "本学期" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeRange(t.id as any)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  timeRange === t.id
                    ? "bg-blue-600 text-white font-medium"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              alert("已导出《西附两江中学智能教育教研质量与效率分析报告 (PDF)》")
            }
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">导出研判报告</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">累计赋能备课时长</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-sans text-slate-900">
              {data.overviewMetrics.weeklyAiAssistedHours.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">小时</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <ArrowUpRight className="w-3 h-3" />
            <span>较上学期同期提升 +34.2%</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">试题与变式产出量</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-sans text-slate-900">
              {data.overviewMetrics.generatedQuestionsTotal.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">道大题</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <ArrowUpRight className="w-3 h-3" />
            <span>审核通过入库率 92.6%</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">多模态微课与课件</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-sans text-slate-900">
              {data.overviewMetrics.multimodalAssetsCount.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">件</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-blue-600 font-medium">
            <span>含 PPT/科学插图/视频</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">校本知识库切片检索</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-sans text-slate-900">
              {data.overviewMetrics.knowledgeChunksIndexed.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">段向量切片</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <CheckCircle2 className="w-3 h-3" />
            <span>平均考纲匹配度 94.8%</span>
          </div>
        </div>
      </div>

      {/* Row 2: Subject Adoption & Exam Difficulty Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Subject AI Adoption Ranking Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                各学科备课组 AI 深度应用横向对比
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                统计全校各学科在智能命题、审题与教案编写的活跃度与渗透率
              </p>
            </div>
            <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
              数学/语文组领跑
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {data.subjectAdoption.map((sub, idx) => (
              <div key={sub.subject} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-600">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {sub.subject}备课组
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      ({sub.activeTeachers} 位在教教师)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-900">
                      {sub.count.toLocaleString()} 次调用
                    </span>
                    <span className="text-emerald-600 font-medium text-[11px]">
                      {sub.growth}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      idx === 0
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600"
                        : idx === 1
                        ? "bg-gradient-to-r from-amber-500 to-orange-500"
                        : idx === 2
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                        : "bg-slate-400"
                    }`}
                    style={{ width: `${sub.percentage * 2.2}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Difficulty Coefficient Distribution vs Target */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              试题难度系数分布与考纲对标
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              监控 AI 命制试卷难度梯度分布是否符合新高考区分度
            </p>
          </div>

          <div className="space-y-4 my-auto">
            {data.difficultyDistribution.map((item) => (
              <div key={item.range} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-800">
                    {item.label} · {item.range}
                  </span>
                  <div className="space-x-2 font-mono text-[11px]">
                    <span className="text-blue-700 font-bold">
                      当前 {item.actualPct}%
                    </span>
                    <span className="text-slate-400">
                      (目标 {item.targetPct}%)
                    </span>
                  </div>
                </div>

                {/* Dual bar: Actual vs Target */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative">
                  <div
                    className="bg-[#0F2C59] h-full rounded-full transition-all"
                    style={{ width: `${item.actualPct * 2}%` }}
                  ></div>
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-amber-500 rounded"
                    style={{ left: `${item.targetPct * 2}%` }}
                    title={`目标标准值: ${item.targetPct}%`}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 leading-relaxed">
            <span className="font-bold">教研评估结论：</span>
            试题难度总体呈现经典正态分布，“0.35-0.55核心区分段”占比合理，拔尖压轴与通法题目梯级设置符合西附学生学情。
          </div>
        </div>
      </div>

      {/* Row 3: Weekly Creation Trend & High School Core Knowledge Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Trend line visualization */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                全校备课资源周度创编产出趋势
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                随着期中及高三一轮复习深入，全校教研资源生成量呈稳步攀升趋势
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              {[
                { id: "questions", label: "试题与变式" },
                { id: "ppts", label: "课件 PPT" },
                { id: "lessonPlans", label: "单元导学案" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveChartMetric(tab.id as any)}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    activeChartMetric === tab.id
                      ? "bg-white text-blue-900 font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Trend Area Chart */}
          <div className="pt-4 h-64 w-full flex flex-col justify-end">
            <div className="h-48 w-full flex items-end justify-between gap-3 px-2">
              {data.weeklyCreationTrend.map((item, idx) => {
                const val = item[activeChartMetric];
                const maxVal =
                  activeChartMetric === "questions"
                    ? 2400
                    : activeChartMetric === "ppts"
                    ? 700
                    : 400;
                const heightPercent = Math.min(100, Math.round((val / maxVal) * 100));

                return (
                  <div
                    key={item.week}
                    className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                  >
                    <span className="text-[11px] font-mono font-bold text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      {val}
                    </span>
                    <div className="w-full max-w-[48px] bg-slate-100 rounded-t-xl overflow-hidden h-40 flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-[#0F2C59] via-blue-600 to-indigo-500 rounded-t-xl transition-all duration-500 group-hover:brightness-110"
                        style={{ height: `${heightPercent}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      {item.week}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-slate-200 mt-2 pt-2 flex justify-between text-[11px] text-slate-400">
              <span>第 1 周 (开学准备)</span>
              <span>第 6 周 (当前复习冲刺)</span>
            </div>
          </div>
        </div>

        {/* Right: Knowledge Point Mastery & Coverage Radar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              高考核心能力维度覆盖率
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              与西附两江校本标准常模基准对比
            </p>
          </div>

          <div className="space-y-3 pt-1">
            {data.knowledgeRadar.map((k) => (
              <div key={k.dimension} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-700 font-medium">{k.dimension}</span>
                  <div className="space-x-1.5 text-[11px] font-mono">
                    <span className="font-bold text-blue-700">{k.score}分</span>
                    <span className="text-slate-400">/ 基准 {k.benchmark}</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${k.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>达标率：98.2%</span>
            <span className="text-blue-600 font-medium">六大能力图谱完整</span>
          </div>
        </div>
      </div>

      {/* Row 4: Top Teacher Contributors Leaderboard */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              西附名师 · 智能教研共建贡献榜
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              表彰在创建校本 Skill、贡献优质命题与上传精品导学案方面表现卓越的教师
            </p>
          </div>
          <span className="text-xs text-amber-900 bg-amber-100 px-3 py-1 rounded-full font-medium border border-amber-200">
            每月教研积分特别奖励
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-2">
          {data.topTeacherContributors.map((teacher) => (
            <div
              key={teacher.rank}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between space-y-2 relative"
            >
              {/* Rank Medal */}
              <div className="flex items-center justify-between">
                <span
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                    teacher.rank === 1
                      ? "bg-amber-400 text-slate-950 shadow-xs"
                      : teacher.rank === 2
                      ? "bg-slate-300 text-slate-800"
                      : teacher.rank === 3
                      ? "bg-amber-700 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {teacher.rank}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {teacher.department}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {teacher.name}
                </h4>
                <p className="text-xs text-slate-500">{teacher.subject}</p>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">累计沉淀</span>
                <span className="font-bold font-mono text-blue-700">
                  {teacher.contributions} 件
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
