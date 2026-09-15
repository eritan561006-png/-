import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import clsx from "clsx";
import {
  Download,
  RefreshCw,
  Save,
  Share2,
  Wand2,
  Loader2,
  ImageOff,
  ChevronLeft,
  ChevronRight,
  Box,
} from "lucide-react";
import { TeacherShell } from "../components/layout/TeacherShell";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useAuth } from "../lib/auth";
import { studioTypes } from "../lib/studio";
import type { StudioType } from "../lib/studio";
import { PPT_OUTLINE_TEMPLATES, gradientFor } from "../lib/studioMock";
import type { StudioTaskResult } from "../lib/studioMock";

function estimateCost(type: StudioType, extra = 0) {
  const meta = studioTypes.find((t) => t.id === type)!;
  return meta.creditBase + extra;
}

export default function StudioPage() {
  const { user, spendCredits } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeType, setActiveType] = useState<StudioType>("image");
  const [prompt, setPrompt] = useState("");
  const [tasksByType, setTasksByType] = useState<Record<string, StudioTaskResult[]>>({});
  const [activeResultId, setActiveResultId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);

  // image-specific options
  const [imageStyle, setImageStyle] = useState("写实");
  const [imageCount, setImageCount] = useState(4);
  // ppt-specific
  const [pptSubject, setPptSubject] = useState("数学");
  const [pptPages, setPptPages] = useState(8);
  // video
  const [videoDuration, setVideoDuration] = useState(90);
  const [videoVoice, setVideoVoice] = useState("温暖女声");
  // music
  const [musicMood, setMusicMood] = useState("轻松愉快");
  const [musicDuration, setMusicDuration] = useState(60);
  // avatar
  const [avatarFigure, setAvatarFigure] = useState("教师形象 A");
  const [avatarVoice, setAvatarVoice] = useState("标准男声");
  // 3d
  const [threeDFormat, setThreeDFormat] = useState("展示用（GLB）");

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const t = searchParams.get("type") as StudioType | null;
    if (t && studioTypes.some((s) => s.id === t)) setActiveType(t);
    setSearchParams({}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  if (!user) return null;
  const currentUser = user;

  const meta = studioTypes.find((t) => t.id === activeType)!;
  const tasks = tasksByType[activeType] ?? [];
  const activeResult = tasks.find((t) => t.id === activeResultId) ?? null;
  const running = tasks.some((t) => t.status === "running");

  const extraCost =
    activeType === "image" ? (imageCount - 1) * 2 : activeType === "ppt" ? Math.max(0, pptPages - 8) : 0;
  const cost = estimateCost(activeType, extraCost);

  function pushTask(title: string, meta: Record<string, string>) {
    const id = crypto.randomUUID();
    const task: StudioTaskResult = {
      id,
      type: activeType,
      title,
      createdAt: Date.now(),
      creditCost: cost,
      status: "running",
      progress: 0,
      seed: Math.floor(Math.random() * 6),
      meta,
    };
    setTasksByType((prev) => ({ ...prev, [activeType]: [task, ...(prev[activeType] ?? [])] }));
    setActiveResultId(id);
    setSlideIndex(0);
    return id;
  }

  function runGeneration() {
    if (!prompt.trim() && activeType !== "music") {
      setError("请先描述你想要的内容");
      return;
    }
    if (currentUser.creditBalance < cost) {
      setError(`积分不足（需要 ${cost}，剩余 ${currentUser.creditBalance}），请联系管理员充值`);
      return;
    }
    setError(null);
    spendCredits(cost);

    const extraMeta: Record<string, string> = { prompt };
    let title = prompt.slice(0, 18) || "未命名创作";
    if (activeType === "image") {
      extraMeta.style = imageStyle;
      extraMeta.count = String(imageCount);
    } else if (activeType === "ppt") {
      extraMeta.subject = pptSubject;
      extraMeta.pages = String(pptPages);
      title = title || "教学课件";
    } else if (activeType === "video") {
      extraMeta.duration = String(videoDuration);
      extraMeta.voice = videoVoice;
    } else if (activeType === "music") {
      title = `${musicMood}配乐`;
      extraMeta.mood = musicMood;
      extraMeta.duration = String(musicDuration);
    } else if (activeType === "avatar") {
      extraMeta.figure = avatarFigure;
      extraMeta.voice = avatarVoice;
    } else if (activeType === "3d") {
      extraMeta.format = threeDFormat;
    }

    const id = pushTask(title, extraMeta);

    const isAsync = meta.async;
    const totalMs = isAsync ? 3200 + Math.random() * 1400 : 900 + Math.random() * 400;
    const step = 120;
    let elapsed = 0;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      elapsed += step;
      const progress = Math.min(100, Math.round((elapsed / totalMs) * 100));
      setTasksByType((prev) => ({
        ...prev,
        [activeType]: (prev[activeType] ?? []).map((t) =>
          t.id === id ? { ...t, progress, status: progress >= 100 ? "succeeded" : "running" } : t,
        ),
      }));
      if (progress >= 100 && timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }, step);
  }

  function regenerate() {
    if (activeResult) {
      setPrompt(activeResult.meta.prompt ?? prompt);
    }
    runGeneration();
  }

  return (
    <TeacherShell>
      <div className="mx-auto max-w-6xl space-y-4 p-4 sm:p-6">
        <div>
          <h1 className="text-lg font-semibold text-slate-800 dark:text-white">AI 创作中心</h1>
          <p className="mt-0.5 text-xs text-slate-400">图片 · PPT · 视频 · 音乐 · 数字人 · 3D 模型，一站式生成教学资源</p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {studioTypes.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setActiveType(t.id);
                setActiveResultId(null);
                setError(null);
              }}
              className={clsx(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                activeType === t.id
                  ? "border-brand-500 bg-brand-600 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300",
              )}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_1.6fr]">
          {/* Config panel */}
          <Card className="space-y-4 p-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">
                描述你想要的内容{activeType === "music" && "（可选）"}
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                placeholder={
                  activeType === "image"
                    ? "如：细胞有丝分裂过程示意图，板书手绘风"
                    : activeType === "ppt"
                      ? "如：高二数学《函数单调性》，含例题与课堂练习"
                      : activeType === "video"
                        ? "如：讲解光合作用原理的3分钟微课脚本要点"
                        : activeType === "avatar"
                          ? "播报文案：同学们好，本周知识点复习通知…"
                          : activeType === "3d"
                            ? "如：DNA双螺旋结构模型，用于生物课展示"
                            : "如：适合课间休息的轻音乐"
                }
                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 dark:border-slate-600 dark:bg-slate-900"
              />
            </div>

            {activeType === "image" && (
              <>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">风格</label>
                  <div className="flex flex-wrap gap-1.5">
                    {["写实", "插画", "板书手绘风", "简约扁平"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setImageStyle(s)}
                        className={clsx(
                          "rounded-full border px-2.5 py-1 text-xs",
                          imageStyle === s ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200" : "border-slate-200 text-slate-500 dark:border-slate-600",
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">生成数量：{imageCount} 张</label>
                  <input type="range" min={1} max={8} value={imageCount} onChange={(e) => setImageCount(Number(e.target.value))} className="w-full accent-brand-600" />
                </div>
              </>
            )}

            {activeType === "ppt" && (
              <>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">学科</label>
                  <select value={pptSubject} onChange={(e) => setPptSubject(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900">
                    {["数学", "语文", "英语", "物理", "化学", "生物"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">页数：{pptPages} 页</label>
                  <input type="range" min={6} max={20} value={pptPages} onChange={(e) => setPptPages(Number(e.target.value))} className="w-full accent-brand-600" />
                </div>
                <label className="flex items-center gap-1.5 text-xs text-slate-500">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-brand-600" /> 引用我的教案/知识库内容
                </label>
              </>
            )}

            {activeType === "video" && (
              <>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">时长：{videoDuration} 秒</label>
                  <input type="range" min={30} max={300} step={15} value={videoDuration} onChange={(e) => setVideoDuration(Number(e.target.value))} className="w-full accent-brand-600" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">配音音色</label>
                  <select value={videoVoice} onChange={(e) => setVideoVoice(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900">
                    {["温暖女声", "沉稳男声", "活力少年声"].map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-1.5 text-xs text-slate-500">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-brand-600" /> 自动生成字幕
                </label>
              </>
            )}

            {activeType === "music" && (
              <>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">风格情绪</label>
                  <div className="flex flex-wrap gap-1.5">
                    {["轻松愉快", "沉稳专注", "课间铃声", "朗诵配乐"].map((m) => (
                      <button
                        key={m}
                        onClick={() => setMusicMood(m)}
                        className={clsx(
                          "rounded-full border px-2.5 py-1 text-xs",
                          musicMood === m ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200" : "border-slate-200 text-slate-500 dark:border-slate-600",
                        )}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">时长：{musicDuration} 秒</label>
                  <input type="range" min={15} max={180} step={15} value={musicDuration} onChange={(e) => setMusicDuration(Number(e.target.value))} className="w-full accent-brand-600" />
                </div>
              </>
            )}

            {activeType === "avatar" && (
              <>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">数字人形象</label>
                  <select value={avatarFigure} onChange={(e) => setAvatarFigure(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900">
                    {["教师形象 A", "教师形象 B", "自定义形象（需上传照片）"].map((f) => (
                      <option key={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">音色</label>
                  <select value={avatarVoice} onChange={(e) => setAvatarVoice(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900">
                    {["标准男声", "标准女声"].map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {activeType === "3d" && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">输出格式</label>
                <select value={threeDFormat} onChange={(e) => setThreeDFormat(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900">
                  {["展示用（GLB）", "打印用（STL）"].map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
              </div>
            )}

            {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600 dark:bg-rose-900/30 dark:text-rose-300">{error}</p>}

            <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-700">
              <span className="text-[11px] text-slate-400">预估消耗 {cost} 积分</span>
              <Button onClick={runGeneration} disabled={running}>
                {running ? <Loader2 size={15} className="animate-spin" /> : <Wand2 size={15} />}
                {running ? "生成中…" : "生成"}
              </Button>
            </div>
          </Card>

          {/* Preview panel */}
          <Card className="flex min-h-[420px] flex-col p-4">
            {!activeResult ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center text-slate-300 dark:text-slate-600">
                <span className="mb-2 text-4xl">{meta.icon}</span>
                <p className="text-sm text-slate-400">{meta.description}</p>
                <p className="mt-1 text-xs text-slate-300 dark:text-slate-600">填写左侧参数并点击「生成」开始创作</p>
              </div>
            ) : activeResult.status === "running" ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3">
                <Loader2 size={28} className="animate-spin text-brand-500" />
                <p className="text-sm text-slate-500">
                  {meta.async ? "生成中，完成后将通知你，可先去做其他事情…" : "正在生成…"}
                </p>
                <div className="h-1.5 w-48 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                  <div className="h-full bg-brand-500 transition-all" style={{ width: `${activeResult.progress}%` }} />
                </div>
                <span className="text-xs text-slate-400">{activeResult.progress}%</span>
              </div>
            ) : (
              <ResultView type={activeType} task={activeResult} slideIndex={slideIndex} setSlideIndex={setSlideIndex} pptPages={pptPages} />
            )}

            {activeResult?.status === "succeeded" && (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3 dark:border-slate-700">
                <Button size="sm" variant="secondary">
                  <Download size={14} /> 下载
                </Button>
                <Button size="sm" variant="secondary">
                  <Save size={14} /> 保存到资源库
                </Button>
                <Button size="sm" variant="ghost" onClick={regenerate}>
                  <RefreshCw size={14} /> 重新生成
                </Button>
                <Button size="sm" variant="ghost">
                  <Share2 size={14} /> 分享给同事
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* History strip */}
        {tasks.length > 0 && (
          <div>
            <h2 className="mb-2 text-xs font-semibold text-slate-500">历史生成记录</h2>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {tasks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveResultId(t.id)}
                  className={clsx(
                    "flex shrink-0 flex-col items-start gap-1 rounded-xl border p-2 text-left",
                    t.id === activeResultId ? "border-brand-500 bg-brand-50 dark:bg-brand-900/30" : "border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-800",
                  )}
                >
                  <div className={clsx("h-12 w-16 rounded-lg bg-gradient-to-br", gradientFor(t.seed))} />
                  <span className="max-w-[80px] truncate text-[10px] text-slate-500 dark:text-slate-400">{t.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </TeacherShell>
  );
}

function ResultView({
  type,
  task,
  slideIndex,
  setSlideIndex,
  pptPages,
}: {
  type: StudioType;
  task: StudioTaskResult;
  slideIndex: number;
  setSlideIndex: (i: number) => void;
  pptPages: number;
}) {
  if (type === "image") {
    const count = Number(task.meta.count ?? 4);
    return (
      <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={clsx(
              "flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br text-white/80",
              gradientFor(task.seed + i),
            )}
          >
            <ImageOff size={22} />
          </div>
        ))}
      </div>
    );
  }

  if (type === "ppt") {
    const outline = Array.from({ length: pptPages }, (_, i) => PPT_OUTLINE_TEMPLATES[i % PPT_OUTLINE_TEMPLATES.length]);
    const idx = Math.min(slideIndex, outline.length - 1);
    return (
      <div className="flex flex-1 flex-col">
        <div className={clsx("flex flex-1 flex-col justify-center rounded-xl bg-gradient-to-br p-6 text-white", gradientFor(task.seed))}>
          <p className="text-xs opacity-80">第 {idx + 1} / {outline.length} 页</p>
          <p className="mt-2 text-lg font-semibold">{outline[idx]}</p>
          <p className="mt-3 text-xs opacity-80">{task.meta.subject} · {task.meta.prompt || task.title}</p>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <Button size="sm" variant="ghost" disabled={idx === 0} onClick={() => setSlideIndex(idx - 1)}>
            <ChevronLeft size={14} /> 上一页
          </Button>
          <div className="flex gap-1 overflow-x-auto">
            {outline.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideIndex(i)}
                className={clsx("h-1.5 w-5 rounded-full", i === idx ? "bg-brand-600" : "bg-slate-200 dark:bg-slate-600")}
              />
            ))}
          </div>
          <Button size="sm" variant="ghost" disabled={idx === outline.length - 1} onClick={() => setSlideIndex(idx + 1)}>
            下一页 <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    );
  }

  if (type === "video" || type === "avatar") {
    return (
      <div className={clsx("relative flex flex-1 items-center justify-center rounded-xl bg-gradient-to-br", gradientFor(task.seed))}>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur">▶</div>
        <span className="absolute bottom-3 right-3 rounded bg-black/40 px-2 py-0.5 text-[10px] text-white">
          {task.meta.duration ? `${task.meta.duration}s` : "00:45"}
        </span>
        <span className="absolute left-3 top-3 rounded bg-black/40 px-2 py-0.5 text-[10px] text-white">
          {type === "avatar" ? task.meta.figure : "微课视频"}
        </span>
      </div>
    );
  }

  if (type === "music") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <div className="flex h-20 items-end gap-1">
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              className="w-1.5 rounded-full bg-brand-400/70 dark:bg-brand-400/50"
              style={{ height: `${20 + Math.round(Math.sin(i * 0.7 + task.seed) * 25 + 25)}%` }}
            />
          ))}
        </div>
        <p className="text-xs text-slate-400">{task.meta.mood} · {task.meta.duration}秒（演示环境暂不提供真实音频播放）</p>
      </div>
    );
  }

  // 3d
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3">
      <div style={{ perspective: 500 }}>
        <div
          className="relative h-24 w-24 animate-[spin_6s_linear_infinite]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {[0, 90, 180, 270].map((deg) => (
            <div
              key={deg}
              className={clsx("absolute inset-0 flex items-center justify-center rounded-lg bg-gradient-to-br text-white/90", gradientFor(task.seed))}
              style={{ transform: `rotateY(${deg}deg) translateZ(48px)`, opacity: 0.92 }}
            >
              <Box size={22} />
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-slate-400">{task.meta.format} · {task.title}</p>
    </div>
  );
}
