import React, { useState } from "react";
import {
  User,
  TeachingSkill,
  KnowledgeDocument,
  ModelGatewayConfig,
  CreditTransaction,
} from "../../types";
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Database,
  Sparkles,
  Cpu,
  Zap,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Upload,
  ArrowUpRight,
  Filter,
  Check,
  RotateCcw,
  Sliders,
  Eye,
} from "lucide-react";

interface AdminViewProps {
  currentUser: User;
  allUsers: User[];
  allSkills: TeachingSkill[];
  knowledgeDocs: KnowledgeDocument[];
  models: ModelGatewayConfig[];
  transactions: CreditTransaction[];
  onApproveSkill: (skillId: string) => void;
  onRejectSkill: (skillId: string, reason: string) => void;
  onUpdateUserQuota: (userId: string, addedCredits: number) => void;
  onAddKnowledgeDoc: (doc: KnowledgeDocument) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  currentUser,
  allUsers,
  allSkills,
  knowledgeDocs,
  models,
  transactions,
  onApproveSkill,
  onRejectSkill,
  onUpdateUserQuota,
  onAddKnowledgeDoc,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<
    "dashboard" | "users" | "kb" | "skills" | "models" | "credits"
  >("dashboard");

  // User management search & selected user
  const [userSearch, setUserSearch] = useState("");
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null);
  const [grantAmount, setGrantAmount] = useState(500);

  // Skill audit state
  const pendingSkills = allSkills.filter((s) => s.status === "pending");
  const approvedSkills = allSkills.filter((s) => s.status === "published");
  const [skillAuditTab, setSkillAuditTab] = useState<"pending" | "published">("pending");

  // KB Upload Modal
  const [showKbUpload, setShowKbUpload] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [newDocSubject, setNewDocSubject] = useState("数学");

  const filteredUsers = allUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.employeeNo.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.subject.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    const newDoc: KnowledgeDocument = {
      id: `kb-${Date.now()}`,
      name: newDocName.endsWith(".pdf") ? newDocName : `${newDocName}.pdf`,
      subject: newDocSubject,
      type: "校本资料",
      fileSize: "12.5 MB",
      chunkCount: 280,
      status: "parsed",
      updatedAt: new Date().toISOString().split("T")[0],
      scope: "全校公开",
    };

    onAddKnowledgeDoc(newDoc);
    setShowKbUpload(false);
    setNewDocName("");
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>西附两江校级智慧教育治理控制台</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            管理员后台治理系统
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            统一监管教师账号分配、校本知识库索引、教研 Skill 审核发布、大模型网关路由与学期积分预算
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">当前管理员：</span>
          <span className="text-xs font-bold text-slate-900 px-2.5 py-1 rounded-lg bg-slate-100">
            {currentUser.name} ({currentUser.department})
          </span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          { id: "dashboard", name: "数据监控看板", icon: TrendingUp },
          { id: "users", name: "教师账号管理", icon: Users, badge: allUsers.length },
          { id: "kb", name: "校本知识库", icon: Database, badge: knowledgeDocs.length },
          { id: "skills", name: "Skill 审核发布", icon: Sparkles, badge: pendingSkills.length || null },
          { id: "models", name: "模型网关路由", icon: Cpu },
          { id: "credits", name: "积分与额度管理", icon: Zap },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                isActive
                  ? "bg-[#0F2C59] text-white shadow-md shadow-blue-950/15"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-amber-300" : "text-slate-500"}`} />
              <span>{tab.name}</span>
              {tab.badge !== undefined && tab.badge !== null && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? "bg-amber-400 text-slate-950"
                      : "bg-blue-100 text-blue-900"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 1. DATA DASHBOARD */}
      {activeAdminTab === "dashboard" && (
        <div className="space-y-6">
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-slate-500">活跃在教教师数</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-slate-900">186 位</span>
                <span className="text-xs font-bold text-emerald-600 flex items-center">
                  ↑ 12.4% 环比
                </span>
              </div>
              <p className="text-[11px] text-slate-400">覆盖全校 9 个高考主要学科</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-slate-500">本月教学对话总数</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-blue-900">14,820 次</span>
                <span className="text-xs font-bold text-emerald-600 flex items-center">
                  ↑ 28.6% 环比
                </span>
              </div>
              <p className="text-[11px] text-slate-400">高考数学与语文教研组使用频次最高</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-slate-500">多模态生成教学产物</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-purple-900">3,410 件</span>
                <span className="text-xs font-bold text-emerald-600 flex items-center">
                  ↑ 19.8% 环比
                </span>
              </div>
              <p className="text-[11px] text-slate-400">课件 PPT (1,240套) · 板书插画 (1,850幅)</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-slate-500">全校积分消耗总量</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-amber-700">128,450 分</span>
                <span className="text-xs text-slate-500">池剩余 78%</span>
              </div>
              <p className="text-[11px] text-slate-400">学期预算充裕，运行平稳</p>
            </div>
          </div>

          {/* Charts & Subject Rankings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Usage Trends */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900">近 7 日各学科教研调用趋势</h4>
                <span className="text-xs text-slate-400">单位：调用次数</span>
              </div>

              {/* Responsive Bar Visualization */}
              <div className="h-56 flex items-end justify-between gap-3 pt-4 px-2 border-b border-slate-100">
                {[
                  { day: "09/10 周四", count: 1420, percent: "60%" },
                  { day: "09/11 周五", count: 1890, percent: "75%" },
                  { day: "09/12 周六", count: 850, percent: "35%" },
                  { day: "09/13 周日", count: 1120, percent: "45%" },
                  { day: "09/14 周一", count: 2450, percent: "95%" },
                  { day: "09/15 周二", count: 2180, percent: "88%" },
                  { day: "09/16 今天", count: 2680, percent: "100%" },
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[10px] text-slate-400">{bar.count}</span>
                    <div className="w-full bg-slate-100 rounded-t-lg h-40 flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-[#0F2C59] to-blue-600 rounded-t-lg transition-all hover:brightness-110"
                        style={{ height: bar.percent }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 text-center">{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subject Rankings & Alerts */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h4 className="font-bold text-sm text-slate-900">学科组使用热度排行榜</h4>
              <div className="space-y-3">
                {[
                  { rank: 1, subject: "高三数学备课组", calls: "4,210 次", score: "98分" },
                  { rank: 2, subject: "高二语文教研组", calls: "3,890 次", score: "95分" },
                  { rank: 3, subject: "高三理综物理组", calls: "2,650 次", score: "90分" },
                  { rank: 4, subject: "高一英语备课组", calls: "1,940 次", score: "86分" },
                  { rank: 5, subject: "高二化学备课组", calls: "1,420 次", score: "82分" },
                ].map((item) => (
                  <div
                    key={item.rank}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${
                          item.rank === 1
                            ? "bg-amber-400 text-slate-950"
                            : item.rank === 2
                            ? "bg-slate-300 text-slate-800"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {item.rank}
                      </span>
                      <span className="font-semibold text-slate-800">{item.subject}</span>
                    </div>
                    <span className="text-slate-500 font-medium">{item.calls}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TEACHER ACCOUNTS MANAGEMENT */}
      {activeAdminTab === "users" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="搜索姓名 / 工号 / 学科部门..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  allUsers.forEach((u) => onUpdateUserQuota(u.id, 500));
                  alert("已成功为全校教师统一批量充值 500 积分！");
                }}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>全校批量充值 500 积分</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th className="p-3.5">教师信息</th>
                  <th className="p-3.5">学科 / 部门</th>
                  <th className="p-3.5">角色权限</th>
                  <th className="p-3.5">积分余额 / 月额度</th>
                  <th className="p-3.5">状态</th>
                  <th className="p-3.5">最近登录</th>
                  <th className="p-3.5 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{u.name}</span>
                          <span className="text-[10px] text-slate-400">{u.employeeNo}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-medium text-slate-800 block">{u.subject}</span>
                      <span className="text-[10px] text-slate-400">{u.department}</span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          u.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : u.role === "lead"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {u.role === "admin"
                          ? "校级管理员"
                          : u.role === "lead"
                          ? "备课组长"
                          : "任课教师"}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900">
                        {u.creditBalance.toLocaleString()}
                      </span>
                      <span className="text-slate-400"> / {u.creditMonthlyQuota}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>正常</span>
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500">{u.lastLoginAt}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedUserForEdit(u)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-blue-900 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
                      >
                        调整额度
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Edit User Modal */}
          {selectedUserForEdit && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-5 border border-slate-200 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h4 className="font-bold text-sm text-slate-900">
                    为 {selectedUserForEdit.name} 调整积分
                  </h4>
                  <button
                    onClick={() => setSelectedUserForEdit(null)}
                    className="text-slate-400 text-lg"
                  >
                    &times;
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <p className="text-slate-600">
                    当前余额：<strong>{selectedUserForEdit.creditBalance} 积分</strong>
                  </p>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">追加积分额度：</label>
                    <input
                      type="number"
                      value={grantAmount}
                      onChange={(e) => setGrantAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setSelectedUserForEdit(null)}
                    className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => {
                      onUpdateUserQuota(selectedUserForEdit.id, grantAmount);
                      setSelectedUserForEdit(null);
                    }}
                    className="px-4 py-1.5 bg-[#0F2C59] text-white rounded-xl text-xs font-semibold"
                  >
                    确认充值
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. KNOWLEDGE BASE MANAGEMENT */}
      {activeAdminTab === "kb" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-slate-900">西附校本教研向量文档库</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                支持 PDF/Word 自动分块、向量化索引与学科隔离权限
              </p>
            </div>
            <button
              onClick={() => setShowKbUpload(true)}
              className="px-3 py-2 bg-[#0F2C59] hover:bg-[#1E3A8A] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>上传新教研资料</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {knowledgeDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-[10px] font-bold">
                      {doc.type}
                    </span>
                    <span className="text-xs font-bold text-slate-900 line-clamp-1">{doc.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-3 pt-1">
                    <span>文件大小：{doc.fileSize}</span>
                    <span>分片数量：{doc.chunkCount} 个切片</span>
                  </div>
                  <div className="text-[10px] text-slate-400 pt-1">
                    所属学科：{doc.subject} · 可见：{doc.scope} · 更新：{doc.updatedAt}
                  </div>
                </div>

                <span className="shrink-0 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  已向量化
                </span>
              </div>
            ))}
          </div>

          {/* Upload Modal */}
          {showKbUpload && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 border border-slate-200 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h4 className="font-bold text-sm text-slate-900">上传教研资料至向量知识库</h4>
                  <button onClick={() => setShowKbUpload(false)} className="text-slate-400 text-lg">
                    &times;
                  </button>
                </div>

                <form onSubmit={handleUploadDoc} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">文件名称：</label>
                    <input
                      type="text"
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                      placeholder="如：2026年高三零诊试卷分析与命题意图.pdf"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">对应学科：</label>
                    <select
                      value={newDocSubject}
                      onChange={(e) => setNewDocSubject(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                    >
                      <option value="语文">高中语文</option>
                      <option value="数学">高中数学</option>
                      <option value="英语">高中英语</option>
                      <option value="物理">高中物理</option>
                      <option value="化学">高中化学</option>
                      <option value="综合">校本教研全科</option>
                    </select>
                  </div>

                  <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center text-slate-400">
                    <Upload className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                    <span>支持直接拖拽 PDF / Word / PPTX 文件至此</span>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowKbUpload(false)}
                      className="px-3 py-1.5 border border-slate-200 rounded-xl"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#0F2C59] text-white rounded-xl font-semibold"
                    >
                      开始解析并向量化
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. SKILL GOVERNANCE & AUDIT */}
      {activeAdminTab === "skills" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setSkillAuditTab("pending")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                skillAuditTab === "pending"
                  ? "bg-amber-100 text-amber-900"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              待审核申请 ({pendingSkills.length})
            </button>
            <button
              onClick={() => setSkillAuditTab("published")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                skillAuditTab === "published"
                  ? "bg-blue-100 text-blue-900"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              已发布公共 Skill ({approvedSkills.length})
            </button>
          </div>

          {skillAuditTab === "pending" && (
            <div className="space-y-3">
              {pendingSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-5 rounded-2xl bg-white border border-amber-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                        申请加入全校公共库
                      </span>
                      <h4 className="font-bold text-sm text-slate-900">{skill.name}</h4>
                    </div>
                    <p className="text-xs text-slate-600">{skill.description}</p>
                    <div className="text-[11px] text-slate-400 pt-1">
                      提交人：<strong>{skill.authorName}</strong> · 学科：{skill.subject} ·
                      类型：{skill.category}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onApproveSkill(skill.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>审核通过</span>
                    </button>
                    <button
                      onClick={() => onRejectSkill(skill.id, "建议补充更详尽的评分细则说明")}
                      className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>驳回</span>
                    </button>
                  </div>
                </div>
              ))}

              {pendingSkills.length === 0 && (
                <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                  暂无待审核的公共 Skill 申请
                </div>
              )}
            </div>
          )}

          {skillAuditTab === "published" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {approvedSkills.map((s) => (
                <div key={s.id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{s.name}</span>
                    <span className="text-[10px] text-slate-400">已调用 {s.usageCount} 次</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{s.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. MODEL GATEWAY ROUTING */}
      {activeAdminTab === "models" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-950">
            <span className="font-bold">西附两江多模型安全网关</span>
            <p className="text-[11px] text-slate-600 mt-0.5">
              支持按请求学科自适应路由大模型通道；当主模型异常时支持毫秒级自动降级至备用通道。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {models.map((m) => (
              <div
                key={m.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{m.name}</span>
                    {m.isDefault && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                        默认路由
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> 正常运行
                  </span>
                </div>

                <div className="text-xs text-slate-500 space-y-1">
                  <p>服务提供商：{m.provider}</p>
                  <p>积分扣除倍率：{m.multiplier}x 积分</p>
                  <p>平均接口延迟：{m.latency}</p>
                  <p>全校调用成功率：{m.successRate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. CREDIT AUDIT LOGS */}
      {activeAdminTab === "credits" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-sm text-slate-900">全校积分消耗流水明细</h4>
            <span className="text-xs text-slate-400">实时审计追踪</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th className="p-3">时间</th>
                  <th className="p-3">教师名称</th>
                  <th className="p-3">变动类型</th>
                  <th className="p-3">积分变动</th>
                  <th className="p-3">事项明细</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80">
                    <td className="p-3 text-slate-400">{tx.createdAt}</td>
                    <td className="p-3 font-semibold text-slate-800">{tx.teacherName}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {tx.type === "creation"
                          ? "多模态创作"
                          : tx.type === "skill_call"
                          ? "Skill调用"
                          : tx.type === "chat"
                          ? "助手对话"
                          : "管理员划拨"}
                      </span>
                    </td>
                    <td
                      className={`p-3 font-bold ${
                        tx.amount > 0 ? "text-emerald-600" : "text-amber-700"
                      }`}
                    >
                      {tx.amount > 0 ? `+${tx.amount}` : tx.amount} 分
                    </td>
                    <td className="p-3 text-slate-600">{tx.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
