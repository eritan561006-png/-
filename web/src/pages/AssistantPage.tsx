import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Plus,
  Search,
  Pin,
  Trash2,
  Send,
  Paperclip,
  BookOpen,
  Sparkles,
  Gauge,
  X,
  ChevronDown,
  Copy,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  FileText,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import clsx from "clsx";
import { TeacherShell } from "../components/layout/TeacherShell";
import { Badge } from "../components/ui/Badge";
import { MiniMarkdown } from "../components/ui/MiniMarkdown";
import { useAuth } from "../lib/auth";
import { initialConversations, knowledgeDocs, modelConfigs, skills } from "../lib/mockData";
import { chunkForStreaming, planAIResponse } from "../lib/mockAI";
import type { ChatMessage, Conversation } from "../lib/types";

function groupConversations(list: Conversation[]) {
  const now = Date.now();
  const today: Conversation[] = [];
  const recent: Conversation[] = [];
  const older: Conversation[] = [];
  for (const c of [...list].sort((a, b) => b.updatedAt - a.updatedAt)) {
    const diffH = (now - c.updatedAt) / 3_600_000;
    if (diffH < 24) today.push(c);
    else if (diffH < 24 * 7) recent.push(c);
    else older.push(c);
  }
  return { today, recent, older };
}

type PendingStatus = "thinking" | "skill" | null;

