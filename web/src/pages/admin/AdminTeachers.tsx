import { useMemo, useState } from "react";
import { Search, Download, Upload, X, KeyRound, Check } from "lucide-react";
import clsx from "clsx";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { teachers as initialTeachers } from "../../lib/mockData";
import type { Role, Teacher } from "../../lib/types";

const roleLabel: Record<Role, string> = { teacher: "教师", lead: "学科组长", admin: "管理员" };

export default function AdminTeachers() {
  const [list, setList] = useState<Teacher[]>(initialTeachers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Teacher["status"]>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detail, setDetail] = useState<Teacher | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      list.filter(
        (t) =>
          (statusFilter === "all" || t.status === statusFilter) &&
          (t.name.includes(search) || t.employeeNo.includes(search) || t.subject.includes(search)),
      ),
    [list, search, statusFilter],
  );

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  function toggleSelectAll() {
    setSelected((prev) => (prev.size === filtered.length ? new Set() : new Set(filtered.map((t) => t.id))));
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function updateTeacher(id: string, updater: (t: Teacher) => Teacher) {
    setList((prev) => prev.map((t) => (t.id === id ? updater(t) : t)));
    setDetail((prev) => (prev && prev.id === id ? updater(prev) : prev));
  }

  function batchToggleStatus(status: Teacher["status"]) {
    setList((prev) => prev.map((t) => (selected.has(t.id) ? { ...t, status } : t)));
    flash(`已${status === "active" ? "启用" : "禁用"} ${selected.size} 个账号`);
    setSelected(new Set());
  }

  function batchGrantCredits() {
    setList((prev) => prev.map((t) => (selected.has(t.id) ? { ...t, creditBalance: t.creditBalance + 200 } : t)));
    flash(`已为 ${selected.size} 位教师发放 200 积分`);
    setSelected(new Set());
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4 p-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-lg font-semibold text-slate-800 dark:text-white">教师账号管理</h1>
          <p className="mt-0.5 text-xs text-slate-400">共 {list.length} 个账号 · {list.filter((t) => t.status === "active").length} 个启用中</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm">
            <Upload size={14} /> 批量导入
          </Button>
          <Button variant="secondary" size="sm">
            <Download size={14} /> 导出
          </Button>
        </div>
      </div>

      <Card className="p-3">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索姓名/工号/学科"
              className="w-56 rounded-lg border border-slate-200 py-1.5 pl-8 pr-2 text-xs outline-none focus:border-brand-400 dark:border-slate-600 dark:bg-slate-900"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs dark:border-slate-600 dark:bg-slate-900"
          >
            <option value="all">全部状态</option>
            <option value="active">已启用</option>
            <option value="disabled">已禁用</option>
          </select>
          {selected.size > 0 && (
            <div className="flex items-center gap-1.5 rounded-lg bg-brand-50 px-2.5 py-1.5 text-xs text-brand-700 dark:bg-brand-900/30 dark:text-brand-200">
              已选 {selected.size} 项
              <button onClick={() => batchToggleStatus("active")} className="ml-2 rounded bg-white px-2 py-0.5 shadow-sm dark:bg-slate-800">
                批量启用
              </button>
              <button onClick={() => batchToggleStatus("disabled")} className="rounded bg-white px-2 py-0.5 shadow-sm dark:bg-slate-800">
                批量禁用
              </button>
              <button onClick={batchGrantCredits} className="rounded bg-white px-2 py-0.5 shadow-sm dark:bg-slate-800">
                批量发放200积分
              </button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 dark:border-slate-700">
                <th className="w-8 py-2">
                  <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleSelectAll} className="rounded" />
                </th>
                <th className="py-2 font-medium">姓名 / 工号</th>
                <th className="py-2 font-medium">学科 / 部门</th>
                <th className="py-2 font-medium">角色</th>
                <th className="py-2 font-medium">状态</th>
                <th className="py-2 font-medium">积分使用/剩余</th>
                <th className="py-2 font-medium">最近登录</th>
                <th className="py-2 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 dark:border-slate-800 dark:hover:bg-slate-800/40">
                  <td className="py-2.5">
                    <input type="checkbox" checked={selected.has(t.id)} onChange={() => toggleSelect(t.id)} className="rounded" />
                  </td>
                  <td className="py-2.5">
                    <button onClick={() => setDetail(t)} className="text-left hover:text-brand-600">
                      <p className="font-medium text-slate-700 dark:text-slate-200">{t.name}</p>
                      <p className="text-[10px] text-slate-400">{t.employeeNo}</p>
                    </button>
                  </td>
                  <td className="py-2.5 text-slate-500 dark:text-slate-400">
                    {t.subject}
                    <br />
                    <span className="text-[10px] text-slate-400">{t.department}</span>
                  </td>
                  <td className="py-2.5">
                    <Badge tone={t.role === "admin" ? "brand" : t.role === "lead" ? "gold" : "neutral"}>{roleLabel[t.role]}</Badge>
                  </td>
                  <td className="py-2.5">
                    <Badge tone={t.status === "active" ? "success" : "danger"}>{t.status === "active" ? "启用中" : "已禁用"}</Badge>
                  </td>
                  <td className="py-2.5 text-slate-500 dark:text-slate-400">
                    {(t.creditMonthlyQuota - t.creditBalance).toLocaleString()} / {t.creditMonthlyQuota.toLocaleString()}
                  </td>
                  <td className="py-2.5 text-slate-400">{t.lastLoginAt}</td>
                  <td className="py-2.5">
                    <button onClick={() => setDetail(t)} className="text-brand-600 hover:underline dark:text-brand-300">
                      详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-slate-800 px-4 py-2 text-xs text-white shadow-lg">
          <Check size={13} className="text-emerald-400" /> {toast}
        </div>
      )}

      {detail && (
        <div className="fixed inset-0 z-30 flex justify-end bg-black/30" onClick={() => setDetail(null)}>
          <div className="h-full w-full max-w-sm overflow-y-auto bg-white p-6 dark:bg-slate-800" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-800 dark:text-white">教师详情</h2>
              <button onClick={() => setDetail(null)}>
                <X size={18} className="text-slate-400" />
              </button>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <label className="mb-1 block text-[11px] text-slate-400">姓名</label>
                <input
                  defaultValue={detail.name}
                  onBlur={(e) => updateTeacher(detail.id, (t) => ({ ...t, name: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] text-slate-400">工号</label>
                  <p className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-slate-500 dark:border-slate-700 dark:bg-slate-900">{detail.employeeNo}</p>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] text-slate-400">角色</label>
                  <select
                    value={detail.role}
                    onChange={(e) => updateTeacher(detail.id, (t) => ({ ...t, role: e.target.value as Role }))}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs dark:border-slate-600 dark:bg-slate-900"
                  >
                    <option value="teacher">教师</option>
                    <option value="lead">学科组长</option>
                    <option value="admin">管理员</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] text-slate-400">账号状态</label>
                <button
                  onClick={() => updateTeacher(detail.id, (t) => ({ ...t, status: t.status === "active" ? "disabled" : "active" }))}
                  className={clsx(
                    "w-full rounded-lg px-3 py-1.5 text-xs font-medium",
                    detail.status === "active" ? "bg-rose-50 text-rose-600 dark:bg-rose-900/30" : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30",
                  )}
                >
                  {detail.status === "active" ? "停用该账号" : "启用该账号"}
                </button>
              </div>

              <div>
                <label className="mb-1 block text-[11px] text-slate-400">积分额度</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={detail.creditMonthlyQuota}
                    onChange={(e) => updateTeacher(detail.id, (t) => ({ ...t, creditMonthlyQuota: Number(e.target.value) }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
                  />
                  <span className="shrink-0 text-[11px] text-slate-400">月度额度</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">当前剩余：{detail.creditBalance.toLocaleString()}</p>
              </div>

              <button
                onClick={() => flash(`已向 ${detail.name} 老师发送密码重置链接`)}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-xs text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <KeyRound size={13} /> 重置密码
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
