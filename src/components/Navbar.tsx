import React, { useState } from "react";
import { User } from "../types";
import {
  Bell,
  Zap,
  Search,
  LogOut,
  UserCheck,
  ChevronDown,
  Shield,
  BookOpen,
  Sparkles,
} from "lucide-react";

interface NavbarProps {
  currentUser: User;
  onSwitchUser: (user: User) => void;
  allUsers: User[];
  onLogout: () => void;
  activeView: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSwitchUser,
  allUsers,
  onLogout,
  activeView,
  onNavigate,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showNotice, setShowNotice] = useState(false);

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shadow-xs">
      {/* Left: School brand & Logo */}
      <div className="flex items-center gap-3">
        <div
          onClick={() => onNavigate("dashboard")}
          className="cursor-pointer flex items-center gap-3 group"
        >
          {/* Authentic School Seal Icon with Deep Blue & Gold */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F2C59] via-[#1E3A8A] to-[#0A192F] flex items-center justify-center text-white shadow-md shadow-blue-900/10 border border-amber-400/30 group-hover:scale-105 transition-transform">
            <div className="relative flex items-center justify-center">
              <span className="font-bold text-xs tracking-tighter text-amber-300">西附</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg text-[#0F2C59] tracking-tight">
                西南大学附属中学两江中学
              </span>
              <span className="hidden md:inline-block text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 font-medium border border-blue-200">
                高中部
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              两江中学智能教育助手 · 全场景教学中枢
            </p>
          </div>
        </div>
      </div>

      {/* Center Search (Hidden on small screens) */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="搜索教学功能 / 命题Skill / 课件草稿 / 校本大纲..."
            className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
          />
        </div>
      </div>

      {/* Right: Credits, Notifications, User Profile & Role Switcher */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Credit Badge */}
        <button
          onClick={() => setShowCreditModal(!showCreditModal)}
          className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 text-amber-900 font-medium text-xs sm:text-sm transition-colors cursor-pointer"
          title="点击查看积分规则与使用记录"
        >
          <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
          <span className="font-semibold text-amber-950">
            {currentUser.creditBalance.toLocaleString()}
          </span>
          <span className="text-amber-700 text-xs hidden sm:inline">积分</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotice(!showNotice)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors relative"
            title="通知中心"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          {showNotice && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-2 font-semibold text-slate-800">
                <span>系统通知</span>
                <span className="text-[11px] text-blue-600 cursor-pointer">全部已读</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 bg-blue-50/50 rounded-lg border border-blue-100">
                  <p className="font-medium text-blue-900">【新考纲更新通知】</p>
                  <p className="text-slate-600 mt-0.5">2026年高考数学、物理考查导向已同步至校本知识库。</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">今天 09:30</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="font-medium text-slate-800">【Skill 审核通过】</p>
                  <p className="text-slate-600 mt-0.5">您申请公开的《新高考任务驱动型作文精批》已通过审核并入选推荐。</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">昨天 16:00</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Account & Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-2 pr-1 sm:pr-2.5 py-1 rounded-xl hover:bg-slate-100 border border-slate-200/80 transition-all cursor-pointer"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
            />
            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-xs font-semibold text-slate-800">{currentUser.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    currentUser.role === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : currentUser.role === "lead"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {currentUser.role === "admin"
                    ? "校管理员"
                    : currentUser.role === "lead"
                    ? "备课组长"
                    : "教师"}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-normal">{currentUser.subject}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* User & Role Switch Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3.5 py-2.5 border-b border-slate-100">
                <p className="text-xs text-slate-400">当前登录账号</p>
                <p className="font-semibold text-sm text-slate-800 mt-0.5">
                  {currentUser.name} ({currentUser.employeeNo})
                </p>
                <p className="text-xs text-slate-500">{currentUser.department}</p>
              </div>

              {/* Quick Role Switch for testing */}
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    切换身份（快速体验各端权限）
                  </span>
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="space-y-1">
                  {allUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSwitchUser(u);
                        setShowUserMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        currentUser.id === u.id
                          ? "bg-blue-50 text-blue-900 font-medium"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-md object-cover" />
                        <span>
                          {u.name} · {u.subject}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {u.role === "admin" ? "管理员" : u.role === "lead" ? "组长" : "教师"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation shortcuts inside dropdown */}
              <div className="py-1">
                {currentUser.role === "admin" && (
                  <button
                    onClick={() => {
                      onNavigate("admin");
                      setShowUserMenu(false);
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Shield className="w-3.5 h-3.5 text-purple-600" />
                    <span>进入管理员治理后台</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    onNavigate("skills");
                    setShowUserMenu(false);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>管理我的教学 Skill</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setShowUserMenu(false);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
                  <span>退出当前登录</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Credit Rules Modal */}
      {showCreditModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4"
          onClick={() => setShowCreditModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                  <Zap className="w-5 h-5 fill-amber-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">教师积分与额度说明</h3>
                  <p className="text-xs text-slate-500">学校统一配发 · 每月1日自动重置</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreditModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs text-slate-600">
              <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span>当前账户余额</span>
                <span className="font-bold text-slate-900 text-sm">{currentUser.creditBalance} 积分</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span>月度基准额度</span>
                <span className="font-bold text-slate-900 text-sm">
                  {currentUser.creditMonthlyQuota} 积分
                </span>
              </div>

              <h4 className="font-semibold text-slate-800 pt-2">各项功能消耗倍率：</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg border border-slate-100 bg-white">
                  <span className="text-slate-500">💬 AI 助手对话</span>
                  <p className="font-semibold text-slate-800 mt-0.5">8~10 积分 / 轮</p>
                </div>
                <div className="p-2 rounded-lg border border-slate-100 bg-white">
                  <span className="text-slate-500">📝 命题/审题 Skill</span>
                  <p className="font-semibold text-slate-800 mt-0.5">10 积分 / 次</p>
                </div>
                <div className="p-2 rounded-lg border border-slate-100 bg-white">
                  <span className="text-slate-500">📊 课件 PPT 生成</span>
                  <p className="font-semibold text-slate-800 mt-0.5">15 积分 / 套</p>
                </div>
                <div className="p-2 rounded-lg border border-slate-100 bg-white">
                  <span className="text-slate-500">🎬 微课视频生成</span>
                  <p className="font-semibold text-slate-800 mt-0.5">25 积分 / 份</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 italic">
                * 若因命制大型年级统考试卷积分不足，可由学科组长向管理员申请追加专项额度。
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowCreditModal(false)}
                className="w-full py-2.5 bg-[#0F2C59] hover:bg-[#1E3A8A] text-white font-medium rounded-xl text-xs transition-colors"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
