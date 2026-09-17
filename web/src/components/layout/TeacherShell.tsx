import { useState } from "react";
import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  MessagesSquare,
  Sparkles,
  Wand2,
  ShieldCheck,
  ChevronDown,
  LogOut,
  Menu,
  Zap,
  Moon,
  Sun,
} from "lucide-react";
import { SchoolMark } from "../ui/SchoolMark";
import { useAuth } from "../../lib/auth";
import { PLATFORM_NAME, SCHOOL_NAME } from "../../lib/mockData";
import { useDarkMode } from "../../lib/useDarkMode";
import clsx from "clsx";

const navItems = [
  { to: "/dashboard", label: "AI 工作台", icon: LayoutGrid },
  { to: "/assistant", label: "AI 助手", icon: MessagesSquare },
  { to: "/skills", label: "Skill 中心", icon: Sparkles },
  { to: "/studio", label: "AI 创作中心", icon: Wand2 },
];

export function TeacherShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { dark, toggle } = useDarkMode();

  if (!user) return null;

  return (
    <div className="flex h-screen flex-col bg-slate-50 dark:bg-[#0b1526]">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-700/60 dark:bg-slate-900/80">
        <div className="flex items-center gap-3">
          <button
            className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 md:hidden"
            onClick={() => setMobileNavOpen((v) => !v)}
            aria-label="切换导航"
          >
            <Menu size={20} />
          </button>
          <SchoolMark size={30} />
          <div className="hidden leading-tight sm:block">
            <p className="text-[13px] font-semibold text-brand-800 dark:text-brand-100">{SCHOOL_NAME}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{PLATFORM_NAME} · 教师工作台</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggle}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            aria-label="切换深色模式"
            title="切换深色/浅色模式"
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <div className="hidden items-center gap-1.5 rounded-full bg-gold-50 px-3 py-1 text-xs font-medium text-gold-700 dark:bg-gold-700/20 dark:text-gold-200 sm:flex">
            <Zap size={13} />
            剩余 {user.creditBalance.toLocaleString()} 积分
          </div>
          {user.role === "admin" && (
            <button
              onClick={() => navigate("/admin")}
              className="hidden items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 sm:flex"
            >
              <ShieldCheck size={14} /> 管理员后台
            </button>
          )}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-full py-1 pl-1 pr-2 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <span
                className={clsx(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-white",
                  user.avatarColor,
                )}
              >
                {user.name.slice(-2)}
              </span>
              <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-200 sm:inline">
                {user.name}老师
              </span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 top-11 z-20 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-800"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <div className="px-2.5 py-2 text-xs text-slate-500 dark:text-slate-400">
                  {user.subject} · {user.department}
                </div>
                <button
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/dashboard");
                  }}
                >
                  个人中心
                </button>
                <button
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  <LogOut size={14} /> 退出登录
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside
          className={clsx(
            "z-10 w-56 shrink-0 border-r border-slate-200 bg-white p-3 dark:border-slate-700/60 dark:bg-slate-900/60",
            "md:block",
            mobileNavOpen ? "absolute inset-y-14 left-0 block shadow-xl" : "hidden",
          )}
        >
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileNavOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-brand-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/60",
                  )
                }
              >
                <item.icon size={17} />
                {item.label}
              </NavLink>
            ))}
            {user.role === "admin" && (
              <NavLink
                to="/admin"
                className="mt-2 flex items-center gap-2.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700/60 md:hidden lg:flex"
              >
                <ShieldCheck size={17} />
                管理员后台
              </NavLink>
            )}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
