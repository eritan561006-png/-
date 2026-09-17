import React, { useState } from "react";
import { User, TeachingSkill } from "../../types";
import {
  Sparkles,
  Plus,
  Search,
  Award,
  BookOpen,
  PenTool,
  FileCheck,
  Calculator,
  Languages,
  Atom,
  ArrowRight,
  SlidersHorizontal,
  Check,
  Play,
  Share2,
  Trash2,
  AlertCircle,
} from "lucide-react";

interface SkillsViewProps {
  currentUser: User;
  allSkills: TeachingSkill[];
  onAddSkill: (newSkill: TeachingSkill) => void;
  onUseSkill: (skill: TeachingSkill) => void;
  onDeleteSkill: (skillId: string) => void;
}

export const SkillsView: React.FC<SkillsViewProps> = ({
  currentUser,
  allSkills,
  onAddSkill,
  onUseSkill,
  onDeleteSkill,
}) => {
  // Tabs: "public" (School public) or "my" (My skills)
  const [activeTab, setActiveTab] = useState<"public" | "my">("public");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("全部");
  const [selectedCategory, setSelectedCategory] = useState("全部");

  // Create Skill Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // New Skill Form
  const [newSkillForm, setNewSkillForm] = useState({
    name: "",
    description: "",
    subject: "语文",
    category: "命题" as const,
    scope: "public" as const,
    promptTemplate: "",
    outputFormat: "题目 + 意图 + 答案 + 评分细则",
    kbScope: "西附两江高中一体化导学大纲",
  });

  // Test Run in step 3
  const [testInput, setTestInput] = useState("高二语文《过秦论》论证艺术与对比手法分析题命制");
  const [testOutput, setTestOutput] = useState("");
  const [isTesting, setIsTesting] = useState(false);

  const subjects = ["全部", "语文", "数学", "英语", "物理", "化学", "生物", "综合"];
  const categories = ["全部", "命题", "审题", "教案", "批改", "综合"];

  // Filter skills
  const filteredSkills = allSkills.filter((s) => {
    const matchesTab =
      activeTab === "public"
        ? s.scope === "public" || s.isOfficial
        : s.authorId === currentUser.id;

    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject =
      selectedSubject === "全部" || s.subject === selectedSubject;

    const matchesCategory =
      selectedCategory === "全部" || s.category === selectedCategory;

    return matchesTab && matchesSearch && matchesSubject && matchesCategory;
  });

  const runSkillTest = () => {
    setIsTesting(true);
    setTimeout(() => {
      setTestOutput(
        `【试题命制示范】《过秦论》对比论证思维考查题\n\n【题干】阅读贾谊《过秦论》中“秦人开关延敌...伏尸百万”与“及至始皇...焚百家之言”两段，分析作者如何运用多重视角反衬秦之强盛，并阐发其对“牧民之道”的警示意义。（12分）\n\n【考查意图】考查思辨性阅读与表达，引导学生剖析贾谊政论文之修辞张力与历史教训。`
      );
      setIsTesting(false);
    }, 700);
  };

  const handleCreateSubmit = () => {
    const newSkill: TeachingSkill = {
      id: `skill-${Date.now()}`,
      name: newSkillForm.name || "自定义教学Skill",
      description: newSkillForm.description || "教师专属教学分析助手",
      icon: "Sparkles",
      subject: newSkillForm.subject,
      category: newSkillForm.category,
      scope: newSkillForm.scope,
      status: newSkillForm.scope === "public" ? "pending" : "published",
      authorName: currentUser.name,
      authorId: currentUser.id,
      isOfficial: false,
      rating: 5.0,
      usageCount: 1,
      promptTemplate: newSkillForm.promptTemplate,
      outputFormat: newSkillForm.outputFormat,
      kbScope: newSkillForm.kbScope,
      createdAt: new Date().toISOString().split("T")[0],
    };

    onAddSkill(newSkill);
    setIsModalOpen(false);
    setStep(1);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>学校统一建设 · 教师经验沉淀</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Skill 教学技能中心
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            发现并使用学校权威教学 Skill，沉淀并复用您独有的备课经验与命题智能体
          </p>
        </div>

        {/* Create Skill Button */}
        <button
          onClick={() => {
            setStep(1);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-[#0F2C59] hover:bg-[#1E3A8A] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-950/15 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>创建新教学 Skill</span>
        </button>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          {/* Main Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("public")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "public"
                  ? "bg-[#0F2C59] text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              学校公共 Skill
            </button>
            <button
              onClick={() => setActiveTab("my")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "my"
                  ? "bg-[#0F2C59] text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              我的专属 Skill
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="按 Skill 名称或功能搜索..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>
        </div>

        {/* Filter Tags: Subject & Category */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-slate-500">学科：</span>
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  selectedSubject === sub
                    ? "bg-blue-100 text-blue-900 font-bold"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-slate-500">类型：</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-amber-100 text-amber-900 font-bold"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-900/5 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header tags */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {skill.isOfficial && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                      <Award className="w-3 h-3 text-amber-600" />
                      <span>西附官方认证</span>
                    </span>
                  )}
                  <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-semibold">
                    {skill.subject}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                    {skill.category}
                  </span>
                </div>

                <span className="text-xs font-bold text-amber-600">★ {skill.rating}</span>
              </div>

              {/* Title & Desc */}
              <h3 className="font-bold text-base text-slate-900">{skill.name}</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-3">
                {skill.description}
              </p>
            </div>

            {/* Bottom info & actions */}
            <div className="pt-4 mt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span>作者：{skill.authorName}</span>
                <span>使用 {skill.usageCount} 次</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUseSkill(skill)}
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-50 hover:bg-[#0F2C59] text-blue-900 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>立即装载使用</span>
                </button>

                {activeTab === "my" && (
                  <button
                    onClick={() => onDeleteSkill(skill.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="删除该 Skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSkills.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
          <p className="text-slate-500 text-sm">未找到符合当前筛选条件的 Skill</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedSubject("全部");
              setSelectedCategory("全部");
            }}
            className="mt-3 text-xs text-blue-700 font-semibold hover:underline"
          >
            重置所有筛选条件
          </button>
        </div>
      )}

      {/* Multi-Step Guided Skill Creation Drawer / Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-slate-200 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">创建新教学 Skill</h3>
                <p className="text-xs text-slate-500">将您的优秀备课命题经验固化为可复用的智能体</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            {/* Stepper indicator */}
            <div className="flex items-center justify-between py-4 border-b border-slate-100 text-xs">
              <span className={`font-semibold ${step >= 1 ? "text-blue-700" : "text-slate-400"}`}>
                1. 基本信息
              </span>
              <span className="text-slate-300">→</span>
              <span className={`font-semibold ${step >= 2 ? "text-blue-700" : "text-slate-400"}`}>
                2. 能力定义
              </span>
              <span className="text-slate-300">→</span>
              <span className={`font-semibold ${step >= 3 ? "text-blue-700" : "text-slate-400"}`}>
                3. 测试运行
              </span>
              <span className="text-slate-300">→</span>
              <span className={`font-semibold ${step >= 4 ? "text-blue-700" : "text-slate-400"}`}>
                4. 发布与沉淀
              </span>
            </div>

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="py-4 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Skill 名称 *</label>
                  <input
                    type="text"
                    value={newSkillForm.name}
                    onChange={(e) => setNewSkillForm({ ...newSkillForm, name: e.target.value })}
                    placeholder="如：高考古诗词鉴赏主观题命制助手"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">功能描述 *</label>
                  <textarea
                    rows={2}
                    value={newSkillForm.description}
                    onChange={(e) =>
                      setNewSkillForm({ ...newSkillForm, description: e.target.value })
                    }
                    placeholder="一两句话阐明该 Skill 的教学应用场景与目标..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">所属学科</label>
                    <select
                      value={newSkillForm.subject}
                      onChange={(e) => setNewSkillForm({ ...newSkillForm, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                    >
                      {subjects.filter((s) => s !== "全部").map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">应用类型</label>
                    <select
                      value={newSkillForm.category}
                      onChange={(e) =>
                        setNewSkillForm({
                          ...newSkillForm,
                          category: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                    >
                      {categories.filter((c) => c !== "全部").map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">可见共享范围</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "private", title: "仅自己可见" },
                      { id: "dept", title: "备课学科组共享" },
                      { id: "public", title: "申请加入学校公共库" },
                    ].map((opt) => (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setNewSkillForm({ ...newSkillForm, scope: opt.id as any })}
                        className={`p-2.5 rounded-xl border text-center transition-colors cursor-pointer ${
                          newSkillForm.scope === opt.id
                            ? "bg-blue-50 border-blue-500 text-blue-900 font-bold"
                            : "border-slate-200 text-slate-600"
                        }`}
                      >
                        {opt.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Capability Definition */}
            {step === 2 && (
              <div className="py-4 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    系统提示词模板（支持变量：{"{考点}"}、{"{年级}"}、{"{难度}"}）
                  </label>
                  <textarea
                    rows={4}
                    value={newSkillForm.promptTemplate}
                    onChange={(e) =>
                      setNewSkillForm({ ...newSkillForm, promptTemplate: e.target.value })
                    }
                    placeholder="你是一名西附两江高中骨干教师，请根据输入的考点要求，严格按照新高考命题规范产出..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px] focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    预期输出格式标准
                  </label>
                  <input
                    type="text"
                    value={newSkillForm.outputFormat}
                    onChange={(e) =>
                      setNewSkillForm({ ...newSkillForm, outputFormat: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    关联校本知识库范围
                  </label>
                  <select
                    value={newSkillForm.kbScope}
                    onChange={(e) => setNewSkillForm({ ...newSkillForm, kbScope: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="西附两江高中一体化导学大纲">
                      西附两江高中一体化导学大纲（推荐）
                    </option>
                    <option value="历年新高考真题题库">历年新高考真题题库</option>
                    <option value="部编版教材与教师用书">部编版教材与教师用书</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Test Sandbox */}
            {step === 3 && (
              <div className="py-4 space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    输入测试样例指令：
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={runSkillTest}
                      disabled={isTesting}
                      className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-xl flex items-center gap-1.5"
                    >
                      <Play className="w-3 h-3" />
                      <span>{isTesting ? "运行中..." : "测试"}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Skill 输出效果实时预览：
                  </label>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl min-h-[140px] whitespace-pre-wrap text-slate-700 font-sans">
                    {testOutput || "点击上方“测试”按钮查看模拟生成产物..."}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Publish Summary */}
            {step === 4 && (
              <div className="py-4 space-y-3 text-xs text-slate-600">
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-blue-950 text-sm">准备完成！</h4>
                    <p className="text-slate-600 mt-1">
                      Skill 名称：<strong className="text-slate-900">{newSkillForm.name || "未命名Skill"}</strong>
                    </p>
                    <p className="mt-0.5">
                      范围：
                      <span className="text-blue-800 font-medium">
                        {newSkillForm.scope === "public"
                          ? "申请加入学校公共库（将提交校管理员审核）"
                          : "仅在您的专属 Skill 中可用"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => (step > 1 ? setStep((step - 1) as any) : setIsModalOpen(false))}
                className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-xs font-medium"
              >
                {step === 1 ? "取消" : "上一步"}
              </button>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep((step + 1) as any)}
                  className="px-5 py-2 bg-[#0F2C59] hover:bg-[#1E3A8A] text-white font-semibold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <span>下一步</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCreateSubmit}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>确认发布 / 保存</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
