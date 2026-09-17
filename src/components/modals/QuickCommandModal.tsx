import React, { useState } from "react";
import { QuickCommand } from "../../types";
import {
  X,
  Plus,
  Command,
  Trash2,
  Check,
  RotateCcw,
  Sparkles,
  Search,
  Sliders,
  FilePenLine,
  FileCheck2,
  GitFork,
  BookMarked,
  TrendingUp,
  Wand2,
} from "lucide-react";

interface QuickCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  commands: QuickCommand[];
  onSaveCommands: (commands: QuickCommand[]) => void;
  onSelectCommand?: (cmd: QuickCommand) => void;
}

export const QuickCommandModal: React.FC<QuickCommandModalProps> = ({
  isOpen,
  onClose,
  commands,
  onSaveCommands,
  onSelectCommand,
}) => {
  const [commandList, setCommandList] = useState<QuickCommand[]>(commands);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [editingCommand, setEditingCommand] = useState<QuickCommand | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // New command form state
  const [formData, setFormData] = useState<Partial<QuickCommand>>({
    command: "/",
    label: "",
    description: "",
    category: "命题审题",
    promptTemplate: "请作为西附两江学科专家，围绕【${考点}】展开深入教学设计...",
    enabled: true,
    hotkey: "",
    icon: "Sparkles",
  });

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2500);
  };

  const handleToggleEnabled = (id: string) => {
    const updated = commandList.map((c) =>
      c.id === id ? { ...c, enabled: !c.enabled } : c
    );
    setCommandList(updated);
    onSaveCommands(updated);
    showToast("指令状态已更新");
  };

  const handleDelete = (id: string) => {
    const target = commandList.find((c) => c.id === id);
    if (target?.isSystem) {
      alert("校级系统指令不可删除，您可以将其状态设为禁用。");
      return;
    }
    const updated = commandList.filter((c) => c.id !== id);
    setCommandList(updated);
    onSaveCommands(updated);
    showToast("已删除自定义快捷指令");
  };

  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.command?.startsWith("/")) {
      alert("指令前缀必须以斜杠 / 开头，例如 /命题 或 /学情");
      return;
    }
    if (!formData.label) {
      alert("请输入指令名称");
      return;
    }

    if (editingCommand) {
      const updated = commandList.map((c) =>
        c.id === editingCommand.id ? ({ ...c, ...formData } as QuickCommand) : c
      );
      setCommandList(updated);
      onSaveCommands(updated);
      setEditingCommand(null);
      showToast("快捷指令修改成功");
    } else {
      const newCmd: QuickCommand = {
        id: `cmd-${Date.now()}`,
        command: formData.command,
        label: formData.label,
        description: formData.description || "自定义教学快捷指令",
        category: (formData.category as any) || "命题审题",
        promptTemplate: formData.promptTemplate || "",
        enabled: true,
        hotkey: formData.hotkey || undefined,
        icon: formData.icon || "Sparkles",
        isSystem: false,
      };
      const updated = [...commandList, newCmd];
      setCommandList(updated);
      onSaveCommands(updated);
      setIsCreating(false);
      showToast("新增快捷指令成功");
    }

    // Reset form
    setFormData({
      command: "/",
      label: "",
      description: "",
      category: "命题审题",
      promptTemplate: "",
      enabled: true,
    });
  };

  const filteredCommands = commandList.filter((c) => {
    const matchesSearch =
      c.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedCategory === "all" || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl h-[780px] max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800">
              <Command className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  快捷指令配置中枢
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium border border-amber-200">
                  斜杠命令 /
                </span>
              </div>
              <p className="text-xs text-slate-500">
                在 AI 助手输入框内键入「/」或快捷键，即可一键唤醒标准化高频提示词模板。
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isCreating && !editingCommand && (
              <button
                onClick={() => {
                  setIsCreating(true);
                  setEditingCommand(null);
                  setFormData({
                    command: "/",
                    label: "",
                    description: "",
                    category: "命题审题",
                    promptTemplate:
                      "请作为西附两江学科专家，围绕【${考点}】展开深入教学设计...",
                    enabled: true,
                    hotkey: "",
                    icon: "Sparkles",
                  });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F2C59] text-white hover:bg-blue-900 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>新建快捷指令</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast feedback */}
        {toastMsg && (
          <div className="bg-emerald-600 text-white text-xs py-1.5 px-4 text-center font-medium">
            {toastMsg}
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main List */}
          <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200">
            {/* Filter Bar */}
            <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-3 items-center justify-between">
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索指令名称或指令 /..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                {["all", "命题审题", "教学设计", "学情辅导", "语言文本"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-[#0F2C59] text-white font-medium shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat === "all" ? "全部" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-slate-50/50">
              {filteredCommands.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs">
                  未匹配到相关快捷指令，您可以点击右上角新建。
                </div>
              ) : (
                filteredCommands.map((cmd) => (
                  <div
                    key={cmd.id}
                    className={`p-3.5 rounded-xl border bg-white shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      !cmd.enabled ? "opacity-60 bg-slate-50" : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center font-mono font-bold text-blue-900 text-xs shrink-0 mt-0.5 sm:mt-0">
                        {cmd.command}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 text-sm">
                            {cmd.label}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                            {cmd.category}
                          </span>
                          {cmd.isSystem && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-medium border border-amber-200">
                              校级官方
                            </span>
                          )}
                          {cmd.hotkey && (
                            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 border border-slate-300 rounded text-slate-600">
                              {cmd.hotkey}
                            </kbd>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 truncate max-w-md">
                          {cmd.description}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {onSelectCommand && (
                        <button
                          onClick={() => {
                            onSelectCommand(cmd);
                            onClose();
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium transition-colors"
                        >
                          立即唤醒
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setEditingCommand(cmd);
                          setIsCreating(false);
                          setFormData(cmd);
                        }}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors"
                      >
                        编辑
                      </button>

                      {/* Enable/Disable Toggle */}
                      <button
                        onClick={() => handleToggleEnabled(cmd.id)}
                        className={`text-xs px-2 py-1 rounded-lg transition-colors ${
                          cmd.enabled
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-200 text-slate-600"
                        }`}
                        title={cmd.enabled ? "点击禁用" : "点击启用"}
                      >
                        {cmd.enabled ? "已启用" : "已禁用"}
                      </button>

                      {!cmd.isSystem && (
                        <button
                          onClick={() => handleDelete(cmd.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="删除指令"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Panel: Create / Edit / Detail Drawer */}
          {(isCreating || editingCommand) && (
            <div className="w-full sm:w-96 p-5 bg-white flex flex-col justify-between overflow-y-auto shrink-0 border-l border-slate-200">
              <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {editingCommand ? "编辑快捷指令" : "新建教研快捷指令"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingCommand(null);
                    }}
                    className="text-slate-400 hover:text-slate-700 text-xs"
                  >
                    取消
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    指令前缀 (以 / 开头) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.command}
                    onChange={(e) =>
                      setFormData({ ...formData, command: e.target.value })
                    }
                    placeholder="/命题"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    指令名称 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.label}
                    onChange={(e) =>
                      setFormData({ ...formData, label: e.target.value })
                    }
                    placeholder="新高考母题变式"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      所属分类
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value as any,
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                    >
                      <option value="命题审题">命题审题</option>
                      <option value="教学设计">教学设计</option>
                      <option value="学情辅导">学情辅导</option>
                      <option value="语言文本">语言文本</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      快捷键 (选填)
                    </label>
                    <input
                      type="text"
                      value={formData.hotkey || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, hotkey: e.target.value })
                      }
                      placeholder="Alt+1"
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    简要说明
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="用于生成压轴解答题与双梯度变式"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      绑定提示词模板 (支持占位符) *
                    </label>
                    <span className="text-[10px] text-blue-600">
                      可用占位符: &#123;&#36;&#123;考点&#125;&#125;
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    required
                    value={formData.promptTemplate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        promptTemplate: e.target.value,
                      })
                    }
                    placeholder="请作为西附两江资深教师，围绕【${考点}】命制试题..."
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono leading-relaxed focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-[#0F2C59] text-white font-semibold text-xs shadow-md hover:bg-blue-900 transition-colors"
                  >
                    {editingCommand ? "保存修改" : "确认添加"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingCommand(null);
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs hover:bg-slate-100 transition-colors"
                  >
                    取消
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
