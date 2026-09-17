import React from "react";
import { User } from "../types";
import {
  LayoutDashboard,
  MessageSquareText,
  Sparkles,
  Palette,
  ShieldCheck,
  GraduationCap,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  currentUser: User;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  currentUser,
  collapsed,
  onToggleCollapse,
}) => {
  const navItems = [
    {
      id: "dashboard",
      name: "教师 AI 工作台",
      icon: LayoutDashboard,
      desc: "入口聚合与快捷备课",
    },
    {
      id: "assistant",
      name: "AI 助手",
      icon: MessageSquareText,
      desc: "三栏式备课研讨工作台",
    },
    {
      id: "skills",
      name: "Skill 中心",
      icon: Sparkles,
      desc: "学校公共与个人专属Skill",
    },
    {
      id: "studio",
      name: "AI 创作中心",
      icon: Palette,
      desc: "图片/PPT/视频/数字人/3D",
    },
    {
      id: "favorites",
      name: "教研资源收藏夹",
      icon: GraduationCap,
      desc: "名师试题与多模态资产",
    },
    {
      id: "visualization",
      name: "教研数据可视化",
      icon: LayoutDashboard,
      desc: "全校AI备课大屏与考点热力",
    },
    {
      id: "guide",
      name: "使用指南与词典",
      icon: ExternalLink,
      desc: "上手手册与精选Prompt词典",
    },
    {
      id: "admin",
      name: "管理员后台",
      icon: ShieldCheck,
      desc: "全校数据看板与资源治理",
      adminOnly: true,
    },
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-slate-200 bg-white transition-all duration-300 z-30 ${
        collapsed ? "w-18" : "w-64"
      }`}
    >
      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        <div className={`px-2 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider ${collapsed ? "text-center" : ""}`}>
          {!collapsed ? "教学应用工作台" : "应用"}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          const isPermitted = !item.adminOnly || currentUser.role === "admin" || currentUser.role === "lead";

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                isActive
                  ? "bg-[#0F2C59] text-white shadow-md shadow-blue-900/15 font-medium"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
              title={collapsed ? `${item.name} - ${item.desc}` : undefined}
            >
              <div
                className={`p-1.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-white/20 text-amber-300"
                    : "text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
              </div>

              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm truncate">{item.name}</span>
                    {item.adminOnly && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                          isActive
                            ? "bg-amber-400 text-slate-900"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        治理
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-[10px] truncate ${
                      isActive ? "text-blue-200" : "text-slate-400"
                    }`}
                  >
                    {item.desc}
                  </p>
                </div>
              )}
            </button>
          );
        })}

        {/* Quick shortcut card when expanded */}
        {!collapsed && (
          <div className="pt-6 px-1">
            <div className="p-3 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/60 border border-blue-100/80 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-blue-950 mb-1">
                <GraduationCap className="w-4 h-4 text-blue-700" />
                <span>西附校本教研理念</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                “学校统一建设、教师个性使用、经验持续沉淀、能力持续扩展”
              </p>
              <div className="mt-2.5 pt-2 border-t border-blue-100 flex items-center justify-between text-[11px] text-blue-700 font-medium">
                <span>生涯教育引领</span>
                <span className="text-slate-400">两江校区</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Collapse Toggle at bottom */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/60 flex items-center justify-between">
        {!collapsed && (
          <div className="text-[11px] text-slate-400 truncate">
            v2.6.0 · 两江高中部
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors mx-auto"
          title={collapsed ? "展开侧边栏" : "折叠侧边栏"}
        >
          <ChevronRight
            className={`w-4 h-4 transition-transform duration-200 ${
              collapsed ? "rotate-0" : "rotate-180"
            }`}
          />
        </button>
      </div>
    </aside>
  );
};
