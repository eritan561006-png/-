import React, { useState, useRef, useEffect } from "react";
import {
  User,
  TeachingSkill,
  ChatSession,
  ChatMessage,
  QuickCommand,
  MultimodalPreviewState,
  TeachingResourceItem,
} from "../../types";
import {
  MessageSquare,
  Plus,
  Send,
  Sparkles,
  Paperclip,
  Database,
  Check,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Presentation,
  FileText,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Search,
  BookOpen,
  Pin,
  Trash2,
  Cpu,
  Layers,
  CheckCircle2,
  Bookmark,
  Command,
  Wand2,
  Eye,
  SlidersHorizontal,
} from "lucide-react";

interface AssistantViewProps {
  currentUser: User;
  allSkills: TeachingSkill[];
  activeSkillId?: string;
  initialPrompt?: string;
  onNavigateToStudio: (params: { studioTab: string; prompt?: string }) => void;
  onDeductCredits: (amount: number) => void;
  quickCommands?: QuickCommand[];
  onOpenQuickCommandConfig?: () => void;
  onOpenAITools?: () => void;
  onOpenPreview?: (preview: MultimodalPreviewState) => void;
  onSaveToFavorites?: (item: TeachingResourceItem) => void;
}

export const AssistantView: React.FC<AssistantViewProps> = ({
  currentUser,
  allSkills,
  activeSkillId,
  initialPrompt,
  onNavigateToStudio,
  onDeductCredits,
  quickCommands = [],
  onOpenQuickCommandConfig,
  onOpenAITools,
  onOpenPreview,
  onSaveToFavorites,
}) => {
  // Model selection
  const [selectedModel, setSelectedModel] = useState("DeepSeek-V3");
  const models = [
    { name: "DeepSeek-V3", rate: "1.0x 积分", desc: "逻辑推演与精准命题强" },
    { name: "通义千问 2.5 Max", rate: "1.2x 积分", desc: "中文综合理解与文科教案" },
    { name: "GPT-4o-Edu", rate: "2.0x 积分", desc: "双语与高难度跨学科试题" },
    { name: "Gemini 2.5 Flash", rate: "1.0x 积分", desc: "实时多模态与超快响应" },
  ];

  // Active Skill
  const [selectedSkill, setSelectedSkill] = useState<TeachingSkill | null>(null);

  // Knowledge Base toggle
  const [useKnowledgeBase, setUseKnowledgeBase] = useState(true);

  // Sessions state
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: "sess-1",
      title: "高三一轮复习《圆锥曲线综合题》命题",
      updatedAt: "今天 09:20",
      model: "DeepSeek-V3",
      pinned: true,
      messages: [
        {
          id: "m-1",
          role: "user",
          content:
            "请围绕抛物线焦点弦性质与定点定值问题，为西附两江高三年级命制一道高考综合解答题，要求体现斜率相反数对称性证明。",
          createdAt: "09:20",
        },
        {
          id: "m-2",
          role: "assistant",
          content: `### 【西附两江·高三数学专项命题】圆锥曲线综合解答题

**【考查核心素养】**
逻辑推理、数学运算与直观想象。考查学生在复杂解析几何代数消元过程中的通性通法。

---

#### 试题呈现（建议分值：17分）
> **已知抛物线 $C: y^2 = 2px (p > 0)$ 的焦点为 $F$，准线方程为 $x = -1$。**
> (1) 求抛物线 $C$ 的标准方程；
> (2) 过点 $P(4, 0)$ 的直线 $l$ 与抛物线 $C$ 相交于 $A, B$ 两点，以 $AB$ 为直径的圆记为圆 $M$。
> ① 若直线 $l$ 经过焦点 $F$，求圆 $M$ 被 $y$ 轴截得的弦长；
> ② 设点 $Q(-2, 0)$，试证明：无论直线 $l$ 斜率如何变化，$\angle AQB$ 的平分线始终垂直于 $x$ 轴。

---

#### 【评分细则与参考答案要点】
* **第(1)问（4分）**：由准线 $x = -p/2 = -1$，解得 $p = 2$。标准方程为 $y^2 = 4x$。
* **第(2)问①（6分）**：焦点弦性质 $x_A + x_B = 6$，求得圆心坐标与半径，代入弦长公式得截得弦长为 $2\\sqrt{5}$。
* **第(2)问②（7分）**：角平分线垂直于 $x$ 轴 $\\Leftrightarrow k_{QA} + k_{QB} = 0$。设直线方程 $x = my + 4$，联立抛物线得 $y^2 - 4my - 16 = 0$。利用韦达定理化简证明 $k_{QA} + k_{QB} = \\frac{y_A}{x_A+2} + \\frac{y_B}{x_B+2} = 0$。

---
💡 **西附教研提示**：本题可作为高三年级零诊或一轮摸底考试压轴题。`,
          createdAt: "09:21",
          invokedSkill: "高考数学压轴命题助手",
          tokensUsed: 460,
          citedSources: [
            { title: "《2023-2026新高考全国Ⅰ卷全科真题》", relevance: "97%" },
            { title: "《高中数学一体化教研导学大纲》", relevance: "91%" },
          ],
        },
      ],
    },
    {
      id: "sess-2",
      title: "高二语文选择性必修《蜀道难》教案",
      updatedAt: "昨天 15:10",
      model: "通义千问 2.5 Max",
      messages: [
        {
          id: "m-3",
          role: "user",
          content: "生成一份《蜀道难》情境化大单元备课教案框架。",
          createdAt: "昨天 15:10",
        },
        {
          id: "m-4",
          role: "assistant",
          content: `### 《蜀道难》大单元微课教案已为您结构化完成。
已包含：语言建构三维目标、三大学习任务群（闻其奇、摹其险、品其叹）与板书设计。`,
          createdAt: "昨天 15:11",
        },
      ],
    },
  ]);

  const [activeSessionId, setActiveSessionId] = useState<string>("sess-1");
  const currentSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // Right column tabs
  const [rightTab, setRightTab] = useState<"kb" | "skill" | "usage">("kb");

  // Input state
  const [inputText, setInputText] = useState(initialPrompt || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [favoritedMsgIds, setFavoritedMsgIds] = useState<Set<string>>(new Set());
  const [slashQuery, setSlashQuery] = useState<string>("");
  const [showSlashDropdown, setShowSlashDropdown] = useState<boolean>(false);

  const handleSelectQuickCommand = (cmd: QuickCommand) => {
    setInputText(cmd.promptTemplate);
    setShowSlashDropdown(false);
  };

  const handlePreviewMessage = (msg: ChatMessage) => {
    if (!onOpenPreview) return;
    const isPPT =
      msg.content.includes("幻灯片") ||
      msg.content.includes("课件") ||
      msg.content.includes("大单元微课");

    if (isPPT) {
      onOpenPreview({
        isOpen: true,
        type: "ppt",
        title: currentSession.title,
        data: {
          slides: [
            {
              title: "核心概念与教学立意",
              subtitle: "西南大学附属中学两江中学 · 备课精要",
              bullets: [
                "立足《普通高中课程标准》核心素养发展要求",
                "关注真实教学情境创设与学生认知起点诊断",
                "强化解题通性通法，避免机械低效刷题",
              ],
            },
            {
              title: "重点问题突破与推演",
              subtitle: "知识模型建构与变式点拨",
              bullets: [
                "模型建构：从几何对称性切入建立参数消元路径",
                "关键步骤：联立抛物线与直线方程，利用韦达定理化简",
                "易错提醒：注意讨论斜率不存在的特例情形",
              ],
            },
            {
              title: "学情分层达标与反馈",
              subtitle: "分层拓展练习与课后巩固",
              bullets: [
                "基础巩固练：掌握标准焦点弦长公式快速计算",
                "能力拓展练：完成垂直角平分线对称性代数证明",
                "反思总结：提炼'设而不求'解析几何通性通法",
              ],
            },
          ],
        },
        subtitle: "交互式课件演播中枢",
      });
    } else {
      onOpenPreview({
        isOpen: true,
        type: "document",
        title: currentSession.title,
        data: msg.content,
        subtitle: `${currentUser.subject || "高中学科"} · 教学研讨成果`,
      });
    }
  };

  const handleFavoriteMessage = (msg: ChatMessage) => {
    if (!onSaveToFavorites) return;
    const isExam =
      msg.content.includes("已知") ||
      msg.content.includes("求证") ||
      msg.content.includes("试题");
    const item: TeachingResourceItem = {
      id: `res-${Date.now()}`,
      title: `【${currentSession.title}】精选成果`,
      type: isExam ? "exam_question" : "lesson_plan",
      folderId: "all",
      folderName: "AI对话沉淀",
      subject: currentUser.subject || "高中综合",
      grade: "高三年级",
      summary: msg.content.slice(0, 80) + "...",
      tags: ["AI备课研讨", "西附两江", "精编成果"],
      authorName: currentUser.name,
      createdAt: new Date().toISOString().replace("T", " ").slice(0, 16),
      content: msg.content,
      starred: true,
    };
    onSaveToFavorites(item);
    setFavoritedMsgIds((prev) => new Set(prev).add(msg.id));
  };

  // Column collapse states
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  // Auto scroll to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentSession.messages, isGenerating]);

  // Set skill if passed from props
  useEffect(() => {
    if (activeSkillId) {
      const match = allSkills.find((s) => s.id === activeSkillId);
      if (match) setSelectedSkill(match);
    }
  }, [activeSkillId, allSkills]);

  // New Chat
  const handleNewChat = () => {
    const newId = `sess-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: "新教学对话",
      updatedAt: "刚刚",
      model: selectedModel,
      messages: [
        {
          id: `m-init-${Date.now()}`,
          role: "assistant",
          content: `您好，${currentUser.name} 老师！我是西附两江高中智能教育助手。
已为您连接校本教研知识库。请问今天需要进行**高考命题**、**试卷审题**、**大单元教案设计**还是**作文批改**？`,
          createdAt: "刚刚",
        },
      ],
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newId);
  };

  // Send Message
  const handleSendMessage = async () => {
    if (!inputText.trim() || isGenerating) return;

    const userText = inputText.trim();
    setInputText("");

    // Add user message
    const userMsg: ChatMessage = {
      id: `m-user-${Date.now()}`,
      role: "user",
      content: userText,
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedMessages = [...currentSession.messages, userMsg];

    // Update session title if first real turn
    let newTitle = currentSession.title;
    if (currentSession.messages.length <= 1) {
      newTitle = userText.slice(0, 18) + (userText.length > 18 ? "..." : "");
    }

    setSessions((prev) =>
      prev.map((s) =>
        s.id === currentSession.id
          ? {
              ...s,
              title: newTitle,
              updatedAt: "刚刚",
              messages: updatedMessages,
            }
          : s
      )
    );

    setIsGenerating(true);

    try {
      // Call backend /api/chat
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: currentSession.messages,
          skill: selectedSkill,
          useKnowledgeBase,
          model: selectedModel,
        }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `m-bot-${Date.now()}`,
        role: "assistant",
        content: data.reply,
        createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        invokedSkill: data.invokedSkill,
        tokensUsed: data.tokensUsed || 380,
        citedSources: data.citedSources,
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSession.id
            ? {
                ...s,
                messages: [...s.messages, botMsg],
              }
            : s
        )
      );

      // Deduct teacher credit
      onDeductCredits(data.creditsDeducted || 10);
    } catch (e) {
      // Offline fallback
      const botMsg: ChatMessage = {
        id: `m-bot-${Date.now()}`,
        role: "assistant",
        content: `已为您完成对「${userText}」的教研分析与方案生成。已根据西附教学标准进行学术结构化整理。`,
        createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        invokedSkill: selectedSkill?.name,
        tokensUsed: 260,
      };
      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSession.id
            ? { ...s, messages: [...s.messages, botMsg] }
            : s
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden bg-slate-100">
      {/* 1. LEFT COLUMN: Chat Sessions History & Pinned Skills (20% width) */}
      <div
        className={`bg-white border-r border-slate-200 flex flex-col transition-all duration-200 shrink-0 ${
          leftOpen ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        {/* Header with New Chat */}
        <div className="p-3 border-b border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={handleNewChat}
            className="flex-1 py-2 px-3 bg-[#0F2C59] hover:bg-[#1E3A8A] text-white font-medium text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新建备课对话</span>
          </button>
          <button
            onClick={() => setLeftOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            title="收起历史列表"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            对话记录
          </div>
          {sessions.map((sess) => {
            const isSelected = sess.id === currentSession.id;
            return (
              <div
                key={sess.id}
                onClick={() => setActiveSessionId(sess.id)}
                className={`group px-3 py-2.5 rounded-xl text-xs cursor-pointer flex items-center justify-between gap-2 transition-colors ${
                  isSelected
                    ? "bg-blue-50 text-blue-900 font-semibold border border-blue-200/80"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-blue-700" : "text-slate-400"}`} />
                  <span className="truncate">{sess.title}</span>
                </div>
                {sess.pinned && (
                  <Pin className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Pinned Mini Skills */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70">
          <div className="text-[11px] font-semibold text-slate-600 mb-2 flex items-center justify-between">
            <span>我的高频 Skill</span>
            <Sparkles className="w-3 h-3 text-amber-500" />
          </div>
          <div className="space-y-1">
            {allSkills.slice(0, 3).map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSkill(s)}
                className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                  selectedSkill?.id === s.id
                    ? "bg-blue-100/70 text-blue-950 font-medium"
                    : "hover:bg-white text-slate-600"
                }`}
              >
                <span className="truncate">{s.name}</span>
                <span className="text-[10px] text-slate-400 font-normal">{s.subject}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toggle Open Left if collapsed */}
      {!leftOpen && (
        <button
          onClick={() => setLeftOpen(true)}
          className="absolute left-2 top-20 z-20 p-2 bg-white rounded-lg shadow-md border border-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer"
          title="展开历史对话"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* 2. MIDDLE COLUMN: Main Conversation Stream (55% width) */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 border-r border-slate-200">
        {/* Top Control Bar */}
        <div className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="font-bold text-slate-800 text-sm truncate">
              {currentSession.title}
            </h3>
          </div>

          {/* Model Selector dropdown & AI Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {onOpenAITools && (
              <button
                onClick={onOpenAITools}
                className="p-1.5 px-2.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="打开 AI 专项命题、审题与学情分析工具箱"
              >
                <Wand2 className="w-3.5 h-3.5 text-blue-700" />
                <span className="hidden md:inline">AI 专项工具箱</span>
              </button>
            )}

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Cpu className="w-3.5 h-3.5 text-blue-700" />
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                {models.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.name} ({m.rate})
                  </option>
                ))}
              </select>
            </div>

            {/* Toggle Right Panel */}
            <button
              onClick={() => setRightOpen(!rightOpen)}
              className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${
                rightOpen
                  ? "bg-blue-50 text-blue-800 border-blue-200"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
              title="知识库与调用面板"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">知识面板</span>
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {currentSession.messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-4xl ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                {/* Avatar */}
                <div className="shrink-0 mt-0.5">
                  {isUser ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-[#0F2C59] text-amber-300 flex items-center justify-center font-bold text-xs shadow-xs">
                      西附
                    </div>
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`space-y-2 max-w-[88%] sm:max-w-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? "bg-blue-900 text-white rounded-2xl rounded-tr-xs px-4 py-3 shadow-md"
                      : "bg-white text-slate-800 rounded-2xl rounded-tl-xs px-5 py-4 border border-slate-200/90 shadow-xs"
                  }`}
                >
                  {/* Attached Skill Badge */}
                  {!isUser && msg.invokedSkill && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-semibold mb-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>已启用专项：{msg.invokedSkill}</span>
                    </div>
                  )}

                  {/* Content (Render Markdown-style pre/code/blocks) */}
                  <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm">
                    {msg.content}
                  </div>

                  {/* Assistant Actions Bar */}
                  {!isUser && (
                    <div className="pt-3 mt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => copyToClipboard(msg.content, msg.id)}
                          className="p-1 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1"
                          title="复制全文"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-[11px] text-emerald-600">已复制</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span className="text-[11px]">复制</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() =>
                            onNavigateToStudio({
                              studioTab: "ppt",
                              prompt: msg.content.slice(0, 80),
                            })
                          }
                          className="p-1 rounded-md hover:bg-blue-50 text-blue-700 transition-colors flex items-center gap-1"
                          title="将本题/教案转入 PPT 创作中心"
                        >
                          <Presentation className="w-3.5 h-3.5" />
                          <span className="text-[11px] font-medium">转为 PPT 课件</span>
                        </button>

                        {onOpenPreview && (
                          <button
                            onClick={() => handlePreviewMessage(msg)}
                            className="p-1 rounded-md hover:bg-purple-50 text-purple-700 transition-colors flex items-center gap-1"
                            title="全屏多模态演播预览（课件、试卷、教案）"
                          >
                            <Eye className="w-3.5 h-3.5 text-purple-600" />
                            <span className="text-[11px] font-medium">全景演播</span>
                          </button>
                        )}

                        {onSaveToFavorites && (
                          <button
                            onClick={() => handleFavoriteMessage(msg)}
                            className={`p-1 rounded-md transition-colors flex items-center gap-1 ${
                              favoritedMsgIds.has(msg.id)
                                ? "text-amber-600 bg-amber-50"
                                : "hover:bg-amber-50 text-slate-500 hover:text-amber-600"
                            }`}
                            title="收藏至学校教研资源库"
                          >
                            <Bookmark
                              className={`w-3.5 h-3.5 ${
                                favoritedMsgIds.has(msg.id)
                                  ? "fill-amber-500 text-amber-600"
                                  : ""
                              }`}
                            />
                            <span className="text-[11px]">
                              {favoritedMsgIds.has(msg.id) ? "已收藏" : "收藏"}
                            </span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px]">
                        {msg.tokensUsed && <span>{msg.tokensUsed} tokens</span>}
                        <button className="p-1 hover:text-slate-600">
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 hover:text-slate-600">
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Thinking / Streaming Indicator */}
          {isGenerating && (
            <div className="flex gap-3 max-w-4xl mr-auto">
              <div className="w-8 h-8 rounded-xl bg-[#0F2C59] text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                西附
              </div>
              <div className="p-4 rounded-2xl rounded-tl-xs bg-white border border-slate-200 text-xs text-slate-600 space-y-2 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="font-semibold text-blue-900">
                    正在检索校本知识库并调用【
                    {selectedSkill ? selectedSkill.name : "西附高考教研模型"}】...
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  正在根据《2026年普通高中课程标准》匹配考点模型与答题规范...
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input Area */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          {/* Active Skill & KB Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {selectedSkill ? (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 text-xs font-semibold">
                <Sparkles className="w-3 h-3 text-blue-600" />
                <span>当前Skill: {selectedSkill.name}</span>
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="ml-1 hover:text-red-500 font-bold"
                >
                  &times;
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSelectedSkill(allSkills[0])}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors cursor-pointer"
              >
                <span>@ 装载教学Skill</span>
              </button>
            )}

            {/* Knowledge Base Toggle */}
            <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={useKnowledgeBase}
                onChange={(e) => setUseKnowledgeBase(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <Database className="w-3 h-3 text-emerald-700" />
              <span>基于西附两江校本知识库</span>
            </label>
          </div>

          {/* Quick Command Shortcuts Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-1 text-xs scrollbar-none">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 shrink-0">
              <Command className="w-3.5 h-3.5 text-blue-700" />
              <span>快捷指令:</span>
            </div>
            {quickCommands.slice(0, 6).map((cmd) => (
              <button
                key={cmd.id}
                type="button"
                onClick={() => handleSelectQuickCommand(cmd)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-900 border border-slate-200/80 hover:border-blue-300 font-mono text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 shrink-0"
                title={cmd.description}
              >
                <span className="text-blue-700 font-bold">{cmd.command}</span>
                <span className="font-sans text-slate-600">{cmd.label}</span>
              </button>
            ))}
            {onOpenQuickCommandConfig && (
              <button
                type="button"
                onClick={onOpenQuickCommandConfig}
                className="px-2 py-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 text-[11px] flex items-center gap-1 transition-colors shrink-0"
                title="配置自定义快捷指令与提示词"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>配置指令</span>
              </button>
            )}
          </div>

          {/* Textarea + Action buttons */}
          <div className="relative rounded-xl border border-slate-300 bg-slate-50 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20 transition-all">
            {/* Slash Command Autocomplete Popover */}
            {showSlashDropdown && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 z-40 max-h-56 overflow-y-auto">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                  <span>匹配到的教学快捷指令（点击或载入模板）</span>
                  <span className="text-slate-400">输入内容即可替换占位符</span>
                </div>
                {quickCommands
                  .filter(
                    (c) =>
                      c.command.toLowerCase().includes(slashQuery) ||
                      c.label.toLowerCase().includes(slashQuery) ||
                      c.description.toLowerCase().includes(slashQuery)
                  )
                  .map((cmd) => (
                    <div
                      key={cmd.id}
                      onClick={() => handleSelectQuickCommand(cmd)}
                      className="p-2 rounded-lg hover:bg-blue-50 flex items-center justify-between cursor-pointer group transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-700 text-xs px-1.5 py-0.5 rounded bg-blue-100/60">
                          {cmd.command}
                        </span>
                        <span className="text-xs font-semibold text-slate-800">
                          {cmd.label}
                        </span>
                        <span className="text-[11px] text-slate-400 truncate max-w-xs">
                          {cmd.description}
                        </span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {cmd.category}
                      </span>
                    </div>
                  ))}
              </div>
            )}

            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => {
                const val = e.target.value;
                setInputText(val);
                if (val.startsWith("/")) {
                  setSlashQuery(val.slice(1).toLowerCase());
                  setShowSlashDropdown(true);
                } else {
                  setShowSlashDropdown(false);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  setShowSlashDropdown(false);
                  handleSendMessage();
                }
                if (e.key === "Escape") {
                  setShowSlashDropdown(false);
                }
              }}
              placeholder="请输入您的教学需求，支持输入 / 呼出快捷指令（如 /命题、/审题、/变式、/教案）..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-transparent border-none focus:outline-hidden resize-none"
            />

            <div className="px-3 pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <button
                  type="button"
                  className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-500 transition-colors"
                  title="上传试卷图片或教学PDF"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <span className="text-[11px] hidden sm:inline text-slate-400">
                  按 Enter 发送，Shift+Enter 换行
                </span>
              </div>

              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isGenerating}
                className="px-4 py-2 bg-[#0F2C59] hover:bg-[#1E3A8A] text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>发送</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. RIGHT COLUMN: Cited Knowledge Base Chunks / Skill Execution / Usage (25% width) */}
      <div
        className={`bg-white border-l border-slate-200 flex flex-col transition-all duration-200 shrink-0 ${
          rightOpen ? "w-80" : "w-0 overflow-hidden"
        }`}
      >
        {/* Top Tabs */}
        <div className="p-2 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setRightTab("kb")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                rightTab === "kb"
                  ? "bg-blue-50 text-blue-900"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              知识库引用
            </button>
            <button
              onClick={() => setRightTab("skill")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                rightTab === "skill"
                  ? "bg-blue-50 text-blue-900"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              Skill状态
            </button>
            <button
              onClick={() => setRightTab("usage")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                rightTab === "usage"
                  ? "bg-blue-50 text-blue-900"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              本次用量
            </button>
          </div>

          <button
            onClick={() => setRightOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            title="关闭面板"
          >
            &times;
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 text-xs space-y-4">
          {rightTab === "kb" && (
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 text-blue-950">
                <span className="font-semibold block mb-0.5">西附两江校本检索中枢</span>
                <p className="text-[11px] text-slate-600">
                  自动向大模型注入西附高三教研标准、导学案分层要求及官方评分细则。
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-slate-700 block">本次对话命中切片：</span>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-800 text-[11px] truncate">
                      《新高考全国Ⅰ卷解析几何命题立意报告》
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                      97% 契合
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    “新高考数学深化通性通法考查，弱化特殊技巧，着重关注设线消元与对称性构造转化能力...”
                  </p>
                  <span className="text-[10px] text-slate-400 block">来源：第 42 页 · 命题指导切片</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-800 text-[11px] truncate">
                      《西附两江高中新课程一体化导学案》
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-bold">
                      91% 契合
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    “高三一轮复习圆锥曲线微专题应强化学生一题多解与反思变式，规范答题书写步骤...”
                  </p>
                  <span className="text-[10px] text-slate-400 block">来源：高三年级数学备课组</span>
                </div>
              </div>
            </div>
          )}

          {rightTab === "skill" && (
            <div className="space-y-3">
              <span className="font-semibold text-slate-700 block">当前激活 Skill 概览：</span>
              {selectedSkill ? (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{selectedSkill.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-medium">
                      {selectedSkill.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">{selectedSkill.description}</p>
                  <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 space-y-1">
                    <p>作者：{selectedSkill.authorName}</p>
                    <p>输出格式：{selectedSkill.outputFormat}</p>
                    <p>知识库绑定：{selectedSkill.kbScope || "通用"}</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  当前会话未加载特定 Skill，正在使用通用智能教师对话引擎。
                </div>
              )}
            </div>
          )}

          {rightTab === "usage" && (
            <div className="space-y-3">
              <span className="font-semibold text-slate-700 block">会话资源消耗统计：</span>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">模型渠道</span>
                  <span className="font-semibold text-slate-800">{selectedModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">已消耗 Token</span>
                  <span className="font-semibold text-slate-800">1,240 tokens</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">已扣除积分</span>
                  <span className="font-semibold text-amber-600">20 积分</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">响应延迟</span>
                  <span className="font-semibold text-emerald-600">680ms</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
