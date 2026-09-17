import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Star,
  X,
  ChevronRight,
  ChevronLeft,
  PlayCircle,
  Loader2,
  CheckCircle2,
  Pencil,
} from "lucide-react";
import clsx from "clsx";
import { TeacherShell } from "../components/layout/TeacherShell";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useAuth } from "../lib/auth";
import { skills as initialSkills } from "../lib/mockData";
import type { SkillItem } from "../lib/types";

const subjects = ["全部", "数学", "语文", "英语", "物理", "通用"];
const types: Array<SkillItem["type"] | "全部"> = ["全部", "命题", "审题", "教案", "批改", "其他"];
const icons = ["🧮", "✍️", "🔍", "📘", "🧲", "📜", "📊", "🧪", "🎨", "🌍"];

type PublishChoice = "draft" | "private" | "apply-public";

function emptyForm() {
  return {
    name: "",
    description: "",
    icon: icons[0],
    subject: "数学",
    type: "命题" as SkillItem["type"],
    promptTemplate: "",
  };
}

function statusBadge(s: SkillItem) {
  if (s.status === "draft") return <Badge tone="neutral">草稿</Badge>;
  if (s.status === "pending") return <Badge tone="warning">审核中</Badge>;
  if (s.status === "rejected") return <Badge tone="danger">已驳回</Badge>;
  return s.official ? <Badge tone="brand">学校认证</Badge> : <Badge tone="success">已发布</Badge>;
}

