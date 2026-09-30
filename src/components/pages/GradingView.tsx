import React, { useMemo, useRef, useState } from "react";
import {
  User,
  HomeworkAssignment,
  HomeworkSubmission,
  QuestionGrade,
  SubmissionStatus,
} from "../../types";
import {
  HOMEWORK_ASSIGNMENTS,
  HOMEWORK_SUBMISSIONS,
  MOCK_UPLOAD_STUDENTS,
} from "../../mockData";
import {
  ClipboardCheck,
  Upload,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Camera,
  Monitor,
  RotateCcw,
  Minus,
  Plus,
  Loader2,
  Users,
  BarChart3,
  BookOpen,
  PenLine,
  ChevronRight,
} from "lucide-react";

interface GradingViewProps {
  currentUser: User;
}

const LOW_CONFIDENCE = 0.8;

const STATUS_META: Record<SubmissionStatus, { label: string; className: string }> = {
  ai_grading: { label: "AI 批改中", className: "bg-blue-50 text-blue-700 border-blue-200" },
  pending_review: { label: "待复核", className: "bg-amber-50 text-amber-700 border-amber-200" },
  confirmed: { label: "已确认", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

const totalOf = (grades: QuestionGrade[], key: "score" | "aiScore") =>
  grades.reduce((sum, gr) => sum + gr[key], 0);

// Produce a mock AI result for an uploaded submission, reusing an existing
// graded submission of the same assignment as the "recognised" answers.
const mockAiGrade = (
  assignment: HomeworkAssignment,
  template: HomeworkSubmission | undefined,
  seed: number
): Pick<HomeworkSubmission, "grades" | "aiConfidence" | "aiOverallComment" | "overallComment"> => {
  const grades: QuestionGrade[] = assignment.questions.map((q, i) => {
    const base = template?.grades.find((gr) => gr.questionId === q.id);
    const deduct = (seed + i) % 3 === 0 ? Math.ceil(q.maxScore * 0.3) : 0;
    const aiScore = Math.max(0, q.maxScore - deduct);
    const aiComment = deduct
      ? "关键步骤缺失，结论推导不完整，建议教师复核。"
      : "作答正确，步骤规范。";
    return {
      questionId: q.id,
      studentAnswer: base?.studentAnswer ?? "（手写识别内容）",
      aiScore,
      aiComment,
      errorTag: deduct ? "步骤不完整" : undefined,
      score: aiScore,
      comment: aiComment,
    };
  });
  const aiOverallComment = "整体完成度较好，注意解答题推理过程的完整性。";
  return {
    grades,
    aiConfidence: seed % 2 === 0 ? 0.87 : 0.76,
    aiOverallComment,
    overallComment: aiOverallComment,
  };
};

export const GradingView: React.FC<GradingViewProps> = ({ currentUser }) => {
  const [assignmentId, setAssignmentId] = useState(HOMEWORK_ASSIGNMENTS[0].id);
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>(HOMEWORK_SUBMISSIONS);
  const [filter, setFilter] = useState<"all" | SubmissionStatus>("all");
  const [selectedId, setSelectedId] = useState<string | null>("sub-01");
  const [toast, setToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadCount = useRef(0);

  const assignment = HOMEWORK_ASSIGNMENTS.find((a) => a.id === assignmentId)!;
  const maxTotal = assignment.questions.reduce((s, q) => s + q.maxScore, 0);

  const assignmentSubs = useMemo(
    () => submissions.filter((s) => s.assignmentId === assignmentId),
    [submissions, assignmentId]
  );
  const visibleSubs = assignmentSubs.filter((s) => filter === "all" || s.status === filter);
  const selected = assignmentSubs.find((s) => s.id === selectedId) ?? null;

  const pendingCount = assignmentSubs.filter((s) => s.status === "pending_review").length;
  const confirmedCount = assignmentSubs.filter((s) => s.status === "confirmed").length;
  const gradedSubs = assignmentSubs.filter((s) => s.status !== "ai_grading");
  const average = gradedSubs.length
    ? gradedSubs.reduce((sum, s) => sum + totalOf(s.grades, "score"), 0) / gradedSubs.length
    : 0;

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };

  const updateSubmission = (id: string, patch: (s: HomeworkSubmission) => HomeworkSubmission) =>
    setSubmissions((prev) => prev.map((s) => (s.id === id ? patch(s) : s)));

  const updateGrade = (questionId: string, patch: Partial<QuestionGrade>) => {
    if (!selected) return;
    updateSubmission(selected.id, (s) => ({
      ...s,
      grades: s.grades.map((gr) => (gr.questionId === questionId ? { ...gr, ...patch } : gr)),
    }));
  };

  const handleSwitchAssignment = (id: string) => {
    setAssignmentId(id);
    setFilter("all");
    setSelectedId(submissions.find((s) => s.assignmentId === id)?.id ?? null);
  };

  const handleUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const template = assignmentSubs.find((s) => s.status !== "ai_grading");
    const created: HomeworkSubmission[] = Array.from(files).map((file) => {
      const n = uploadCount.current++;
      const student = MOCK_UPLOAD_STUDENTS[n % MOCK_UPLOAD_STUDENTS.length];
      return {
        id: `sub-up-${Date.now()}-${n}`,
        assignmentId,
        studentName: student.studentName,
        studentNo: student.studentNo,
        submittedAt: new Date().toISOString().replace("T", " ").slice(0, 16),
        source: file.type.startsWith("image/") ? "拍照上传" : "在线提交",
        status: "ai_grading",
        aiConfidence: 0,
        grades: [],
        aiOverallComment: "",
        overallComment: "",
      };
    });
    setSubmissions((prev) => [...created, ...prev]);
    setSelectedId(created[0].id);
    setFilter("all");

    created.forEach((sub, i) => {
      window.setTimeout(() => {
        updateSubmission(sub.id, (s) => ({
          ...s,
          ...mockAiGrade(assignment, template, uploadCount.current + i),
          status: "pending_review",
        }));
      }, 1600 + i * 700);
    });
    flash(`已上传 ${created.length} 份作业，AI 正在识别与批改…`);
  };

  const goToNextPending = (afterId: string) => {
    const next = assignmentSubs.find((s) => s.id !== afterId && s.status === "pending_review");
    if (next) setSelectedId(next.id);
  };

  const handleConfirm = () => {
    if (!selected) return;
    updateSubmission(selected.id, (s) => ({ ...s, status: "confirmed" }));
    flash(`已确认 ${selected.studentName} 的批改结果，成绩与评语已发布给学生`);
    goToNextPending(selected.id);
  };

  const handleBatchConfirm = () => {
    const targets = assignmentSubs.filter(
      (s) => s.status === "pending_review" && s.aiConfidence >= 0.85
    );
    if (targets.length === 0) {
      flash("没有置信度 ≥ 85% 的待复核作业");
      return;
    }
    const ids = new Set(targets.map((t) => t.id));
    setSubmissions((prev) =>
      prev.map((s) => (ids.has(s.id) ? { ...s, status: "confirmed" } : s))
    );
    flash(`已批量确认 ${targets.length} 份高置信度作业`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/10 text-blue-700 border border-blue-600/20">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              智能作业批改
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            AI 识别学生作答并给出建议分与评语，{currentUser.name}老师复核修改后一键确认发布。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 text-xs">
            {HOMEWORK_ASSIGNMENTS.map((a) => (
              <button
                key={a.id}
                onClick={() => handleSwitchAssignment(a.id)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  assignmentId === a.id
                    ? "bg-[#0F2C59] text-white font-medium"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {a.subject} · {a.title.split(" · ")[0]}
              </button>
            ))}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => {
              handleUpload(e.target.files);
              e.target.value = "";
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>上传作业</span>
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "已提交",
            value: assignmentSubs.length,
            unit: `/ ${assignment.totalStudents} 人`,
            icon: Users,
            tone: "bg-blue-50 text-blue-600",
          },
          {
            label: "待复核",
            value: pendingCount,
            unit: "份",
            icon: Clock,
            tone: "bg-amber-50 text-amber-600",
          },
          {
            label: "已确认发布",
            value: confirmedCount,
            unit: "份",
            icon: CheckCircle2,
            tone: "bg-emerald-50 text-emerald-600",
          },
          {
            label: "当前均分",
            value: average.toFixed(1),
            unit: `/ ${maxTotal} 分`,
            icon: BarChart3,
            tone: "bg-purple-50 text-purple-600",
          },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-medium">{kpi.label}</span>
                <div className={`p-1.5 rounded-lg ${kpi.tone}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900">{kpi.value}</span>
                <span className="text-xs text-slate-400">{kpi.unit}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Submission list */}
        <div className="lg:col-span-4 xl:col-span-3 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">
                学生提交 <span className="text-slate-400 font-normal">· {assignment.className}</span>
              </h2>
            </div>
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-[11px]">
              {(
                [
                  { id: "all", label: "全部" },
                  { id: "pending_review", label: "待复核" },
                  { id: "confirmed", label: "已确认" },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`flex-1 px-2 py-1 rounded-md transition-colors cursor-pointer ${
                    filter === f.id ? "bg-white text-slate-900 font-semibold shadow-xs" : "text-slate-500"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleBatchConfirm}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-semibold transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              批量确认高置信度（≥85%）
            </button>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[640px] divide-y divide-slate-100">
            {visibleSubs.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-400">暂无符合条件的提交</div>
            )}
            {visibleSubs.map((s) => {
              const isActive = s.id === selectedId;
              const meta = STATUS_META[s.status];
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedId(s.id)}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer ${
                    isActive ? "bg-blue-50/70" : "hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
                      isActive ? "bg-[#0F2C59] text-amber-300" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {s.studentName.slice(-2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-900 truncate">{s.studentName}</span>
                      {s.status === "ai_grading" ? (
                        <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />
                      ) : (
                        <span className="text-sm font-bold text-slate-900">
                          {totalOf(s.grades, "score")}
                          <span className="text-[10px] text-slate-400 font-normal">/{maxTotal}</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${meta.className}`}>
                        {meta.label}
                      </span>
                      {s.status === "pending_review" && s.aiConfidence < LOW_CONFIDENCE && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded border border-red-200 bg-red-50 text-red-600 font-medium">
                          建议细看
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 truncate">{s.studentNo}</span>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-600" : "text-slate-300"}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Grading detail */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          {!selected && (
            <div className="rounded-2xl bg-white border border-dashed border-slate-300 p-12 text-center">
              <ClipboardCheck className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm text-slate-500 mt-3">从左侧选择一份作业开始复核，或点击右上角上传作业。</p>
            </div>
          )}

          {selected && selected.status === "ai_grading" && (
            <div className="rounded-2xl bg-white border border-slate-200 shadow-xs p-12 text-center">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-800 mt-4">
                正在识别 {selected.studentName} 的作答并生成批改建议…
              </p>
              <p className="text-xs text-slate-400 mt-1">手写识别 → 对照参考答案 → 逐题给分与评语</p>
            </div>
          )}

          {selected && selected.status !== "ai_grading" && (
            <>
              {/* Student summary bar */}
              <div className="rounded-2xl bg-white border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#0F2C59] text-amber-300 flex items-center justify-center text-sm font-bold">
                    {selected.studentName.slice(-2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-slate-900">{selected.studentName}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${STATUS_META[selected.status].className}`}>
                        {STATUS_META[selected.status].label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                      <span>学号 {selected.studentNo}</span>
                      <span className="flex items-center gap-1">
                        {selected.source === "拍照上传" ? <Camera className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                        {selected.source}
                      </span>
                      <span>{selected.submittedAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400">AI 置信度</div>
                    <div
                      className={`text-sm font-bold flex items-center justify-end gap-1 ${
                        selected.aiConfidence < LOW_CONFIDENCE ? "text-red-600" : "text-emerald-600"
                      }`}
                    >
                      {selected.aiConfidence < LOW_CONFIDENCE && <AlertTriangle className="w-3.5 h-3.5" />}
                      {Math.round(selected.aiConfidence * 100)}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400">AI 建议总分</div>
                    <div className="text-sm font-bold text-slate-500">{totalOf(selected.grades, "aiScore")}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400">最终得分</div>
                    <div className="text-2xl font-bold text-slate-900">
                      {totalOf(selected.grades, "score")}
                      <span className="text-xs text-slate-400 font-normal"> / {maxTotal}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Per-question grading */}
              {assignment.questions.map((q) => {
                const gr = selected.grades.find((x) => x.questionId === q.id);
                if (!gr) return null;
                const locked = selected.status === "confirmed";
                const edited = gr.score !== gr.aiScore || gr.comment !== gr.aiComment;
                const ratio = gr.score / q.maxScore;
                return (
                  <div key={q.id} className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
                    <div className="px-4 sm:px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-bold text-white bg-[#0F2C59] rounded-md px-2 py-0.5">
                          第 {q.index} 题
                        </span>
                        <span className="text-[11px] text-slate-500">{q.type} · {q.maxScore} 分</span>
                        {gr.errorTag && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-600 border border-red-100 font-medium">
                            {gr.errorTag}
                          </span>
                        )}
                      </div>
                      {edited && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-100 font-medium flex items-center gap-1">
                          <PenLine className="w-3 h-3" /> 教师已修改
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2">
                      {/* Question + answer */}
                      <div className="p-4 sm:p-5 space-y-3 xl:border-r border-slate-100">
                        <p className="text-sm text-slate-800 leading-relaxed">{q.prompt}</p>
                        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                          <div className="text-[11px] font-semibold text-slate-500 mb-1">学生作答</div>
                          <p className="text-sm text-slate-900 leading-relaxed font-medium">{gr.studentAnswer}</p>
                        </div>
                        <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-3">
                          <div className="text-[11px] font-semibold text-blue-700 mb-1 flex items-center gap-1">
                            <BookOpen className="w-3 h-3" /> 参考答案
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed">{q.referenceAnswer}</p>
                        </div>
                      </div>

                      {/* Score + comment */}
                      <div className="p-4 sm:p-5 space-y-3 bg-slate-50/40">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            AI 建议 <span className="font-bold text-slate-800">{gr.aiScore}</span> 分
                          </div>
                          {edited && !locked && (
                            <button
                              onClick={() => updateGrade(q.id, { score: gr.aiScore, comment: gr.aiComment })}
                              className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3" /> 采纳 AI 建议
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center rounded-xl border border-slate-200 bg-white overflow-hidden">
                            <button
                              disabled={locked || gr.score <= 0}
                              onClick={() => updateGrade(q.id, { score: gr.score - 1 })}
                              className="p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <input
                              type="number"
                              min={0}
                              max={q.maxScore}
                              value={gr.score}
                              disabled={locked}
                              onChange={(e) => {
                                const v = Math.max(0, Math.min(q.maxScore, Number(e.target.value) || 0));
                                updateGrade(q.id, { score: v });
                              }}
                              className="w-14 text-center text-lg font-bold text-slate-900 outline-none disabled:bg-white"
                            />
                            <button
                              disabled={locked || gr.score >= q.maxScore}
                              onClick={() => updateGrade(q.id, { score: gr.score + 1 })}
                              className="p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="text-xs text-slate-400">/ {q.maxScore} 分</span>
                          <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                ratio >= 0.85 ? "bg-emerald-500" : ratio >= 0.6 ? "bg-amber-500" : "bg-red-500"
                              }`}
                              style={{ width: `${ratio * 100}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-500">批改评语</label>
                          <textarea
                            value={gr.comment}
                            disabled={locked}
                            onChange={(e) => updateGrade(q.id, { comment: e.target.value })}
                            rows={3}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 leading-relaxed outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none disabled:text-slate-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Overall comment + confirm */}
              <div className="rounded-2xl bg-white border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">总评语</h3>
                  {selected.overallComment !== selected.aiOverallComment && selected.status !== "confirmed" && (
                    <button
                      onClick={() =>
                        updateSubmission(selected.id, (s) => ({ ...s, overallComment: s.aiOverallComment }))
                      }
                      className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" /> 恢复 AI 评语
                    </button>
                  )}
                </div>
                <textarea
                  value={selected.overallComment}
                  disabled={selected.status === "confirmed"}
                  onChange={(e) =>
                    updateSubmission(selected.id, (s) => ({ ...s, overallComment: e.target.value }))
                  }
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 leading-relaxed outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none disabled:text-slate-600"
                />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <p className="text-[11px] text-slate-400">
                    确认后成绩与评语将同步至学生端与班级学情分析。
                  </p>
                  {selected.status === "confirmed" ? (
                    <button
                      onClick={() => updateSubmission(selected.id, (s) => ({ ...s, status: "pending_review" }))}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> 撤回并重新批改
                    </button>
                  ) : (
                    <button
                      onClick={handleConfirm}
                      className="flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-[#0F2C59] hover:bg-[#163d7a] text-white text-xs font-semibold shadow-md shadow-blue-900/15 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-amber-300" /> 确认批改并发布
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-medium shadow-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toast}
        </div>
      )}
    </div>
  );
};
