import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { SchoolMark } from "../components/ui/SchoolMark";
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
    <div className="flex min-h-screen bg-brand-950 text-white">
      {/* Left visual panel */}
      <div className="relative hidden w-[58%] flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 p-12 lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(205,162,58,0.35), transparent 40%), radial-gradient(circle at 80% 70%, rgba(130,164,218,0.25), transparent 45%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <SchoolMark size={44} />
          <div>
            <p className="text-lg font-semibold tracking-wide">{SCHOOL_NAME}</p>
            <p className="text-sm text-brand-200">重庆两江新区 · 西南大学附属中学体系</p>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-gold-200 backdrop-blur">
            <Sparkles size={13} />
            {PLATFORM_NAME}
          </p>
          <h1 className="mb-4 text-4xl font-semibold leading-tight">
            AI 赋能教学，
            <br />
            让教研更高效
          </h1>
          <p className="text-sm leading-relaxed text-brand-200">
            统一接入学校知识库、公共 Skill 与多模态 AI 能力，助力教师高效完成命题、审题、
            教案、课件与教学资源创作，让每一位教师都拥有专属的 AI 工作空间。
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            {[
              ["10+", "AI 教学能力"],
              ["5000+", "校本知识片段"],
              ["7×24h", "随时可用"],
            ].map(([num, label]) => (
              <div key={label} className="rounded-xl border border-white/10 bg-white/5 py-3 backdrop-blur">
                <p className="text-lg font-semibold text-gold-200">{num}</p>
                <p className="text-[11px] text-brand-200">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-xs text-brand-300">
          <ShieldCheck size={14} />
          校级统一身份认证 · 数据安全合规
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-6 py-10 text-slate-800 dark:bg-[#0b1526] dark:text-slate-100">
        <div className="mb-6 flex w-full max-w-sm items-center justify-between lg:hidden">
          <div className="flex items-center gap-2">
            <SchoolMark size={32} />
            <div className="leading-tight">
              <p className="text-sm font-semibold text-brand-800 dark:text-brand-100">{SCHOOL_NAME}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{PLATFORM_NAME}</p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white">教师登录</h2>
              <p className="mt-1 text-xs text-slate-400">使用学校统一分配的账号登录</p>
            </div>
            <button
              type="button"
              onClick={toggle}
              className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              {dark ? "浅色" : "深色"}
            </button>
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
  );
}