export default function SkillsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [skillList, setSkillList] = useState<SkillItem[]>(initialSkills);
  const [tab, setTab] = useState<"public" | "mine">("public");
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("全部");
  const [type, setType] = useState<(typeof types)[number]>("全部");
  const [sortBy, setSortBy] = useState<"usage" | "new">("usage");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(emptyForm());
  const [testInput, setTestInput] = useState("");
  const [testRunning, setTestRunning] = useState(false);
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [detail, setDetail] = useState<SkillItem | null>(null);

  const visible = skillList.filter((s) =>
    tab === "public" ? s.scope === "public" && s.status === "published" : s.ownerName === user?.name,
  );

  const filtered = useMemo(() => {
    let list = visible.filter(
      (s) =>
        (subject === "全部" || s.subject === subject || s.subject === "通用") &&
        (type === "全部" || s.type === type) &&
        (s.name.includes(search) || s.description.includes(search)),
    );
    list = [...list].sort((a, b) => (sortBy === "usage" ? b.usageCount - a.usageCount : b.id.localeCompare(a.id)));
    return list;
  }, [visible, subject, type, search, sortBy]);

  if (!user) return null;
  const currentUser = user;

  function resetWizard() {
    setStep(1);
    setForm(emptyForm());
    setTestInput("");
    setTestOutput(null);
    setTestRunning(false);
  }

  function runTest() {
    setTestRunning(true);
    setTestOutput(null);
    setTimeout(() => {
      setTestOutput(
        `【${form.name || "未命名 Skill"}】模拟输出：\n已根据提示词模板与输入内容生成结果示例（演示环境，正式上线后将调用真实模型）：\n\n"${testInput || "示例输入"}" → 已按 ${form.subject} · ${form.type} 场景生成对应内容，格式符合预期，可发布使用。`,
      );
      setTestRunning(false);
    }, 1200);
  }

  function publish(choice: PublishChoice) {
    const newSkill: SkillItem = {
      id: crypto.randomUUID(),
      name: form.name || "未命名 Skill",
      description: form.description || "暂无描述",
      icon: form.icon,
      subject: form.subject,
      type: form.type,
      scope: choice === "apply-public" ? "public" : "private",
      status: choice === "draft" ? "draft" : choice === "apply-public" ? "pending" : "published",
      ownerName: currentUser.name,
      usageCount: 0,
      rating: 0,
      official: false,
      promptTemplate: form.promptTemplate,
    };
    setSkillList((prev) => [newSkill, ...prev]);
    setWizardOpen(false);
    resetWizard();
    setTab("mine");
  }

  return (
    <TeacherShell>
      <div className="mx-auto max-w-6xl space-y-4 p-4 sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-lg font-semibold text-slate-800 dark:text-white">Skill 中心</h1>
            <p className="mt-0.5 text-xs text-slate-400">调用学校统一建设的教学 Skill，或沉淀你的专属教学经验</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索 Skill 名称/描述"
                className="w-52 rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm outline-none focus:border-brand-400 dark:border-slate-600 dark:bg-slate-800"
              />
            </div>
            <Button
              onClick={() => {
                resetWizard();
                setWizardOpen(true);
              }}
            >
              <Plus size={15} /> 创建 Skill
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-700">
          {(["public", "mine"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={clsx(
                "px-4 py-2 text-sm font-medium",
                tab === t
                  ? "border-b-2 border-brand-600 text-brand-700 dark:text-brand-200"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300",
              )}
            >
              {t === "public" ? "学校公共 Skill" : "我的 Skill"}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => setSubject(s)}
              className={clsx(
                "rounded-full border px-2.5 py-1",
                subject === s
                  ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200"
                  : "border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400",
              )}
            >
              {s}
            </button>
          ))}
          <span className="mx-1 h-4 w-px bg-slate-200 dark:bg-slate-600" />
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={clsx(
                "rounded-full border px-2.5 py-1",
                type === t
                  ? "border-gold-500 bg-gold-50 text-gold-700 dark:bg-gold-700/20 dark:text-gold-200"
                  : "border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400",
              )}
            >
              {t}
            </button>
          ))}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="ml-auto rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800"
          >
            <option value="usage">按使用最多排序</option>
            <option value="new">按最新发布排序</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-400 dark:border-slate-700">
            {tab === "mine" ? "你还没有创建 Skill，点击右上角「创建 Skill」开始沉淀你的教学经验" : "没有找到符合条件的 Skill"}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <Card key={s.id} className="flex flex-col p-4">
                <div className="mb-2 flex items-start justify-between">
                  <span className="text-2xl">{s.icon}</span>
                  {statusBadge(s)}
                </div>
                <button onClick={() => setDetail(s)} className="text-left">
                  <p className="text-sm font-semibold text-slate-700 hover:text-brand-600 dark:text-slate-100">{s.name}</p>
                </button>
                <p className="mt-1 line-clamp-2 flex-1 text-[11px] leading-relaxed text-slate-400">{s.description}</p>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
                  <Badge tone="neutral">{s.subject}</Badge>
                  <Badge tone="neutral">{s.type}</Badge>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{s.official ? "学校教务处" : `来自 ${s.ownerName}`}</span>
                  {s.rating > 0 && (
                    <span className="flex items-center gap-0.5 text-gold-600 dark:text-gold-300">
                      <Star size={11} className="fill-gold-400 text-gold-400" /> {s.rating} · {s.usageCount.toLocaleString()}次
                    </span>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    disabled={s.status !== "published"}
                    onClick={() => navigate(`/assistant?skill=${s.id}`)}
                  >
                    立即使用
                  </Button>
                  {tab === "mine" ? (
                    <Button size="sm" variant="secondary" onClick={() => setDetail(s)}>
                      <Pencil size={13} />
                    </Button>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={() => setDetail(s)}>
                      详情
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Detail drawer */}
      {detail && (
        <div className="fixed inset-0 z-30 flex justify-end bg-black/30" onClick={() => setDetail(null)}>
          <div
            className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl dark:bg-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">{detail.icon}</span>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">{detail.name}</p>
                  <p className="text-xs text-slate-400">{detail.official ? "学校教务处" : detail.ownerName}</p>
                </div>
              </div>
              <button onClick={() => setDetail(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {statusBadge(detail)}
              <Badge tone="neutral">{detail.subject}</Badge>
              <Badge tone="neutral">{detail.type}</Badge>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{detail.description}</p>
            <div className="mb-4 rounded-xl bg-slate-50 p-3 dark:bg-slate-700/40">
              <p className="mb-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">提示词模板</p>
              <code className="block whitespace-pre-wrap break-words text-[11px] text-slate-600 dark:text-slate-300">
                {detail.promptTemplate}
              </code>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center text-xs">
              <div className="rounded-xl border border-slate-100 py-2.5 dark:border-slate-700">
                <p className="font-semibold text-slate-700 dark:text-slate-200">{detail.usageCount.toLocaleString()}</p>
                <p className="text-slate-400">累计使用次数</p>
              </div>
              <div className="rounded-xl border border-slate-100 py-2.5 dark:border-slate-700">
                <p className="font-semibold text-slate-700 dark:text-slate-200">{detail.rating || "-"}</p>
                <p className="text-slate-400">平均评分</p>
              </div>
            </div>
            <Button
              className="mt-5 w-full"
              disabled={detail.status !== "published"}
              onClick={() => navigate(`/assistant?skill=${detail.id}`)}
            >
              立即使用
            </Button>
          </div>
        </div>
      )}

      {/* Create skill wizard */}
      {wizardOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-800 dark:text-white">创建 Skill</h2>
              <button
                onClick={() => {
                  setWizardOpen(false);
                  resetWizard();
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-6 flex items-center gap-2">
              {["基本信息", "能力定义", "测试运行", "发布"].map((label, i) => (
                <div key={label} className="flex flex-1 items-center gap-2">
                  <div
                    className={clsx(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                      step === i + 1
                        ? "bg-brand-600 text-white"
                        : step > i + 1
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-100 text-slate-400 dark:bg-slate-700",
                    )}
                  >
                    {step > i + 1 ? <CheckCircle2 size={13} /> : i + 1}
                  </div>
                  <span className={clsx("hidden text-[11px] sm:block", step === i + 1 ? "font-medium text-slate-700 dark:text-slate-200" : "text-slate-400")}>
                    {label}
                  </span>
                  {i < 3 && <div className="h-px flex-1 bg-slate-200 dark:bg-slate-600" />}
                </div>
              ))}
            </div>

            {step === 1 && (
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Skill 名称</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="如：文言文情境化默写生成"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 dark:border-slate-600 dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">一句话描述</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={2}
                    placeholder="简要说明这个 Skill 能帮教师做什么"
                    className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 dark:border-slate-600 dark:bg-slate-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500">所属学科</label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
                    >
                      {subjects.filter((s) => s !== "全部").map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500">Skill 类型</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value as SkillItem["type"] })}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
                    >
                      {types.filter((t) => t !== "全部").map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">图标</label>
                  <div className="flex flex-wrap gap-1.5">
                    {icons.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setForm({ ...form, icon })}
                        className={clsx(
                          "flex h-9 w-9 items-center justify-center rounded-lg border text-lg",
                          form.icon === icon ? "border-brand-500 bg-brand-50 dark:bg-brand-900/40" : "border-slate-200 dark:border-slate-600",
                        )}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">指令模板 / 提示词</label>
                  <textarea
                    value={form.promptTemplate}
                    onChange={(e) => setForm({ ...form, promptTemplate: e.target.value })}
                    rows={5}
                    placeholder={"请描述这个 Skill 应如何回应教师的请求，可使用 {变量} 表示占位符，如：\n请为{篇目}生成8道理解性默写题。"}
                    className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs outline-none focus:border-brand-400 dark:border-slate-600 dark:bg-slate-900"
                  />
                </div>
                <div className="rounded-lg bg-brand-50 p-3 text-[11px] leading-relaxed text-brand-700 dark:bg-brand-900/30 dark:text-brand-200">
                  💡 也可以用对话方式创建：先在「AI 助手」中反复调整满意的回复效果，再回到此处一键"固化为 Skill"（演示环境暂以手动填写模板为主）。
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">可引用知识库范围</label>
                  <select className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900">
                    <option>全校公共知识库</option>
                    <option>{form.subject}学科知识库</option>
                    <option>不引用知识库</option>
                  </select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">输入示例问题进行测试</label>
                  <div className="flex gap-2">
                    <input
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                      placeholder="如：《岳阳楼记》"
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 dark:border-slate-600 dark:bg-slate-900"
                    />
                    <Button variant="secondary" onClick={runTest} disabled={testRunning}>
                      {testRunning ? <Loader2 size={14} className="animate-spin" /> : <PlayCircle size={14} />}
                      运行
                    </Button>
                  </div>
                </div>
                <div className="min-h-28 rounded-lg border border-dashed border-slate-200 p-3 text-xs text-slate-500 dark:border-slate-600 dark:text-slate-400">
                  {testRunning ? "正在生成测试结果…" : testOutput ? <p className="whitespace-pre-wrap">{testOutput}</p> : "点击「运行」查看该 Skill 的输出效果预览"}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-3">
                <p className="text-sm text-slate-600 dark:text-slate-300">选择该 Skill 的发布方式：</p>
                {[
                  { key: "draft" as const, title: "保存为草稿", desc: "暂不发布，仅自己可见，可随时继续编辑" },
                  { key: "private" as const, title: "仅个人使用", desc: "发布后出现在「我的 Skill」，仅你可调用" },
                  { key: "apply-public" as const, title: "申请加入学校公共 Skill 库", desc: "提交管理员审核，通过后全校教师可用" },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => publish(opt.key)}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 p-3 text-left hover:border-brand-400 hover:bg-brand-50/40 dark:border-slate-600 dark:hover:bg-slate-700/40"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{opt.title}</p>
                      <p className="text-[11px] text-slate-400">{opt.desc}</p>
                    </div>
                    <ChevronRight size={16} className="text-slate-300" />
                  </button>
                ))}
              </div>
            )}

            {step < 4 && (
              <div className="mt-6 flex justify-between">
                <Button variant="ghost" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>
                  <ChevronLeft size={15} /> 上一步
                </Button>
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={step === 1 && !form.name.trim()}
                >
                  下一步 <ChevronRight size={15} />
                </Button>
              </div>
            )}
            {step === 4 && (
              <div className="mt-6">
                <Button variant="ghost" onClick={() => setStep(3)}>
                  <ChevronLeft size={15} /> 返回测试
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </TeacherShell>
  );
}
