import React, { useState } from "react";
import { User } from "../../types";
import {
  Sparkles,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
  availableUsers: User[];
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  availableUsers,
}) => {
  const [employeeNo, setEmployeeNo] = useState("XF20230104");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeNo.trim()) {
      setErrorMessage("请输入教师工号/手机号");
      return;
    }
    if (!password) {
      setErrorMessage("请输入登录密码");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    setTimeout(() => {
      const match = availableUsers.find(
        (u) => u.employeeNo.toLowerCase() === employeeNo.trim().toLowerCase()
      );
      if (match) {
        setLoading(false);
        onLoginSuccess(match);
      } else {
        // Default to first user if arbitrary credentials
        setLoading(false);
        onLoginSuccess(availableUsers[0]);
      }
    }, 600);
  };

  const handleQuickLogin = (user: User) => {
    setEmployeeNo(user.employeeNo);
    setPassword("123456");
    onLoginSuccess(user);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-900 text-slate-100">
      {/* Left 60%: School Visual Branding */}
      <div className="relative lg:w-3/5 p-8 lg:p-16 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#071739] via-[#0F2C59] to-[#0A192F] border-r border-blue-900/50">
        {/* Subtle decorative geometric background grids */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 bottom-0 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0F2C59] to-[#1E3A8A] flex items-center justify-center border-2 border-amber-400/40 shadow-xl shadow-blue-950">
            <span className="font-bold text-amber-300 text-sm tracking-tighter">西附</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              西南大学附属中学两江中学
            </h1>
            <p className="text-xs sm:text-sm text-blue-200 font-medium">
              智能教育助手 · 校园全场景 AI 教学工作中枢
            </p>
          </div>
        </div>

        {/* Center Hero Proposition */}
        <div className="relative z-10 my-12 lg:my-0 max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>西附两江“生涯教育”特色 AI 赋能中枢</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            AI 赋能教学，
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-blue-200 bg-clip-text text-transparent">
              让教研与备课更从容高效
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            为每一位西附高中教师构筑独立数字化 AI 工作空间，深度统一接入两江校本教研知识库、
            高考命题审题专项 Skill、多模态智能课件创制与全学科教学设计能力。
          </p>

          {/* Value Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-white">精准命题与智能审题</h4>
                <p className="text-[11px] text-slate-300 mt-0.5">契合新高考考纲，一键产出变式大题与评分细则</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-white">六大多模态教学创作</h4>
                <p className="text-[11px] text-slate-300 mt-0.5">学术课件 PPT、板书插画、微课视频、数字人与3D</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
          <p>© 2026 西南大学附属中学两江中学 信息科技与智慧教育中心</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>渝公网安备 50011202000001号</span>
            <span>校务统一身份认证 SSO 接入</span>
          </div>
        </div>
      </div>

      {/* Right 40%: Login Card Area */}
      <div className="lg:w-2/5 p-6 sm:p-12 flex flex-col justify-center bg-white text-slate-900 shadow-2xl">
        <div className="max-w-md w-full mx-auto space-y-6">
          {/* Card Header */}
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md mb-3 border border-blue-100">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>教师数字身份统一鉴权</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">教师登录</h3>
            <p className="text-xs text-slate-500 mt-1">
              使用学校统一分配的工号或绑定的手机号登录进入您的 AI 工作台
            </p>
          </div>

          {/* Inline Error */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                工号 / 手机号 / 校内邮箱
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={employeeNo}
                  onChange={(e) => setEmployeeNo(e.target.value)}
                  placeholder="请输入教师工号，如 XF20230104"
                  className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0F2C59]/20 focus:border-[#0F2C59] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">登录密码</label>
                <a href="#forgot" className="text-xs text-blue-700 hover:underline">
                  忘记密码?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入登录密码"
                  className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0F2C59]/20 focus:border-[#0F2C59] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-[#0F2C59] focus:ring-[#0F2C59]"
                />
                <span>保持登录状态（30天）</span>
              </label>
              <span className="text-[11px] text-slate-400">首次登录默认密码为身份证后6位</span>
            </div>

            {/* Primary Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0F2C59] to-[#1E3A8A] hover:from-[#0A1F3F] hover:to-[#172D6E] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-950/20 transition-all cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>立即进入 AI 工作台</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts for effortless evaluation */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                演示账号一键登入（体验各角色）
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {availableUsers.slice(0, 3).map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u)}
                  className="p-2 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all group"
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-semibold text-xs text-slate-800 group-hover:text-blue-900">
                      {u.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">
                    {u.role === "admin" ? "校管理员" : u.role === "lead" ? "高三组长" : "语文骨干"}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Unified Identity / School SSO */}
          <div className="space-y-3 pt-1">
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] text-slate-400 absolute">
                或使用校园统一身份认证
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => handleQuickLogin(availableUsers[0])}
                className="py-2 px-3 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors"
              >
                <GraduationCap className="w-3.5 h-3.5 text-blue-700" />
                <span>西附智慧校园 OA</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin(availableUsers[1])}
                className="py-2 px-3 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span>学校企业微信扫码</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
