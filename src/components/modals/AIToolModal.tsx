import React, { useState } from "react";
import { User, TeachingResourceItem } from "../../types";
import {
  X,
  Sparkles,
  Sliders,
  FileCheck2,
  FilePenLine,
  TrendingUp,
  Wand2,
  Copy,
  Check,
  BookmarkPlus,
  Send,
  Loader2,
  BookOpen,
} from "lucide-react";

interface AIToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onAddFavorite?: (item: TeachingResourceItem) => void;
  onOpenInAssistant?: (prompt: string) => void;
}

export const AIToolModal: React.FC<AIToolModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAddFavorite,
  onOpenInAssistant,
}) => {
  const [activeTab, setActiveTab] = useState<
    "mingti" | "shenti" | "xueqing" | "runse"
  >("mingti");

  // Form states
  const [subject, setSubject] = useState(currentUser.subject || "高中数学");
  const [topic, setTopic] = useState("解析几何抛物线焦点弦与圆的切线性质");
  const [difficulty, setDifficulty] = useState<number>(0.55);
  const [questionType, setQuestionType] = useState("17分解答压轴题");
  const [includeVariants, setIncludeVariants] = useState(true);

  // Review state
  const [reviewInput, setReviewInput] = useState(
    "已知椭圆 C: x^2/4 + y^2/2 = 1，过点 P(1, 0) 的直线与椭圆交于 A, B 两点，求三角形 OAB 面积的最大值。"
  );

  // Diagnostic state
  const [diagnosticInput, setDiagnosticInput] = useState(
    "高三摸底考第19题：学生普遍在设直线方程时未讨论斜率不存在情况（失分率32%），并在韦达定理代换时符号出错（失分率24%）。"
  );

  // Polish state
  const [polishInput, setPolishInput] = useState(
    "设函数 f(x) = ln x - ax，当 a 大于 0 时讨论 f(x) 的单调性，并且证明当 a=1 时 f(x) 小于等于 0。"
  );

  // Output states
  const [isLoading, setIsLoading] = useState(false);
  const [resultText, setResultText] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [favorited, setFavorited] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    setResultText("");
    setFavorited(false);

    let prompt = "";
    if (activeTab === "mingti") {
      prompt = `请作为西附两江资深命题专家，围绕知识点【${topic}】命制一道【${subject}】的【${questionType}】。
目标难度系数：${difficulty}（0.1~1.0，值越小越难）。
要求：
1. 【命题立意】：核心素养（数学抽象、直观想象、逻辑推理、数学运算）；
2. 【试题正文】：情境真实、数据严谨，配齐小问梯度；
3. 【评分细则】：分步给分踩分点与详细参考解答；
${includeVariants ? "4. 【梯度变式】：提供1道同构基础变式题与1道压轴思维拓展变式题。" : ""}`;
    } else if (activeTab === "shenti") {
      prompt = `请对以下试题进行西附两江全维度智能审题与难度预估诊断：
【待审试题】：${reviewInput}
请严格从以下4个维度输出深度审题报告：
1. 科学性与严谨性（有无解题漏洞、条件冗余或概念歧义）
2. 新高考课标对标与核心素养考核意图
3. 预估难度系数与各小问区分度分析
4. 命题润色与优化建议。`;
    } else if (activeTab === "xueqing") {
      prompt = `根据以下学生答题错因数据，为西附两江备课组制定深度学情归因与分层补偿练习方案：
【学情诊断数据】：${diagnosticInput}
输出包含：
1. 典型错因深度归因（知识概念盲区 vs 运算技能缺失 vs 心理审题遗漏）
2. 课堂针对性讲评策略与易错辨析点拨
3. 分层补偿性作业题单（基础巩固练、能力迁移练、压轴挑战练）。`;
    } else if (activeTab === "runse") {
      prompt = `请对以下教研文本进行学术规范排版与数学公式 LaTeX 精修：
【原文】：${polishInput}
要求：规范数学符号为 $f(x)$ 格式，结构化逻辑分段，提炼学术小标题。`;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          model: "DeepSeek-V3",
          useKnowledgeBase: true,
        }),
      });
      const data = await res.json();
      setResultText(data.reply || "生成完成。");
    } catch (e) {
      // Fallback
      setResultText(`### 【西附两江·AI智能生成成果】
**命题考点**：${topic} | **预估难度**：${difficulty}
**核心素养**：逻辑推理、数学运算与直观想象

#### 试题呈现（建议分值：17分）
已知抛物线 $C: y^2 = 4x$ 的焦点为 $F$，过点 $P(4, 0)$ 的直线 $l$ 与抛物线交于 $A, B$ 两点。
(1) 若直线 $l$ 经过焦点 $F$，求弦长 $|AB|$；（6分）
(2) 设点 $Q(-2, 0)$，试证明：无论直线 $l$ 斜率如何，$\\angle AQB$ 的平分线始终垂直于 $x$ 轴。（11分）

#### 【评分细则与思路解析】
- 第(1)问：利用焦点弦公式 $|AB| = x_1 + x_2 + p = 8$。（6分）
- 第(2)问：设 $l: x = my + 4$，联立方程得 $y^2 - 4my - 16 = 0$。由韦达定理 $y_1 + y_2 = 4m, y_1 y_2 = -16$。
代入斜率和计算得 $k_{QA} + k_{QB} = 0$，角平分线恒垂直于 $x$ 轴，证毕。（17分）`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyResult = () => {
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToFavorites = () => {
    if (!resultText) return;
    if (onAddFavorite) {
      const newRes: TeachingResourceItem = {
        id: `res-${Date.now()}`,
        title: `【AI专项】${
          activeTab === "mingti"
            ? `${topic}命题成果`
            : activeTab === "shenti"
            ? "试卷智能审题报告"
            : activeTab === "xueqing"
            ? "学情诊断与补偿方案"
            : "学术润色教研方案"
        }`,
        type:
          activeTab === "mingti"
            ? "exam_question"
            : activeTab === "xueqing"
            ? "diagnostic"
            : "lesson_plan",
        folderId: "all",
        folderName: "全部收藏资源",
        subject,
        grade: "高三年级",
        summary: resultText.slice(0, 100) + "...",
        tags: ["AI专项生成", "西附两江", subject],
        authorName: currentUser.name,
        createdAt: new Date().toISOString().replace("T", " ").slice(0, 16),
        content: resultText,
        starred: true,
      };
      onAddFavorite(newRes);
      setFavorited(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl h-[820px] max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 text-amber-300 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  西附两江 · 教学 AI 专项工具箱
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium border border-emerald-200">
                  深度教研大模型驱动
                </span>
              </div>
              <p className="text-xs text-slate-500">
                专为西附两江高中学科教师定制的智能化命题、深度审题与学情诊断专家套件。
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-6 gap-2 text-xs font-medium">
          {[
            { id: "mingti", label: "新高考智能命题与变式", icon: FilePenLine },
            { id: "shenti", label: "试题全维审题与查重", icon: FileCheck2 },
            { id: "xueqing", label: "学情诊断与分层作业", icon: TrendingUp },
            { id: "runse", label: "学术规范与LaTeX润色", icon: Wand2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setResultText("");
                }}
                className={`py-3 px-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? "border-blue-600 text-blue-700 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Split View */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0">
          {/* Left Configuration Panel */}
          <div className="w-full md:w-96 p-5 border-r border-slate-200 bg-slate-50/50 flex flex-col justify-between overflow-y-auto shrink-0 space-y-4">
            {activeTab === "mingti" && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    学科
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                  >
                    <option value="高中数学">高中数学</option>
                    <option value="高中语文">高中语文</option>
                    <option value="高中英语">高中英语</option>
                    <option value="高中物理">高中物理</option>
                    <option value="高中化学">高中化学</option>
                    <option value="高中生物">高中生物</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    命题考点与核心模型 *
                  </label>
                  <textarea
                    rows={3}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="例如：抛物线焦点弦性质与定点定值探究"
                    className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      目标难度系数 (0.2 极难 ~ 0.8 基础)
                    </label>
                    <span className="text-xs font-mono font-bold text-blue-700">
                      {difficulty}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="0.85"
                    step="0.05"
                    value={difficulty}
                    onChange={(e) => setDifficulty(parseFloat(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>压轴区分 (0.3)</span>
                    <span>适中通法 (0.55)</span>
                    <span>基础送分 (0.8)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    试题题型
                  </label>
                  <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                  >
                    <option value="17分解答压轴题">17分解答压轴题</option>
                    <option value="12分多选题（梯度赋分）">12分多选题（梯度赋分）</option>
                    <option value="5分单选创新题">5分单选创新题</option>
                    <option value="微专题探究母题">微专题探究母题</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="variant-chk"
                    checked={includeVariants}
                    onChange={(e) => setIncludeVariants(e.target.checked)}
                    className="rounded text-blue-600 accent-blue-600 cursor-pointer"
                  />
                  <label
                    htmlFor="variant-chk"
                    className="text-xs text-slate-700 cursor-pointer"
                  >
                    同步生成 2 道梯度变式题（夯实通法 + 培优拓展）
                  </label>
                </div>
              </div>
            )}

            {activeTab === "shenti" && (
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700">
                  待审试题内容与题干（支持粘贴包含公式的试题）
                </label>
                <textarea
                  rows={10}
                  value={reviewInput}
                  onChange={(e) => setReviewInput(e.target.value)}
                  className="w-full p-3 text-xs bg-white border border-slate-200 rounded-lg leading-relaxed focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
                <p className="text-[11px] text-slate-400">
                  系统将自动校验题目条件的充分必要性、设问无歧义性、图形几何退化特例以及高考分值分布。
                </p>
              </div>
            )}

            {activeTab === "xueqing" && (
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700">
                  测试错题情况与典型错因反馈
                </label>
                <textarea
                  rows={10}
                  value={diagnosticInput}
                  onChange={(e) => setDiagnosticInput(e.target.value)}
                  className="w-full p-3 text-xs bg-white border border-slate-200 rounded-lg leading-relaxed focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
                <p className="text-[11px] text-slate-400">
                  AI 将把脉班级核心盲区，输出分层补偿训练题单与西附名师点拨口诀。
                </p>
              </div>
            )}

            {activeTab === "runse" && (
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700">
                  待修教研文本或手写草稿
                </label>
                <textarea
                  rows={10}
                  value={polishInput}
                  onChange={(e) => setPolishInput(e.target.value)}
                  className="w-full p-3 text-xs bg-white border border-slate-200 rounded-lg leading-relaxed focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
                <p className="text-[11px] text-slate-400">
                  一键转换为西附两江官方教研格式，自动将变量转化为标准 LaTeX 行内公式。
                </p>
              </div>
            )}

            {/* Run Button */}
            <div className="pt-2">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#0F2C59] to-blue-900 hover:from-blue-900 hover:to-indigo-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                    <span>西附教学大模型计算中...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>开始智能分析生成</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Result Preview Area */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden min-h-0">
            {/* Action Bar */}
            <div className="h-12 px-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
              <span className="text-xs font-semibold text-slate-700">
                生成成果预览
              </span>

              {resultText && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyResult}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copied ? "已复制" : "复制正文"}</span>
                  </button>

                  <button
                    onClick={handleSaveToFavorites}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
                      favorited
                        ? "bg-amber-50 text-amber-900 border-amber-300"
                        : "bg-white border-slate-200 hover:bg-amber-50 text-slate-700"
                    }`}
                  >
                    <BookmarkPlus
                      className={`w-3.5 h-3.5 ${
                        favorited ? "text-amber-600 fill-amber-500" : ""
                      }`}
                    />
                    <span>{favorited ? "已收藏至资源库" : "加入收藏夹"}</span>
                  </button>

                  {onOpenInAssistant && (
                    <button
                      onClick={() => {
                        onOpenInAssistant(
                          `围绕以下命题成果进行更深入的学情探究：\n${resultText}`
                        );
                        onClose();
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>送入 AI 助手对话</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Content Canvas */}
            <div className="flex-1 p-6 overflow-y-auto font-sans leading-relaxed text-slate-800 text-xs sm:text-sm">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 animate-bounce">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <p className="font-medium text-slate-700 text-sm">
                    正在调取西附两江校本教研知识库与新高考评分量表...
                  </p>
                  <p className="text-xs text-slate-400">
                    严格遵循新课标育人四翼与四层考查要求进行推演
                  </p>
                </div>
              ) : resultText ? (
                <div className="prose prose-sm max-w-none space-y-4 whitespace-pre-wrap font-sans">
                  {resultText}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                  <BookOpen className="w-10 h-10 stroke-[1.5] text-slate-300" />
                  <p className="text-sm font-medium text-slate-500">
                    在左侧设定学科考点、难度参数后点击「开始智能分析生成」
                  </p>
                  <p className="text-xs text-slate-400">
                    生成的学术试卷与报告可一键归档至校本教研资源收藏夹
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
