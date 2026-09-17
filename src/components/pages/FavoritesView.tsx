import React, { useState } from "react";
import {
  User,
  TeachingResourceItem,
  ResourceFolder,
  MultimodalPreviewState,
} from "../../types";
import {
  FolderOpen,
  Search,
  Bookmark,
  Star,
  Plus,
  Trash2,
  Copy,
  Check,
  Send,
  ExternalLink,
  Tag,
  FileText,
  Presentation,
  Sparkles,
  Palette,
  Eye,
  Download,
  Filter,
  Layers,
  X,
} from "lucide-react";

interface FavoritesViewProps {
  currentUser: User;
  resources: TeachingResourceItem[];
  folders: ResourceFolder[];
  onAddResource: (item: TeachingResourceItem) => void;
  onDeleteResource: (id: string) => void;
  onToggleStarResource: (id: string) => void;
  onOpenPreview: (preview: MultimodalPreviewState) => void;
  onNavigateToAssistant: (prompt: string) => void;
  onNavigateToStudio: (tab: string, prompt?: string) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  currentUser,
  resources,
  folders,
  onAddResource,
  onDeleteResource,
  onToggleStarResource,
  onOpenPreview,
  onNavigateToAssistant,
  onNavigateToStudio,
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCreatingModal, setIsCreatingModal] = useState(false);

  // New resource creation form state
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<any>("exam_question");
  const [newSubject, setNewSubject] = useState(currentUser.subject || "高中数学");
  const [newContent, setNewContent] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const [newTags, setNewTags] = useState("高考题, 难点突破");

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter logic
  const filteredResources = resources.filter((res) => {
    const matchesFolder =
      selectedFolderId === "all" || res.folderId === selectedFolderId;
    const matchesType = selectedType === "all" || res.type === selectedType;
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFolder && matchesType && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert("请输入资源标题");
      return;
    }
    const item: TeachingResourceItem = {
      id: `res-${Date.now()}`,
      title: newTitle,
      type: newType,
      folderId: selectedFolderId === "all" ? "gaokao-math" : selectedFolderId,
      folderName: "教师个人沉淀",
      subject: newSubject,
      grade: "高三年级",
      summary: newSummary || newContent.slice(0, 80) + "...",
      tags: newTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      authorName: currentUser.name,
      createdAt: new Date().toISOString().replace("T", " ").slice(0, 16),
      content: newContent,
      starred: true,
    };
    onAddResource(item);
    setIsCreatingModal(false);
    setNewTitle("");
    setNewContent("");
    setNewSummary("");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/20">
              <Bookmark className="w-5 h-5 fill-amber-500/20" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              西附两江 · 教研资源收藏夹
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            沉淀名师高品质试题、分层教案、多模态课件与精选 Prompt，支持一键调取与备课组协同共享。
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const exportBlob = new Blob([JSON.stringify(resources, null, 2)], {
                type: "application/json",
              });
              const url = URL.createObjectURL(exportBlob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `西附两江教研资源库_${new Date()
                .toISOString()
                .slice(0, 10)}.json`;
              a.click();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>导出资源清单</span>
          </button>

          <button
            onClick={() => setIsCreatingModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0F2C59] text-white hover:bg-blue-900 text-xs font-semibold shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>新建收藏条目</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Folders & Right Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left: Folders & Type Filter Drawer */}
        <div className="space-y-4">
          {/* Folders Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
              教研分类夹
            </h3>
            <div className="space-y-1">
              {folders.map((folder) => {
                const isSelected = selectedFolderId === folder.id;
                const count =
                  folder.id === "all"
                    ? resources.length
                    : resources.filter((r) => r.folderId === folder.id).length;

                return (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolderId(folder.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#0F2C59] text-white shadow-xs font-semibold"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FolderOpen
                        className={`w-4 h-4 shrink-0 ${
                          isSelected ? "text-amber-300" : "text-slate-400"
                        }`}
                      />
                      <span className="truncate">{folder.name}</span>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/70 to-indigo-50/40 border border-blue-100 text-xs">
            <span className="font-semibold text-blue-950 block mb-1">
              西附教研协同沉淀
            </span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              收藏夹中标记为星标的内容将自动汇入备课组月末优质校本教研精编白皮书。
            </p>
          </div>
        </div>

        {/* Right: Content Cards & Filter Header */}
        <div className="md:col-span-3 space-y-4">
          {/* Search & Type filter pills */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索试题标题 / 考点标签 / 知识点摘要..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 focus:bg-white"
              />
            </div>

            {/* Type Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {[
                { id: "all", label: "全部格式" },
                { id: "exam_question", label: "试题与变式" },
                { id: "lesson_plan", label: "单元教案" },
                { id: "ppt", label: "课件 PPT" },
                { id: "prompt", label: "Prompt模板" },
                { id: "multimodal", label: "插画音视频" },
                { id: "diagnostic", label: "学情诊断" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedType(t.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-colors cursor-pointer ${
                    selectedType === t.id
                      ? "bg-[#0F2C59] text-white font-medium shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="space-y-3.5">
            {filteredResources.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center text-slate-400 space-y-2">
                <Bookmark className="w-10 h-10 mx-auto text-slate-300 stroke-[1.5]" />
                <p className="text-sm font-medium text-slate-600">
                  当前分类下暂无收藏资源
                </p>
                <p className="text-xs text-slate-400">
                  您可以在 AI 助手对话产出中点击“收藏”或在右上角手动新建。
                </p>
              </div>
            ) : (
              filteredResources.map((res) => {
                const isPPT = res.type === "ppt";
                const isExam = res.type === "exam_question";
                const isMultimodal = res.type === "multimodal";

                return (
                  <div
                    key={res.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-blue-200 transition-all space-y-3 group"
                  >
                    {/* Top Row: Type Badge, Subject & Star */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[11px] px-2.5 py-0.5 rounded-md font-semibold flex items-center gap-1.5 ${
                            isPPT
                              ? "bg-amber-100 text-amber-900 border border-amber-200"
                              : isExam
                              ? "bg-blue-100 text-blue-900 border border-blue-200"
                              : isMultimodal
                              ? "bg-purple-100 text-purple-900 border border-purple-200"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {isPPT && <Presentation className="w-3.5 h-3.5" />}
                          {isExam && <FileText className="w-3.5 h-3.5" />}
                          {isMultimodal && <Palette className="w-3.5 h-3.5" />}
                          <span>
                            {res.type === "exam_question"
                              ? "新高考大题"
                              : res.type === "lesson_plan"
                              ? "大单元导学案"
                              : res.type === "ppt"
                              ? "演播课件 PPT"
                              : res.type === "prompt"
                              ? "名师 Prompt"
                              : res.type === "diagnostic"
                              ? "学情诊断量表"
                              : "多模态素材"}
                          </span>
                        </span>

                        <span className="text-xs text-slate-500 font-medium">
                          {res.subject} · {res.grade}
                        </span>

                        <span className="text-slate-300 text-xs">|</span>

                        <span className="text-[11px] text-slate-400">
                          收录于 {res.createdAt}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onToggleStarResource(res.id)}
                          className="p-1 rounded-lg hover:bg-amber-50 text-slate-300 hover:text-amber-500 transition-colors"
                          title="设为精品星标"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              res.starred
                                ? "fill-amber-400 text-amber-500"
                                : "text-slate-300"
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => onDeleteResource(res.id)}
                          className="p-1 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          title="移出收藏夹"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Title & Summary */}
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {res.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                        {res.summary}
                      </p>
                    </div>

                    {/* Tags */}
                    {res.tags && res.tags.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <Tag className="w-3.5 h-3.5 text-slate-400" />
                        {res.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
                            onClick={() => setSearchQuery(tag)}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Bottom Actions Row */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="text-slate-400 text-[11px]">
                        沉淀教师：{res.authorName} · {res.folderName}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Preview in Modal Button */}
                        <button
                          onClick={() => {
                            if (res.multimodalData) {
                              onOpenPreview({
                                isOpen: true,
                                type: res.multimodalData.type || (res.type as any),
                                title: res.title,
                                data: res.multimodalData,
                                subtitle: `${res.subject} · ${res.folderName}`,
                              });
                            } else {
                              onOpenPreview({
                                isOpen: true,
                                type: "document",
                                title: res.title,
                                data: res.content,
                                subtitle: `${res.subject} · ${res.folderName}`,
                              });
                            }
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-600" />
                          <span>全景预览</span>
                        </button>

                        {/* Copy Content */}
                        <button
                          onClick={() => handleCopy(res.id, res.content)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-medium transition-colors"
                        >
                          {copiedId === res.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                          )}
                          <span>{copiedId === res.id ? "已复制" : "复制正文"}</span>
                        </button>

                        {/* Send to Assistant */}
                        <button
                          onClick={() => {
                            onNavigateToAssistant(
                              `请调取西附收藏教研成果【${res.title}】，为我进行进一步的教学延伸与学情分层变式设计。`
                            );
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-medium transition-colors"
                          title="在 AI 助手中调用此成果继续备课"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>在助手中调用</span>
                        </button>

                        {/* Send to Studio if PPT or image */}
                        {isPPT && (
                          <button
                            onClick={() => {
                              onNavigateToStudio("ppt", res.title);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-medium transition-colors"
                            title="在创作中心编辑此课件"
                          >
                            <Presentation className="w-3.5 h-3.5 text-amber-700" />
                            <span>进入课件创作</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Manual Add Resource Modal */}
      {isCreatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                新建校本收藏条目
              </h3>
              <button
                onClick={() => setIsCreatingModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  资源标题 *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="例如：【高考数学】圆锥曲线定值问题通法剖析"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    资源类型
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="exam_question">高考试题与变式</option>
                    <option value="lesson_plan">大单元导学案</option>
                    <option value="ppt">课件 PPT</option>
                    <option value="prompt">名师专属 Prompt</option>
                    <option value="diagnostic">学情诊断量表</option>
                    <option value="multimodal">多模态素材</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    学科
                  </label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  摘要说明
                </label>
                <input
                  type="text"
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="用一句话总结考查素养与使用场景"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  知识点与标签 (逗号分隔)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="高考真题, 解析几何, 韦达定理"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  内容详案 (支持 Markdown / LaTeX 公式) *
                </label>
                <textarea
                  rows={6}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="粘贴试题正文、教案或 Prompt 模板内容..."
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs hover:bg-slate-100"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0F2C59] text-white font-semibold text-xs shadow-md hover:bg-blue-900"
                >
                  确认归档入库
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
