import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BarChart3, Users, BookMarked, Sparkles, Cpu, Coins, ArrowLeft, LogOut } from "lucide-react";
import clsx from "clsx";
import { SchoolMark } from "../../components/ui/SchoolMark";
import { useAuth } from "../../lib/auth";
import { PLATFORM_NAME, SCHOOL_NAME } from "../../lib/mockData";

const navItems = [
  { to: "/admin", label: "数据看板", icon: BarChart3, end: true },
  { to: "/admin/teachers", label: "教师账号", icon: Users },
  { to: "/admin/knowledge", label: "知识库", icon: BookMarked },
  { to: "/admin/skills", label: "Skill 管理", icon: Sparkles },
  { to: "/admin/models", label: "模型管理", icon: Cpu },
  { to: "/admin/credits", label: "积分管理", icon: Coins },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0b1526]">
      <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-700/60 dark:bg-slate-900">
        <div className="flex items-center gap-2.5 border-b border-slate-100 p-4 dark:border-slate-700/60">
          <SchoolMark size={30} />
          <div className="leading-tight">
            <p className="text-[12px] font-semibold text-brand-800 dark:text-brand-100">{SCHOOL_NAME}</p>
            <p className="text-[10px] text-slate-400">{PLATFORM_NAME} · 管理员后台</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium",
                  isActive
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/60",
                )
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="space-y-1 border-t border-slate-100 p-3 dark:border-slate-700/60">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700/60"
          >
            <ArrowLeft size={16} /> 返回教师端
          </button>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30"
          >
            <LogOut size={16} /> 退出登录
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
