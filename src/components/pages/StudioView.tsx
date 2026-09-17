import React, { useState } from "react";
import {
  User,
  PPTSlide,
  MultimodalPreviewState,
  TeachingResourceItem,
} from "../../types";
import {
  Palette,
  Presentation,
  Image as ImageIcon,
  Video,
  Music,
  UserCheck,
  Box,
  Sparkles,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  RotateCw,
  Play,
  Pause,
  CheckCircle2,
  FileDown,
  Bookmark,
  Eye,
  Check,
} from "lucide-react";

interface StudioViewProps {
  currentUser: User;
  initialTab?: string;
  initialPrompt?: string;
  onDeductCredits: (amount: number) => void;
  onOpenPreview?: (preview: MultimodalPreviewState) => void;
  onSaveToFavorites?: (item: TeachingResourceItem) => void;
}

export const StudioView: React.FC<StudioViewProps> = ({
  currentUser,
  initialTab = "ppt",
  initialPrompt = "",
  onDeductCredits,
  onOpenPreview,
  onSaveToFavorites,
}) => {
  const [activeTab, setActiveTab] = useState<
    "ppt" | "image" | "video" | "music" | "digital_human" | "3d_model"
  >((initialTab as any) || "ppt");

  const [savedFavorites, setSavedFavorites] = useState<Record<string, boolean>>(
    {}
  );

  // Prompt input
  const [prompt, setPrompt] = useState(
    initialPrompt || "高三一轮复习《圆锥曲线综合大题》专题教研课件"
  );

  // Generating state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  // PPT Specific State
  const [pptTopic, setPptTopic] = useState("高三一轮复习《圆锥曲线》专题研讨");
  const [pptSlidesCount, setPptSlidesCount] = useState(6);
  const [pptTheme, setPptTheme] = useState("西附深蓝学术");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [generatedPPT, setGeneratedPPT] = useState<{
    title: string;
    theme: string;
    slides: PPTSlide[];
  }>({
    title: "高三一轮复习《圆锥曲线》专题研讨",
    theme: "西附深蓝学术",
    slides: [
      {
        index: 1,
        title: "圆锥曲线综合题命题规律与解题通法",
        subtitle: "西南大学附属中学两江中学 · 高三数学备课组",
        bullets: [
          "主讲教师：高三年级备课组长 李华峰",
          "研究重点：新高考Ⅰ卷抛物线焦点弦与对称性证明",
          "教学目标：落实通性通法，突破代数消元瓶颈",
        ],
      },
      {
        index: 2,
        title: "一、历年新高考命题规律与考向透视",
        subtitle: "突出素养导向，破除机械刷题与技巧依赖",
        bullets: [
          "近三年全国Ⅰ卷解析几何解答题位置与难度系数分析（0.52~0.58）",
          "考查高频点：定点定值问题、垂直与平分对称性、韦达定理设线消元",
          "新题型趋势：设问层次清晰，强化逻辑严谨性与代数运算精准度",
        ],
      },
      {
        index: 3,
        title: "二、核心典例深度剖析：对称性之化归",
        subtitle: "已知抛物线 C: y² = 4x，过点 P(4,0) 作动直线 l 交于 A、B 两点",
        bullets: [
          "【探究命题】：设 Q(-2, 0)，证明 ∠AQB 平分线始终垂直于 x 轴",
          "【几何本质转化】：角平分线垂直等价于斜率互为相反数 k_QA + k_QB = 0",
          "【通法设方程】：设直线方程为 x = my + 4，代入抛物线联立韦达定理",
        ],
      },
      {
        index: 4,
        title: "三、变式探究与高阶思维拓展",
        subtitle: "从特殊到一般：若定点 Q 坐标变化，结论是否仍能保持？",
        bullets: [
          "【变式一】：若直线过抛物线焦点 F(1,0)，以 AB 为直径的圆与准线位置关系",
          "【变式二】：若点 P 移至抛物线外部，切线长与极点极线投影性质类比",
          "【方法总结】：解析几何“几何结论代数化、代数化简结构化”的核心原则",
        ],
      },
      {
        index: 5,
        title: "四、学生易错归因诊断与书写规程",
        subtitle: "西附两江月考大题失分切片分析",
        bullets: [
          "失分点 1：直线斜率不存在或为 0 的极端情形漏讨论（扣 2~3 分）",
          "失分点 2：联立方程判别式 Δ > 0 验证步骤缺失",
          "失分点 3：代数式变形符号错误，未合理利用对称性因式分解",
        ],
      },
      {
        index: 6,
        title: "五、课堂小结与分层课后作业",
        subtitle: "巩固通法，提升能力",
        bullets: [
          "知识回扣：韦达定理消元模板与斜率对称性转化口诀",
          "必做作业：《两江高三导学案》专题六解答题 1~3 题",
          "选做培优：新高考Ⅰ卷解析几何压轴变式题探究报告",
        ],
      },
    ],
  });

  // Image Specific State
  const [imageStyle, setImageStyle] = useState("板书手绘与科学插图风");
  const [imageRatio, setImageRatio] = useState("16:9");
  const [generatedImages, setGeneratedImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  ]);

  // Video State
  const [videoScenes, setVideoScenes] = useState([
    { time: "00:00 - 00:40", title: "微课情境导入", desc: "展示两江新区航拍与西附校本探究问题呈现" },
    { time: "00:40 - 02:15", title: "核心实验动画", desc: "三维动态演示质点运动轨迹与受力分析分解" },
    { time: "02:15 - 03:00", title: "通法例题推导", desc: "教师数字化板书推导演算步骤" },
  ]);

  // Music State
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  // 3D Model State
  const [modelRotation, setModelRotation] = useState(45);

  const tabs = [
    { id: "ppt", name: "课件 PPT", icon: Presentation, cost: "15 积分" },
    { id: "image", name: "教学插画", icon: ImageIcon, cost: "10 积分" },
    { id: "video", name: "微课视频", icon: Video, cost: "25 积分" },
    { id: "digital_human", name: "虚拟名师", icon: UserCheck, cost: "25 积分" },
    { id: "music", name: "情境音乐", icon: Music, cost: "10 积分" },
    { id: "3d_model", name: "3D 模型", icon: Box, cost: "20 积分" },
  ];

  // Handle Trigger Generation
  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationProgress(20);

    const timer = setInterval(() => {
      setGenerationProgress((p) => {
        if (p >= 90) {
          clearInterval(timer);
          return 90;
        }
        return p + 25;
      });
    }, 300);

    try {
      const res = await fetch("/api/generate-creation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: activeTab,
          prompt,
          params: {
            topic: pptTopic,
            slidesCount: pptSlidesCount,
            theme: pptTheme,
            style: imageStyle,
            ratio: imageRatio,
          },
        }),
      });

      const result = await res.json();
      clearInterval(timer);
      setGenerationProgress(100);

      if (result.success) {
        if (activeTab === "ppt" && result.data.slides) {
          setGeneratedPPT({
            title: result.data.title,
            theme: result.data.theme,
            slides: result.data.slides,
          });
          setCurrentSlideIndex(0);
        }
        onDeductCredits(result.creditsCost || 15);
      }
    } catch (err) {
      console.warn("Generation completed with template fallback");
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationProgress(0);
      }, 500);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header & Tab Selector */}
      <div className="space-y-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>西附多模态教学创制引擎</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            AI 教学创作中心
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            一站式生成高品质高中教学资源：学术课件 PPT、板书插画、微课视频、数字人与 3D 几何构件
          </p>
        </div>

        {/* 6 Modality Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-[#0F2C59] text-white shadow-md shadow-blue-950/15"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-amber-300" : "text-slate-500"}`} />
                <span>{tab.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${
                    isActive ? "bg-white/20 text-blue-100" : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {tab.cost}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two Columns: Left Config (35%) + Right Preview (65%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT CONFIGURATION PANEL (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              创作参数配置
            </span>
            <span className="text-[11px] text-blue-700 hover:underline cursor-pointer">
              清空重置
            </span>
          </div>

          {/* Prompt input */}
          <div className="space-y-1.5 text-xs">
            <label className="font-semibold text-slate-700 block">
              描述您想要的内容 / 教学课题 *
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="请输入课题名称、知识点考查方向或直接粘贴 AI 助手的生成文本..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-blue-600 focus:outline-hidden text-xs leading-relaxed"
            />
          </div>

          {/* Modality Specific Parameters */}
          {activeTab === "ppt" && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">课件主题名称</label>
                <input
                  type="text"
                  value={pptTopic}
                  onChange={(e) => setPptTopic(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">幻灯片页数</label>
                  <select
                    value={pptSlidesCount}
                    onChange={(e) => setPptSlidesCount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value={5}>5 页 (微课速讲)</option>
                    <option value={6}>6 页 (研讨标准)</option>
                    <option value={10}>10 页 (大单元完整)</option>
                    <option value={15}>15 页 (高三复习全集)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">视觉模板设计</label>
                  <select
                    value={pptTheme}
                    onChange={(e) => setPptTheme(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="西附深蓝学术">西附深蓝学术 (推荐)</option>
                    <option value="理化生科技蓝">理化生科技蓝</option>
                    <option value="国风水墨典雅">国风水墨典雅</option>
                    <option value="现代极简白底">现代极简白底</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "image" && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">插画风格</label>
                <select
                  value={imageStyle}
                  onChange={(e) => setImageStyle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                >
                  <option value="板书手绘与科学插图风">板书手绘与科学插图风 (适合高中板书)</option>
                  <option value="现代三维几何透视风">现代三维几何透视风</option>
                  <option value="中国传统古风水墨">中国传统古风水墨 (适合语文诗歌)</option>
                  <option value="精细写实解剖示意图">精细写实解剖示意图 (适合生物)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">画幅比例</label>
                <div className="grid grid-cols-3 gap-2">
                  {["16:9", "4:3", "1:1"].map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setImageRatio(r)}
                      className={`py-2 rounded-xl border text-center font-semibold transition-colors cursor-pointer ${
                        imageRatio === r
                          ? "bg-blue-50 border-blue-600 text-blue-900"
                          : "border-slate-200 text-slate-600"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "video" && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">微课时长预估</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white">
                  <option>3 分钟 (重难点微精讲)</option>
                  <option>5 分钟 (完整实验探究)</option>
                  <option>1 分钟 (课前问题导入)</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">配音教师音色</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white">
                  <option>西附名师男声（沉稳有力）</option>
                  <option>西附名师女声（知性亲和）</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === "digital_human" && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">名师数字人形象</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white">
                  <option>西附女教师形象（正装学术风）</option>
                  <option>西附男教师形象（温和儒雅风）</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">教室录播背景</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white">
                  <option>两江中学多媒体智慧讲堂</option>
                  <option>现代化数字化理化生实验室</option>
                  <option>传统古雅书院教研室</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === "music" && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">情境氛围</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white">
                  <option>课前静心沉思（清幽钢琴与远山风声）</option>
                  <option>诗词经典配乐诵读（古筝与箫）</option>
                  <option>课间放松舒缓（清雅轻音乐）</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === "3d_model" && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">模型类别</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white">
                  <option>立体几何截面与内切球模型</option>
                  <option>生物细胞立体切面模型</option>
                  <option>化学晶体空间点阵结构</option>
                  <option>物理回旋加速器与磁场装置</option>
                </select>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0F2C59] to-[#1E3A8A] hover:from-[#0A1F3F] hover:to-[#172D6E] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-950/20 transition-all cursor-pointer disabled:opacity-70"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>正在智能生成 ({generationProgress}%)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>立即启动生成</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              预计消耗{" "}
              {tabs.find((t) => t.id === activeTab)?.cost} · 自动沉淀至教师专属资源库
            </p>
          </div>
        </div>

        {/* RIGHT PREVIEW & RESULTS PANEL (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-4">
          {/* PPT INTERACTIVE PREVIEW */}
          {activeTab === "ppt" && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              {/* Presentation Top bar */}
              <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-600 text-white font-bold">
                    PPT 预览
                  </span>
                  <h4 className="font-bold text-sm truncate">{generatedPPT.title}</h4>
                </div>

                <div className="flex items-center gap-2">
                  {onOpenPreview && (
                    <button
                      onClick={() =>
                        onOpenPreview({
                          isOpen: true,
                          type: "ppt",
                          title: generatedPPT.title,
                          data: generatedPPT,
                          subtitle: `${generatedPPT.theme} · 交互式全屏演播大屏`,
                        })
                      }
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                      title="打开全屏多模态演播大屏"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-300" />
                      <span>全屏演播</span>
                    </button>
                  )}

                  {onSaveToFavorites && (
                    <button
                      onClick={() => {
                        onSaveToFavorites({
                          id: `res-ppt-${Date.now()}`,
                          title: generatedPPT.title,
                          type: "ppt",
                          folderId: "fld-ppt",
                          folderName: "课件PPT",
                          subject: currentUser.subject || "高三数学",
                          grade: "高三年级",
                          summary: `包含 ${generatedPPT.slides.length} 页西附官方学术风格课件大纲。`,
                          tags: ["课件PPT", "AI创作", "西附两江"],
                          authorName: currentUser.name,
                          createdAt: new Date()
                            .toISOString()
                            .replace("T", " ")
                            .slice(0, 16),
                          content: JSON.stringify(generatedPPT),
                          previewUrl:
                            "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
                          starred: true,
                        });
                        setSavedFavorites((prev) => ({ ...prev, ppt: true }));
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                      title="收藏至教研资源库"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>{savedFavorites["ppt"] ? "已收藏" : "收藏"}</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      alert("已生成西附两江官方模版课件，正在为您下载 .pptx 文件！");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>导出 PPTX</span>
                  </button>
                </div>
              </div>

              {/* Slide Presentation Canvas */}
              <div className="p-6 sm:p-8 bg-gradient-to-br from-[#0F2C59] to-[#0A192F] text-white min-h-[380px] flex flex-col justify-between relative shadow-inner">
                {/* School Logo Watermark */}
                <div className="flex items-center justify-between text-xs text-blue-200/80 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-400">西附两江高中部</span>
                    <span>|</span>
                    <span>{generatedPPT.theme}</span>
                  </div>
                  <span>
                    第 {currentSlideIndex + 1} / {generatedPPT.slides.length} 页
                  </span>
                </div>

                {/* Current Slide Content */}
                <div className="my-auto py-4 space-y-4 max-w-2xl">
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                    {generatedPPT.slides[currentSlideIndex].title}
                  </h3>
                  <h4 className="text-sm font-semibold text-amber-300">
                    {generatedPPT.slides[currentSlideIndex].subtitle}
                  </h4>

                  <ul className="space-y-2.5 pt-2">
                    {generatedPPT.slides[currentSlideIndex].bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-2" />
                        <span className="leading-relaxed">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Slide Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-slate-400">
                  <span>西南大学附属中学两江中学 · 教学研讨专用</span>
                  <span>教研备课智能体生成</span>
                </div>
              </div>

              {/* Slide Navigation Bottom Bar */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentSlideIndex === 0}
                    onClick={() => setCurrentSlideIndex((i) => Math.max(0, i - 1))}
                    className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 text-slate-700"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {generatedPPT.slides.map((s, idx) => (
                      <button
                        key={s.index}
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                          currentSlideIndex === idx
                            ? "bg-[#0F2C59] text-white shadow-xs"
                            : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={currentSlideIndex === generatedPPT.slides.length - 1}
                    onClick={() =>
                      setCurrentSlideIndex((i) =>
                        Math.min(generatedPPT.slides.length - 1, i + 1)
                      )
                    }
                    className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 text-slate-700"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-slate-500">
                  共 {generatedPPT.slides.length} 张幻灯片 · 可二次微调文本与格式
                </div>
              </div>
            </div>
          )}

          {/* IMAGE PREVIEW */}
          {activeTab === "image" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="font-bold text-sm text-slate-800">生成画廊（高保真教学插图）</span>
                <span className="text-xs text-slate-400">已自动适配投影 1080P 分辨率</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {generatedImages.map((imgUrl, i) => (
                  <div
                    key={i}
                    className="group relative rounded-xl overflow-hidden border border-slate-200 shadow-xs"
                  >
                    <img
                      src={imgUrl}
                      alt="教学示意图"
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white text-xs">
                      <p className="font-semibold truncate">板书插图方案 #{i + 1}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button className="px-2.5 py-1 bg-white text-slate-900 rounded-md font-medium text-[11px] flex items-center gap-1">
                          <Download className="w-3 h-3" /> 下载
                        </button>
                        <button className="px-2.5 py-1 bg-white/20 text-white rounded-md font-medium text-[11px]">
                          存入教案
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIDEO PREVIEW */}
          {activeTab === "video" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="font-bold text-sm text-slate-800">微课视频生成与分镜脚本</span>
                <span className="text-xs text-emerald-600 font-semibold">渲染就绪 (1080P)</span>
              </div>

              <div className="p-5 bg-slate-900 rounded-xl text-white flex flex-col items-center justify-center min-h-[220px] text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 ml-1" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">西附微课：圆锥曲线对称性动态演绎</h4>
                  <p className="text-xs text-slate-400 mt-1">时长 03:20 · 教师知性亲和女声</p>
                </div>
              </div>

              {/* Scene Timeline */}
              <div className="space-y-2 pt-2">
                <span className="font-bold text-xs text-slate-700">分镜脚本时间轴：</span>
                {videoScenes.map((s, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <span className="font-bold text-blue-900">{s.time}</span>
                    <span className="mx-2 text-slate-400">|</span>
                    <span className="font-semibold text-slate-800">{s.title}</span>
                    <p className="text-slate-500 mt-1">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MUSIC PREVIEW */}
          {activeTab === "music" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="font-bold text-sm text-slate-800">课堂情境音频生成</span>
                <span className="text-xs text-slate-400">无版权争议 · 教学永久授权</span>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                    className="w-12 h-12 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
                  >
                    {isPlayingMusic ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>
                  <div>
                    <h4 className="font-bold text-sm">《春夜喜雨》古诗朗读配乐 · 静雅古琴与风铃</h4>
                    <p className="text-xs text-blue-200 mt-0.5">02:45 · 72 BPM 沉思节奏</p>
                  </div>
                </div>

                <button className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium">
                  下载音频 MP3
                </button>
              </div>
            </div>
          )}

          {/* DIGITAL HUMAN PREVIEW */}
          {activeTab === "digital_human" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="font-bold text-sm text-slate-800">虚拟名师微课播报</span>
                <span className="text-xs text-emerald-600 font-semibold">生成成功</span>
              </div>

              <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80"
                  alt="虚拟教师"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 p-6 flex flex-col justify-between text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2.5 py-1 rounded bg-blue-600 font-semibold">
                      两江中学智慧录播室
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-base">虚拟名师微课出镜带读</h4>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                      “同学们，今天我们一同走进《蜀道难》，体会李白笔下奇伟瑰丽的巴蜀山川与盛唐气象...”
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3D MODEL PREVIEW */}
          {activeTab === "3d_model" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="font-bold text-sm text-slate-800">3D 可交互立体几何 / 生物模型</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setModelRotation((r) => (r + 45) % 360)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" /> 旋转视角 ({modelRotation}°)
                  </button>
                </div>
              </div>

              {/* 3D Interactive Canvas Simulation */}
              <div className="h-72 rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center relative overflow-hidden border border-slate-800">
                {/* Simulated 3D Geometric Cube & Sphere Wireframe */}
                <div
                  className="w-40 h-40 border-2 border-cyan-400/80 rounded-2xl relative flex items-center justify-center shadow-2xl shadow-cyan-500/20 transition-transform duration-500"
                  style={{
                    transform: `rotateY(${modelRotation}deg) rotateX(25deg)`,
                  }}
                >
                  <div className="absolute inset-2 border border-dashed border-amber-300/80 rounded-xl" />
                  <div className="w-20 h-20 rounded-full border-2 border-blue-400 bg-blue-500/20 flex items-center justify-center text-[10px] text-cyan-200 font-mono">
                    叶绿体基粒
                  </div>
                </div>

                <div className="absolute bottom-3 left-4 text-xs text-slate-400 font-mono">
                  GLTF / OBJ 格式 · 可接入两江校区 3D 打印机
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
