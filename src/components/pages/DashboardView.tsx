import React from "react";
import { User, TeachingSkill } from "../../types";
import {
  MessageSquare,
  FileCheck2,
  BookOpen,
  Presentation,
  Image,
  Video,
  Music,
  UserCheck,
  Box,
  PenTool,
  Clock,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Flame,
  Award,
  Calendar,
  CloudSun,
  Bookmark,
  BarChart3,
  Compass,
  Command,
  Wand2,
} from "lucide-react";

interface DashboardViewProps {
  currentUser: User;
  onNavigate: (view: string, extraParams?: any) => void;
  publicSkills: TeachingSkill[];
  onOpenAITools?: () => void;
  onOpenQuickCommands?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  onNavigate,
  publicSkills,
  onOpenAITools,
  onOpenQuickCommands,
}) => {
  // 10 Core Function Cards
  const coreFeatures = [
    {
      id: "assistant",
      name: "AI 教学助手",
      desc: "多轮教学对话、备课研讨与教情启发",
      icon: MessageSquare,
      color: "bg-blue-50 text-blue-700",
      badge: null,
      targetView: "assistant",
    },
    {
      id: "gaokao-math-exam",
      name: "高考专项命题",
      desc: "结合新高考考纲，精准命制大题与评分细则",
      icon: PenTool,
      color: "bg-indigo-50 text-indigo-700",
      badge: "学校推荐",
      targetView: "assistant",
      skillId: "gaokao-math-exam",
    },
    {
      id: "exam-review",
      name: "试卷智能审题",
      desc: "三审三校、排查题意盲区、难度预估",
      icon: FileCheck2,
      color: "bg-emerald-50 text-emerald-700",
      badge: "全新上线",
      targetView: "assistant",
      skillId: "exam-review",
    },
    {
      id: "lesson-plan",
      name: "大单元教案生成",
      desc: "素养目标驱动、任务群构建与分层板书",
      icon: BookOpen,
      color: "bg-amber-50 text-amber-700",
      badge: null,
      targetView: "assistant",
      skillId: "lesson-plan",
    },
    {
      id: "studio-ppt",
      name: "学术课件 PPT",
      desc: "根据课题大纲一键生成西附风格研讨课件",
      icon: Presentation,
      color: "bg-purple-50 text-purple-700",
      badge: "高频使用",
      targetView: "studio",
      studioTab: "ppt",
    },
    {
      id: "studio-image",
      name: "教学板书插画",
      desc: "理化生科学实验示意图与诗歌意境绘图",
      icon: Image,
      color: "bg-rose-50 text-rose-700",
      badge: null,
      targetView: "studio",
      studioTab: "image",
    },
    {
      id: "studio-digital-human",
      name: "虚拟名师数字人",
      desc: "名师出镜播报微课与诗歌经典带读",
      icon: UserCheck,
      color: "bg-cyan-50 text-cyan-700",
      badge: null,
      targetView: "studio",
      studioTab: "digital_human",
    },
    {
      id: "studio-video",
      name: "教学微课视频",
      desc: "三维实验仿真脚本与重难点动态演示",
      icon: Video,
      color: "bg-orange-50 text-orange-700",
      badge: null,
      targetView: "studio",
      studioTab: "video",
    },
    {
      id: "studio-music",
      name: "课堂情境音乐",
      desc: "课前静心、古文经典吟诵与课间放松音律",
      icon: Music,
      color: "bg-pink-50 text-pink-700",
      badge: null,
      targetView: "studio",
      studioTab: "music",
    },
    {
      id: "studio-3d",
      name: "3D 教学模型",
      desc: "立体几何构件、生物细胞与物理实验装置",
      icon: Box,
      color: "bg-teal-50 text-teal-700",
      badge: null,
      targetView: "studio",
      studioTab: "3d_model",
    },
  ];

  // Recent Ongoing Work Drafts
  const recentDrafts = [
    {
      title: "高三一轮复习《圆锥曲线综合大题》专题命题",
      type: "命题",
      updatedAt: "今天 09:24",
      summary: "已完成抛物线焦点弦第(2)问角平分线垂直对称性证明及评分细则...",
      action: () => onNavigate("assistant", { initialPrompt: "继续编辑圆锥曲线专题命题" }),
    },
    {
      title: "高二语文统编必修下《蜀道难》意境微课 PPT",
      type: "PPT课件",
      updatedAt: "昨天 16:30",
      summary: "已生成 6 页大纲，包含五丁开山路线图与李白浪漫主义风格细读...",
      action: () => onNavigate("studio", { studioTab: "ppt" }),
    },
    {
      title: "高中物理数字化探究实验《验证牛顿第二定律》",
      type: "教案",
      updatedAt: "3天前",
      summary: "已配置光电门传感器采集参数与学生小组探究数据对照表...",
      action: () => onNavigate("assistant", { initialPrompt: "打开牛顿第二定律实验方案" }),
    },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* 1. Welcome & School Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F2C59] via-[#1A365D] to-[#0A192F] p-6 sm:p-8 text-white shadow-xl shadow-blue-950/10 border border-blue-900/40">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(#60a5fa_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-medium">
                西附两江 · 高中智慧教学平台
              </span>
              <div className="flex items-center gap-1.5 text-xs text-blue-200">
                <Calendar className="w-3.5 h-3.5" />
                <span>2026年9月16日 星期三</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-blue-200">
                <CloudSun className="w-3.5 h-3.5 text-amber-300" />
                <span>重庆两江 22℃ 晴朗</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              早上好，{currentUser.name} 老师 👋
            </h2>

            <p className="text-sm text-blue-100/90 leading-relaxed">
              西附教研寄语：“学起于思，思源于疑。善教者，使人继其志。”
              <br className="hidden sm:inline" />
              今日新高考真题库与部编版大单元教案模版已完成同步，请尽情发挥您的教学灵感。
            </p>
          </div>

          {/* Quick Action Button to Start Assistant */}
          <div className="shrink-0 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => onNavigate("assistant")}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-900/30 hover:scale-[1.02] transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
              <span>开启 AI 备课对话</span>
            </button>
            {onOpenAITools && (
              <button
                onClick={onOpenAITools}
                className="px-3.5 py-2.5 rounded-xl bg-blue-600/80 hover:bg-blue-600 border border-blue-400/40 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Wand2 className="w-4 h-4 text-amber-300" />
                <span>AI 专项工具箱</span>
              </button>
            )}
            <button
              onClick={() => onNavigate("skills")}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>全校 Skill 库</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1.5 Quick Research Shortcuts Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigate("favorites")}
          className="p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-amber-400 hover:shadow-md transition-all flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="p-2.5 rounded-lg bg-amber-50 text-amber-700 group-hover:scale-105 transition-transform">
            <Bookmark className="w-5 h-5 fill-amber-500/20" />
          </div>
          <div>
            <span className="font-bold text-slate-800 text-xs sm:text-sm block group-hover:text-amber-700">
              教研资源收藏夹
            </span>
            <span className="text-[11px] text-slate-400">已沉淀名师精品试题</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate("visualization")}
          className="p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700 group-hover:scale-105 transition-transform">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-800 text-xs sm:text-sm block group-hover:text-blue-700">
              教研数据可视化
            </span>
            <span className="text-[11px] text-slate-400">各学科渗透率与考点图谱</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate("guide")}
          className="p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-emerald-400 hover:shadow-md transition-all flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-800 text-xs sm:text-sm block group-hover:text-emerald-700">
              教师使用指南
            </span>
            <span className="text-[11px] text-slate-400">快速上手与精选Prompt</span>
          </div>
        </button>

        <button
          onClick={() => {
            if (onOpenQuickCommands) {
              onOpenQuickCommands();
            } else {
              onNavigate("assistant");
            }
          }}
          className="p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-purple-400 hover:shadow-md transition-all flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="p-2.5 rounded-lg bg-purple-50 text-purple-700 group-hover:scale-105 transition-transform">
            <Command className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-800 text-xs sm:text-sm block group-hover:text-purple-700">
              快捷指令配置
            </span>
            <span className="text-[11px] text-slate-400">7款 / 命题审题斜杠命令</span>
          </div>
        </button>
      </div>

      {/* 2. 10 Core Feature Cards Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>核心教学功能入口</span>
              <span className="text-xs font-normal text-slate-500">（点击一键直达专业工作台）</span>
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {coreFeatures.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.id}
                onClick={() => {
                  if (f.skillId) {
                    onNavigate(f.targetView, { activeSkillId: f.skillId });
                  } else if (f.studioTab) {
                    onNavigate(f.targetView, { studioTab: f.studioTab });
                  } else {
                    onNavigate(f.targetView);
                  }
                }}
                className="group relative p-4 rounded-xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                {/* Badge if present */}
                {f.badge && (
                  <span className="absolute top-3 right-3 text-[10px] px-1.5 py-0.5 rounded-md font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    {f.badge}
                  </span>
                )}

                <div>
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${f.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-sm text-slate-800 group-hover:text-blue-900 transition-colors">
                    {f.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {f.desc}
                  </p>
                </div>

                <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-400 group-hover:text-blue-600 transition-colors">
                  <span>立即使用</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Two Columns: Continue Work + Personal Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Continue Last Work */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>继续上次的工作</span>
            </h3>
            <span className="text-xs text-slate-400">自动实时云端保存</span>
          </div>

          <div className="space-y-3">
            {recentDrafts.map((draft, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium border border-blue-100">
                      {draft.type}
                    </span>
                    <h4 className="font-semibold text-xs sm:text-sm text-slate-800 hover:text-blue-700 cursor-pointer">
                      {draft.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{draft.summary}</p>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-0.5">
                    <span>最后更新：{draft.updatedAt}</span>
                  </div>
                </div>

                <button
                  onClick={draft.action}
                  className="shrink-0 px-3.5 py-2 rounded-lg bg-slate-50 hover:bg-blue-50 text-blue-900 text-xs font-semibold border border-slate-200 hover:border-blue-200 transition-colors self-start sm:self-center cursor-pointer"
                >
                  继续编辑
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Right 1 Col: Monthly Teaching Stats Panel */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>本月教学数字成果</span>
            </h3>
            <span className="text-xs text-blue-600 font-medium cursor-pointer" onClick={() => onNavigate("admin")}>
              全校看板
            </span>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="grid grid-cols-3 gap-2 text-center pb-4 border-b border-slate-100">
              <div className="p-2 rounded-lg bg-slate-50">
                <span className="text-[11px] text-slate-500 block">教案设计</span>
                <span className="text-lg font-bold text-slate-900">18 篇</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50">
                <span className="text-[11px] text-slate-500 block">命题审核</span>
                <span className="text-lg font-bold text-blue-900">142 道</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50">
                <span className="text-[11px] text-slate-500 block">课件PPT</span>
                <span className="text-lg font-bold text-amber-700">9 套</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1.5">
                <span>月度额度消耗进度</span>
                <span className="font-semibold text-slate-800">
                  {currentUser.creditMonthlyQuota - currentUser.creditBalance} / {currentUser.creditMonthlyQuota} (
                  {Math.round(
                    ((currentUser.creditMonthlyQuota - currentUser.creditBalance) /
                      currentUser.creditMonthlyQuota) *
                      100
                  )}
                  %)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      ((currentUser.creditMonthlyQuota - currentUser.creditBalance) /
                        currentUser.creditMonthlyQuota) *
                        100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center justify-between">
                <span>本周教研热度</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <Flame className="w-3 h-3 text-red-500 fill-red-500" /> 领先全校 88% 教师
                </span>
              </div>
              <p className="text-slate-400 mt-1">积分余额充足，下月额度将在 10月1日 自动补齐。</p>
            </div>
          </div>
        </section>
      </div>

      {/* 4. Recommended School Public Skills Carousel/Row */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>西附两江官方推荐教学 Skill</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              由各学科教研名师与备课组长打磨审核的权威教学工具
            </p>
          </div>
          <button
            onClick={() => onNavigate("skills")}
            className="text-xs text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>全部 18 个 Skill</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {publicSkills.slice(0, 3).map((skill) => (
            <div
              key={skill.id}
              className="p-5 rounded-xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-semibold">
                      {skill.subject}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                      {skill.category}
                    </span>
                  </div>
                  <span className="text-xs text-amber-600 font-bold">★ {skill.rating}</span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm">{skill.name}</h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                  {skill.description}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">已使用 {skill.usageCount} 次</span>
                <button
                  onClick={() => onNavigate("assistant", { activeSkillId: skill.id })}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-[#0F2C59] text-blue-900 hover:text-white font-medium text-xs transition-colors cursor-pointer"
                >
                  装载并使用
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