export default function AssistantPage() {
  const { user, spendCredits } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [conversations, setConversations] = useState<Conversation[]>(() =>
    initialConversations.map((c) => ({ ...c, messages: [...c.messages] })),
  );
  const [activeId, setActiveId] = useState<string>(initialConversations[0].id);
  const [search, setSearch] = useState("");
  const [modelId, setModelId] = useState(modelConfigs[0].id);
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const [attachedSkillId, setAttachedSkillId] = useState<string | null>(null);
  const [useKnowledgeBase, setUseKnowledgeBase] = useState(true);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState<PendingStatus>(null);
  const [streamingConvId, setStreamingConvId] = useState<string | null>(null);
  const [rightTab, setRightTab] = useState<"knowledge" | "skill" | "usage">("knowledge");
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [renamingId, setRenamingId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const initializedFromQuery = useRef(false);

  useEffect(() => {
    if (initializedFromQuery.current) return;
    initializedFromQuery.current = true;
    const conv = searchParams.get("conv");
    const skill = searchParams.get("skill");
    if (conv && conversations.some((c) => c.id === conv)) setActiveId(conv);
    if (skill && skills.some((s) => s.id === skill)) setAttachedSkillId(skill);
    setSearchParams({}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [active?.messages.length, pending]);

  const filteredGroups = useMemo(() => {
    const list = conversations.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));
    return groupConversations(list);
  }, [conversations, search]);

  const currentModel = modelConfigs.find((m) => m.id === modelId) ?? modelConfigs[0];
  const attachedSkill = attachedSkillId ? skills.find((s) => s.id === attachedSkillId) : undefined;

  const convSkillIds = useMemo(
    () => Array.from(new Set(active?.messages.map((m) => m.invokedSkillId).filter(Boolean) as string[])),
    [active],
  );
  const convDocIds = useMemo(
    () => Array.from(new Set(active?.messages.flatMap((m) => m.citedDocIds ?? []))),
    [active],
  );
  const convTokens = useMemo(() => active?.messages.reduce((sum, m) => sum + (m.tokens ?? 0), 0) ?? 0, [active]);
  const convCredits = Math.max(1, Math.round((convTokens / 50) * currentModel.creditMultiplier));

  function updateConversation(id: string, updater: (c: Conversation) => Conversation) {
    setConversations((prev) => prev.map((c) => (c.id === id ? updater(c) : c)));
  }

  function createConversation() {
    const id = crypto.randomUUID();
    const newConv: Conversation = { id, title: "新对话", messages: [], updatedAt: Date.now() };
    setConversations((prev) => [newConv, ...prev]);
    setActiveId(id);
  }

  function deleteConversation(id: string) {
    if (streamingConvId === id) return;
    if (!confirm("确定删除该对话吗？此操作不可撤销。")) return;
    setConversations((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (activeId === id && next.length > 0) setActiveId(next[0].id);
      return next;
    });
  }

  function togglePin(id: string) {
    updateConversation(id, (c) => ({ ...c, pinned: !c.pinned }));
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || streamingConvId) return;
    const convId = active.id;
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      createdAt: Date.now(),
    };
    const isFirstMessage = active.messages.length === 0;

    updateConversation(convId, (c) => ({
      ...c,
      title: isFirstMessage ? text.slice(0, 24) : c.title,
      messages: [...c.messages, userMsg],
      updatedAt: Date.now(),
    }));
    setInput("");
    setStreamingConvId(convId);
    setPending("thinking");

    const plan = planAIResponse(text, attachedSkillId ?? undefined);
    const citedDocIds = useKnowledgeBase ? plan.citedDocIds : [];

    await new Promise((r) => setTimeout(r, 550));
    if (plan.skill) {
      setPending("skill");
      await new Promise((r) => setTimeout(r, 800));
    }
    setPending(null);

    const assistantId = crypto.randomUUID();
    updateConversation(convId, (c) => ({
      ...c,
      messages: [
        ...c.messages,
        { id: assistantId, role: "assistant", content: "", createdAt: Date.now(), invokedSkillId: plan.skill?.id, citedDocIds },
      ],
    }));

    const chunks = chunkForStreaming(plan.content);
    for (const chunk of chunks) {
      await new Promise((r) => setTimeout(r, 18));
      updateConversation(convId, (c) => ({
        ...c,
        messages: c.messages.map((m) => (m.id === assistantId ? { ...m, content: m.content + chunk } : m)),
        updatedAt: Date.now(),
      }));
    }

    updateConversation(convId, (c) => ({
      ...c,
      messages: c.messages.map((m) =>
        m.id === assistantId ? { ...m, tokens: Math.round(plan.content.length * 1.6) } : m,
      ),
    }));

    const cost = Math.max(1, Math.round((plan.content.length / 40) * currentModel.creditMultiplier));
    spendCredits(cost);
    setStreamingConvId(null);
    setAttachedSkillId(null);
  }

  function regenerate(messageId: string) {
    if (streamingConvId) return;
    const idx = active.messages.findIndex((m) => m.id === messageId);
    const priorUser = [...active.messages.slice(0, idx)].reverse().find((m) => m.role === "user");
    if (!priorUser) return;
    updateConversation(active.id, (c) => ({ ...c, messages: c.messages.filter((m) => m.id !== messageId) }));
    setInput(priorUser.content);
    setTimeout(() => handleSend(), 0);
  }

  if (!user || !active) return null;

  return (
    <TeacherShell>
      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Left: conversation history */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-700/60 dark:bg-slate-900/50 md:flex">
          <div className="space-y-2 border-b border-slate-100 p-3 dark:border-slate-700/60">
            <button
              onClick={createConversation}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-600 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              <Plus size={15} /> 新建对话
            </button>
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索历史对话"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-2 text-xs outline-none focus:border-brand-400 dark:border-slate-600 dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {(
              [
                {
                  label: "置顶",
                  list: filteredGroups.today
                    .filter((c) => c.pinned)
                    .concat(filteredGroups.recent.filter((c) => c.pinned))
                    .concat(filteredGroups.older.filter((c) => c.pinned)),
                },
                { label: "今天", list: filteredGroups.today.filter((c) => !c.pinned) },
                { label: "最近7天", list: filteredGroups.recent.filter((c) => !c.pinned) },
                { label: "更早", list: filteredGroups.older.filter((c) => !c.pinned) },
              ] satisfies { label: string; list: Conversation[] }[]
            ).map(({ label, list }) =>
              list.length === 0 ? null : (
                <div key={label} className="mb-3">
                  <p className="mb-1 px-2 text-[11px] font-medium text-slate-400">{label}</p>
                  {list.map((c) => (
                    <div
                      key={c.id}
                      className={clsx(
                        "group flex items-center gap-1 rounded-lg px-2 py-1.5",
                        c.id === activeId ? "bg-brand-50 dark:bg-brand-900/30" : "hover:bg-slate-50 dark:hover:bg-slate-800",
                      )}
                    >
                      {renamingId === c.id ? (
                        <input
                          autoFocus
                          defaultValue={c.title}
                          onBlur={(e) => {
                            updateConversation(c.id, (conv) => ({ ...conv, title: e.target.value.trim() || conv.title }));
                            setRenamingId(null);
                          }}
                          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                          className="w-full rounded border border-brand-300 bg-white px-1.5 py-0.5 text-xs outline-none dark:bg-slate-900"
                        />
                      ) : (
                        <button
                          onClick={() => setActiveId(c.id)}
                          onDoubleClick={() => setRenamingId(c.id)}
                          className={clsx(
                            "min-w-0 flex-1 truncate text-left text-xs",
                            c.id === activeId ? "font-medium text-brand-700 dark:text-brand-200" : "text-slate-600 dark:text-slate-300",
                          )}
                          title="双击可重命名"
                        >
                          {streamingConvId === c.id && <Loader2 size={11} className="mr-1 inline animate-spin" />}
                          {c.title || "新对话"}
                        </button>
                      )}
                      <button
                        onClick={() => togglePin(c.id)}
                        className={clsx("opacity-0 group-hover:opacity-100", c.pinned && "opacity-100 text-gold-500")}
                      >
                        <Pin size={12} />
                      </button>
                      <button
                        onClick={() => deleteConversation(c.id)}
                        className="text-slate-400 opacity-0 hover:text-rose-500 group-hover:opacity-100"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              ),
            )}
          </div>

          <div className="border-t border-slate-100 p-3 dark:border-slate-700/60">
            <p className="mb-1.5 text-[11px] font-medium text-slate-400">我的 Skill 快捷入口</p>
            <div className="flex flex-col gap-1">
              {skills.filter((s) => s.ownerName === user.name).map((s) => (
                <button
                  key={s.id}
                  onClick={() => setAttachedSkillId(s.id)}
                  className="flex items-center gap-1.5 truncate rounded-lg px-2 py-1 text-left text-xs text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  <span>{s.icon}</span>
                  <span className="truncate">{s.name}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Center: chat */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5 dark:border-slate-700/60 dark:bg-slate-900/50">
            <input
              value={active.title}
              onChange={(e) => updateConversation(active.id, (c) => ({ ...c, title: e.target.value }))}
              className="min-w-0 flex-1 truncate bg-transparent text-sm font-medium text-slate-700 outline-none dark:text-slate-100"
            />
            <div className="relative ml-3 shrink-0">
              <button
                onClick={() => setModelMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Sparkles size={13} className="text-brand-500" />
                {currentModel.name}
                <ChevronDown size={12} />
              </button>
              {modelMenuOpen && (
                <div className="absolute right-0 top-9 z-20 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  {modelConfigs.map((m) => (
                    <button
                      key={m.id}
                      disabled={m.status === "disabled"}
                      onClick={() => {
                        setModelId(m.id);
                        setModelMenuOpen(false);
                      }}
                      className={clsx(
                        "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs",
                        m.status === "disabled"
                          ? "cursor-not-allowed text-slate-300 dark:text-slate-600"
                          : m.id === modelId
                            ? "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200"
                            : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700",
                      )}
                    >
                      <span>{m.name}</span>
                      <span className="text-[10px]">{m.creditMultiplier}x 积分{m.status === "disabled" && " · 已停用"}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setShowRightPanel((v) => !v)}
              className="ml-2 hidden rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800 lg:block"
            >
              {showRightPanel ? "隐藏面板" : "显示面板"}
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
            {active.messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center text-slate-400">
                <Sparkles size={28} className="mb-2 text-brand-300" />
                <p className="text-sm">开始新的对话，或从左侧「我的 Skill」快捷调用</p>
              </div>
            )}
            {active.messages.map((m) => (
              <div key={m.id} className={clsx("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div className={clsx("max-w-[85%] sm:max-w-[70%]", m.role === "user" ? "items-end" : "items-start")}>
                  {m.role === "assistant" && m.invokedSkillId && (
                    <div className="mb-1 flex items-center gap-1 text-[11px] text-brand-600 dark:text-brand-300">
                      <CheckCircle2 size={12} />
                      已调用【{skills.find((s) => s.id === m.invokedSkillId)?.name}】，结果见右侧面板
                    </div>
                  )}
                  <div
                    className={clsx(
                      "rounded-2xl px-4 py-3",
                      m.role === "user"
                        ? "bg-brand-600 text-white"
                        : "border border-slate-100 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100",
                    )}
                  >
                    {m.role === "assistant" ? (
                      <MiniMarkdown content={m.content} />
                    ) : (
                      <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed">{m.content}</p>
                    )}
                  </div>
                  {m.role === "assistant" && m.content && (
                    <div className="mt-1 flex items-center gap-2.5 text-slate-400">
                      <button onClick={() => navigator.clipboard?.writeText(m.content)} title="复制" className="hover:text-brand-600">
                        <Copy size={13} />
                      </button>
                      <button onClick={() => regenerate(m.id)} title="重新生成" className="hover:text-brand-600">
                        <RotateCcw size={13} />
                      </button>
                      <button title="赞" className="hover:text-emerald-600">
                        <ThumbsUp size={13} />
                      </button>
                      <button title="踩" className="hover:text-rose-500">
                        <ThumbsDown size={13} />
                      </button>
                      <span className="text-[10px]">{m.tokens ?? 0} tokens</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {pending && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 py-3 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <span className="flex gap-1">
                    <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-brand-400" style={{ animationDelay: "0ms" }} />
                    <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-brand-400" style={{ animationDelay: "150ms" }} />
                    <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-brand-400" style={{ animationDelay: "300ms" }} />
                  </span>
                  {pending === "thinking" ? "正在思考…" : `正在调用【${skills.find((s) => s.id === attachedSkillId)?.name ?? planAIResponse(input).skill?.name}】…`}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 bg-white p-3 dark:border-slate-700/60 dark:bg-slate-900/50">
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              {attachedSkill && (
                <span className="flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
                  {attachedSkill.icon} {attachedSkill.name}
                  <button onClick={() => setAttachedSkillId(null)}>
                    <X size={11} />
                  </button>
                </span>
              )}
              <label className="flex items-center gap-1.5 rounded-full border border-slate-200 px-2.5 py-1 text-[11px] text-slate-500 dark:border-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={useKnowledgeBase}
                  onChange={(e) => setUseKnowledgeBase(e.target.checked)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-400"
                />
                <BookOpen size={12} /> 基于学校知识库回答
              </label>
            </div>
            <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 focus-within:border-brand-400 dark:border-slate-600 dark:bg-slate-800">
              <button className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-brand-600 dark:hover:bg-slate-700" title="上传附件（教材/学生作业图片等）">
                <Paperclip size={16} />
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                rows={1}
                placeholder="输入你的问题，试试「帮我出5道函数单调性选择题」…（Enter 发送，Shift+Enter 换行）"
                className="max-h-32 flex-1 resize-none bg-transparent py-1.5 text-sm outline-none placeholder:text-slate-400"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || !!streamingConvId}
                className="rounded-lg bg-brand-600 p-2 text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Right: knowledge / skill / usage panel */}
        {showRightPanel && (
          <aside className="hidden w-80 shrink-0 flex-col border-l border-slate-200 bg-white dark:border-slate-700/60 dark:bg-slate-900/50 lg:flex">
            <div className="flex border-b border-slate-100 dark:border-slate-700/60">
              {(
                [
                  { key: "knowledge", label: "知识库", Icon: BookOpen },
                  { key: "skill", label: "Skill 调用", Icon: Sparkles },
                  { key: "usage", label: "本次用量", Icon: Gauge },
                ] as const
              ).map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => setRightTab(key)}
                  className={clsx(
                    "flex flex-1 items-center justify-center gap-1 py-2.5 text-xs font-medium",
                    rightTab === key
                      ? "border-b-2 border-brand-600 text-brand-700 dark:text-brand-200"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300",
                  )}
                >
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              {rightTab === "knowledge" &&
                (convDocIds.length === 0 ? (
                  <p className="mt-6 text-center text-xs text-slate-400">本次对话暂未引用知识库文档</p>
                ) : (
                  <div className="space-y-2">
                    {convDocIds.map((id) => {
                      const doc = knowledgeDocs.find((d) => d.id === id);
                      if (!doc) return null;
                      return (
                        <div key={id} className="rounded-xl border border-slate-100 p-3 dark:border-slate-700">
                          <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-200">
                            <FileText size={13} className="text-brand-500" />
                            {doc.name}
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {doc.subject} · {doc.type} · 相关片段 {Math.floor(Math.random() * 3) + 1} 处
                          </p>
                          <Badge tone="brand" className="mt-1.5">
                            相关度 {(85 + Math.floor(Math.random() * 10))}%
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                ))}

              {rightTab === "skill" &&
                (convSkillIds.length === 0 ? (
                  <p className="mt-6 text-center text-xs text-slate-400">本次对话暂未调用 Skill</p>
                ) : (
                  <div className="space-y-2">
                    {convSkillIds.map((id) => {
                      const s = skills.find((sk) => sk.id === id);
                      if (!s) return null;
                      const isRunning = streamingConvId === active.id && active.messages[active.messages.length - 1]?.invokedSkillId === id && !active.messages[active.messages.length - 1]?.content;
                      return (
                        <div key={id} className="rounded-xl border border-slate-100 p-3 dark:border-slate-700">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-200">
                              <span>{s.icon}</span> {s.name}
                            </span>
                            <Badge tone={isRunning ? "warning" : "success"}>{isRunning ? "调用中" : "已完成"}</Badge>
                          </div>
                          <p className="text-[11px] text-slate-400">{s.description}</p>
                        </div>
                      );
                    })}
                  </div>
                ))}

              {rightTab === "usage" && (
                <div className="space-y-3">
                  <div className="rounded-xl border border-slate-100 p-3 dark:border-slate-700">
                    <p className="text-[11px] text-slate-400">本次对话消耗 tokens</p>
                    <p className="text-lg font-semibold text-brand-700 dark:text-brand-200">{convTokens.toLocaleString()}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 p-3 dark:border-slate-700">
                    <p className="text-[11px] text-slate-400">预估消耗积分（{currentModel.name}）</p>
                    <p className="text-lg font-semibold text-gold-600 dark:text-gold-300">{convCredits.toLocaleString()}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 p-3 dark:border-slate-700">
                    <p className="text-[11px] text-slate-400">账号剩余积分</p>
                    <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">{user.creditBalance.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </TeacherShell>
  );
}
