import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Search, ShieldCheck, Sparkles } from "lucide-react";
import { SchoolMark } from "../components/ui/SchoolMark";
import { CloudMotif } from "../components/ui/CloudMotif";
import { Button } from "../components/ui/Button";
import { useAuth } from "../lib/auth";
import { DEMO_PASSWORD, PLATFORM_NAME, SCHOOL_NAME, teachers } from "../lib/mockData";
import { useDarkMode } from "../lib/useDarkMode";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const { dark, toggle } = useDarkMode();

  const [employeeNo, setEmployeeNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  if (user) return <Navigate to="/dashboard" replace />;

  const canSubmit = employeeNo.trim().length > 0 && password.length > 0 && !submitting;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    const result = await login(employeeNo, password);
    setSubmitting(false);
    if (result.ok) {
      navigate("/dashboard");
    } else {
      setAttempts((a) => a + 1);
      setError(result.message);
    }
  }

  function fillDemo(no: string) {
    setEmployeeNo(no);
    setPassword(DEMO_PASSWORD);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b1526]">
      {/* Top utility bar — white header, echoing the school site's masthead */}
      <header className="border-b border-slate-100 dark:border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-3">
            <SchoolMark size={46} />
            <div className="leading-tight">
              <p
                className="text-[17px] font-bold tracking-wide text-brand-800 dark:text-white sm:text-[19px]"
                style={{ fontFamily: "var(--font-serif-sc)" }}
              >
                {SCHOOL_NAME}
              </p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-slate-400 sm:text-[11px]">
                Liangjiang Campus · Affiliated to Southwest University
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs text-slate-400 dark:border-slate-700 dark:bg-slate-800 md:flex">
              <Search size={13} />
              请输入教师工号
            </div>
            <span className="hidden rounded-full bg-brand-600 px-3 py-1.5 text-xs font-medium text-white sm:inline-flex">
              {PLATFORM_NAME}
            </span>
            <button
              type="button"
              onClick={toggle}
              className="rounded-full border border-slate-200 px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              {dark ? "浅色" : "深色"}
            </button>
          </div>
        </div>
      </header>

      {/* Hero + login */}
      <div className="flex flex-col lg:flex-row">
        {/* Hero banner, styled after the school site's photographic masthead */}
        <div
          className="relative hidden min-h-[560px] flex-1 overflow-hidden lg:flex lg:flex-col lg:justify-center"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 15% 20%, rgba(235,180,204,0.45), transparent 60%), radial-gradient(ellipse 70% 60% at 85% 15%, rgba(122,168,228,0.4), transparent 55%), radial-gradient(ellipse 80% 70% at 75% 85%, rgba(235,180,204,0.3), transparent 60%), linear-gradient(160deg, #eef3fc 0%, #dfe9f9 45%, #cfe0f6 100%)",
          }}
        >
          <CloudMotif className="absolute left-6 top-6 h-16 w-24 text-brand-300/70" />
          <CloudMotif className="absolute right-8 top-10 h-14 w-20 rotate-[18deg] text-brand-300/50" />

          {/* soft blossom bokeh, evoking the school site's spring-flower masthead */}
          <div className="pointer-events-none absolute inset-0">
            {[
              { top: "58%", left: "6%", size: 130, color: "rgba(236,190,209,0.65)" },
              { top: "20%", left: "12%", size: 70, color: "rgba(255,255,255,0.7)" },
              { top: "72%", left: "20%", size: 46, color: "rgba(236,190,209,0.5)" },
              { top: "12%", left: "78%", size: 90, color: "rgba(122,168,228,0.35)" },
              { top: "78%", left: "86%", size: 60, color: "rgba(236,190,209,0.4)" },
            ].map((b, i) => (
              <span
                key={i}
                className="absolute rounded-full blur-2xl"
                style={{ top: b.top, left: b.left, width: b.size, height: b.size, background: b.color }}
              />
            ))}
          </div>

          <div className="relative z-10 px-14 xl:px-20">
            <p className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white/70 px-3 py-1 text-xs font-medium text-brand-700 backdrop-blur">
              <Sparkles size={12} />
              {PLATFORM_NAME}
            </p>

            <p
              className="text-[64px] font-normal leading-[1.05] text-brand-800 xl:text-[76px]"
              style={{ fontFamily: "var(--font-calligraphy)" }}
            >
              宁静致远
              <br />
              有教无类
            </p>

            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-brand-700/80">
              AI 赋能教学，让教研更高效——统一接入学校知识库、公共 Skill 与多模态 AI 能力，
              助力教师高效完成命题、审题、教案、课件与教学资源创作。
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              {[
                ["10+", "AI 教学能力"],
                ["5000+", "校本知识片段"],
                ["7×24h", "随时可用"],
              ].map(([num, label]) => (
                <div key={label} className="rounded-xl border border-brand-200/70 bg-white/60 py-3 text-center backdrop-blur">
                  <p className="text-lg font-semibold text-brand-700">{num}</p>
                  <p className="text-[11px] text-brand-600/80">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-10 flex items-center gap-2 px-14 text-xs text-brand-600/70 xl:px-20">
            <ShieldCheck size={14} />
            校级统一身份认证 · 数据安全合规
          </div>
        </div>

        {/* Login panel */}
        <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-6 py-10 text-slate-800 dark:bg-[#0b1526] dark:text-slate-100 lg:w-[440px] lg:flex-none">
          <div className="mb-6 flex w-full max-w-sm items-center gap-2 lg:hidden">
            <SchoolMark size={32} />
            <div className="leading-tight">
              <p className="text-sm font-semibold text-brand-800 dark:text-brand-100">{SCHOOL_NAME}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{PLATFORM_NAME}</p>
            </div>
          </div>

          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white">教师登录</h2>
              <p className="mt-1 text-xs text-slate-400">使用学校统一分配的账号登录</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">工号</label>
                <input
                  value={employeeNo}
                  onChange={(e) => setEmployeeNo(e.target.value)}
                  placeholder="请输入工号，如 XF2018042"
                  autoComplete="username"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:focus:ring-brand-900"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">密码</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码"
                    autoComplete="current-password"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pr-10 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:focus:ring-brand-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600 dark:bg-rose-900/30 dark:text-rose-300">
                  {error}
                  {attempts > 0 && `（还可尝试 ${Math.max(0, 4 - attempts)} 次）`}
                </div>
              )}

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-400"
                  />
                  记住我
                </label>
                <button type="button" className="text-brand-600 hover:underline dark:text-brand-300">
                  忘记密码？
                </button>
              </div>

              <Button type="submit" disabled={!canSubmit} className="w-full" size="lg">
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> 登录中…
                  </>
                ) : (
                  "登录"
                )}
              </Button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
              <span className="text-[11px] text-slate-400">或使用统一身份认证登录</span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <ShieldCheck size={16} />
              学校统一身份认证（SSO）
            </button>

            <div className="mt-6 rounded-lg border border-dashed border-slate-300 p-3 text-[11px] leading-relaxed text-slate-500 dark:border-slate-600 dark:text-slate-400">
              <p className="mb-1.5 font-medium text-slate-600 dark:text-slate-300">演示账号（密码统一为 {DEMO_PASSWORD}）：</p>
              <div className="flex flex-wrap gap-1.5">
                {teachers
                  .filter((t) => t.status === "active")
                  .map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => fillDemo(t.employeeNo)}
                      className="rounded-full border border-slate-200 bg-white px-2.5 py-1 hover:border-brand-400 hover:text-brand-600 dark:border-slate-600 dark:bg-slate-900 dark:hover:text-brand-300"
                    >
                      {t.name}（{t.role === "admin" ? "管理员" : t.role === "lead" ? "学科组长" : "教师"}）
                    </button>
                  ))}
              </div>
            </div>

            <p className="mt-6 text-center text-[11px] text-slate-400">
              技术支持：西附两江信息中心 · 版本 v0.1.0-demo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
