import React, { useState } from "react";
import { TEACHER_GUIDE_SECTIONS } from "../../mockData";
import {
  BookOpen,
  Search,
  Sparkles,
  Copy,
  Check,
  Send,
  HelpCircle,
  FileCode2,
  Presentation,
  CheckCircle2,
  ChevronRight,
  Printer,
  Compass,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface GuideViewProps {
  onSendToAssistant: (prompt: string) => void;
  onGoToStudio?: (tab?: string) => void;
}

export const GuideView: React.FC<GuideViewProps> = ({
  onSendToAssistant,
  onGoToStudio,
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string>("quickstart");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const sections = TEACHER_GUIDE_SECTIONS;
  const currentSection =
    sections.find((s) => s.id === activeSectionId) || sections[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-600/10 text-emerald-700 border border-emerald-600/20">
              <Compass className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              西附两江 · 智能备课与教研使用指南
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            涵盖“3分钟快速上手流程”、“名师高频 Prompt 词典”、“Skill 编排规范”与“答疑 FAQ”。
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>打印 / 导出指南</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left Navigation Menu */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs space-y-1">
            {sections.map((section) => {
              const isActive = activeSectionId === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSectionId(section.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#0F2C59] text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {section.id === "quickstart" && <BookOpen className="w-4 h-4" />}
                    {section.id === "prompts" && (
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    )}
                    {section.id === "skill-specs" && <FileCode2 className="w-4 h-4" />}
                    {section.id === "faq" && <HelpCircle className="w-4 h-4" />}
                    <span>{section.title}</span>
                  </div>
                  <ChevronRight
                    className={`w-3.5 h-3.5 ${
                      isActive ? "text-amber-300" : "text-slate-400"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-2">
            <span className="font-bold text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>西附教师支持热线</span>
            </span>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              遇到提示词微调困难或自创 Skill 发布疑问，可联系两江校区信息教研中心（分机号：8082，或企微咨询）。
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs space-y-2">
            <span className="font-bold text-blue-900 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span>快速通道</span>
            </span>
            <div className="space-y-1">
              <button
                onClick={() => onSendToAssistant("帮我按照新高考标准命制一道函数变式题")}
                className="w-full text-left text-xs text-blue-700 hover:underline py-1 flex items-center justify-between"
              >
                <span>快速命制变式题</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              {onGoToStudio && (
                <button
                  onClick={() => onGoToStudio("ppt")}
                  className="w-full text-left text-xs text-blue-700 hover:underline py-1 flex items-center justify-between"
                >
                  <span>直达多模态 PPT 创作</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Content View */}
        <div className="md:col-span-3 space-y-6">
          {/* Section 1: Quickstart */}
          {activeSectionId === "quickstart" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold uppercase tracking-wider mb-2">
                    {currentSection.badge}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {currentSection.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                    {currentSection.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {currentSection.steps?.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3 relative overflow-hidden flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#0F2C59] text-amber-300 font-bold flex items-center justify-center text-sm shadow-xs">
                          {step.step}
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm">
                          {step.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {step.detail}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-200/80 text-[11px] text-blue-700 font-medium flex items-center gap-1">
                        <span>流程关键步 #{step.step}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best Practices Banner */}
              <div className="bg-gradient-to-r from-[#0F2C59] to-blue-900 rounded-2xl p-6 text-white space-y-4 shadow-md">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-300" />
                  <h3 className="text-base font-bold">
                    西附两江“人机协同备课四不原则”
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-blue-100 leading-relaxed">
                  <div className="p-3.5 rounded-xl bg-white/10 border border-white/10 space-y-1">
                    <span className="font-bold text-amber-300 block">1. 不盲信数据：</span>
                    对于 AI 输出的理科公式推导与复杂算理，教师必须进行关键步二次验算与采分点校准。
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/10 border border-white/10 space-y-1">
                    <span className="font-bold text-amber-300 block">2. 不脱离课标：</span>
                    命题务必锚定普通高中课程标准核心素养要求，严禁命制偏怪难题超纲题。
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/10 border border-white/10 space-y-1">
                    <span className="font-bold text-amber-300 block">3. 不忽略学情：</span>
                    必须紧密结合西附两江当前教学班级生源学情，二次调整试卷的赋分梯度与难度阶梯。
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/10 border border-white/10 space-y-1">
                    <span className="font-bold text-amber-300 block">4. 善沉淀反哺：</span>
                    优秀自创提示词、精品课件与试卷成果，请一键加入校本教研资源库共享全校备课组。
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Prompts Dictionary */}
          {activeSectionId === "prompts" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-2">
                    {currentSection.badge}
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {currentSection.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {currentSection.summary}
                  </p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="在提示词库中搜索..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              {currentSection.categories?.map((cat, catIdx) => {
                const filteredItems = cat.items.filter(
                  (item) =>
                    !searchQuery ||
                    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.tag.toLowerCase().includes(searchQuery.toLowerCase())
                );
                if (filteredItems.length === 0) return null;

                return (
                  <div key={catIdx} className="space-y-3">
                    <h3 className="font-bold text-sm text-slate-800 px-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      <span>{cat.name}</span>
                      <span className="text-xs font-normal text-slate-400">
                        ({filteredItems.length} 条模板)
                      </span>
                    </h3>

                    <div className="grid grid-cols-1 gap-3">
                      {filteredItems.map((item, itemIdx) => {
                        const uniqueKey = `${catIdx}-${itemIdx}`;
                        const isCopied = copiedKey === uniqueKey;
                        return (
                          <div
                            key={itemIdx}
                            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-all space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm">
                                  {item.title}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                                  {item.tag}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleCopy(item.prompt, uniqueKey)}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                                >
                                  {isCopied ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                  <span>{isCopied ? "已复制" : "复制模板"}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => onSendToAssistant(item.prompt)}
                                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#0F2C59] text-white hover:bg-blue-900 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                                >
                                  <Send className="w-3.5 h-3.5 text-amber-300" />
                                  <span>在助手中调用</span>
                                </button>
                              </div>
                            </div>

                            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs leading-relaxed whitespace-pre-wrap selection:bg-blue-700">
                              {item.prompt}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Section 3: Skill Standards */}
          {activeSectionId === "skill-specs" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold uppercase tracking-wider mb-2">
                    {currentSection.badge}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {currentSection.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                    {currentSection.summary}
                  </p>
                </div>

                <div className="space-y-4">
                  {currentSection.rules?.map((rule, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-[#0F2C59] text-amber-300 font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {rule.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pl-8">
                        {rule.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950 space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-700" />
                    <span>审核流转周期与质量保障：</span>
                  </div>
                  <p className="text-[11px] text-blue-900 leading-relaxed">
                    教师提交 Skill 后，由所属备课组长初审（1个工作日内），校教研科研处终审（每周五统一审核发布），通过后全校教师均可在技能广场一键调用，并记入年度校本研修与教育技术创新考核学时。
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 4: FAQ */}
          {activeSectionId === "faq" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-2">
                    {currentSection.badge}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {currentSection.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                    {currentSection.summary}
                  </p>
                </div>

                <div className="space-y-4">
                  {currentSection.faqs?.map((faq, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2 hover:border-blue-300 transition-colors shadow-xs"
                    >
                      <h4 className="font-bold text-slate-900 text-sm flex items-start gap-2">
                        <span className="text-blue-700 font-mono font-bold shrink-0">
                          Q{idx + 1}.
                        </span>
                        <span>{faq.q}</span>
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed pl-6">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
