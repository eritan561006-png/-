import React, { useState, useEffect } from "react";
import { MultimodalPreviewState } from "../../types";
import {
  X,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Layers,
  FileText,
  Copy,
  Check,
  Eye,
  Presentation,
  SlidersHorizontal,
} from "lucide-react";

interface MultimodalPreviewModalProps {
  preview: MultimodalPreviewState;
  onClose: () => void;
  onSendToAssistant?: (content: string) => void;
}

export const MultimodalPreviewModal: React.FC<MultimodalPreviewModalProps> = ({
  preview,
  onClose,
  onSendToAssistant,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [activeTab, setActiveTab] = useState<"preview" | "details" | "notes">("preview");
  const [copied, setCopied] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState("1.0x");
  const [selectedLayer, setSelectedLayer] = useState<string>("全部结构");
  const [modelRotating, setModelRotating] = useState(true);
  const [activeTheme, setActiveTheme] = useState("西附深蓝");

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Keyboard navigation for PPT
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight" || e.key === "PageDown") {
        if (preview.type === "ppt" && preview.data?.slides) {
          setCurrentSlideIndex((prev) =>
            Math.min(preview.data.slides.length - 1, prev + 1)
          );
        }
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        if (preview.type === "ppt" && preview.data?.slides) {
          setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [preview, onClose]);

  if (!preview.isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const slides = preview.data?.slides || [];
  const currentSlide = slides[currentSlideIndex] || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 ${
          isFullscreen
            ? "w-full h-full rounded-none"
            : "w-full max-w-5xl max-h-[92vh] h-[850px]"
        }`}
      >
        {/* Modal Header Bar */}
        <div className="h-14 px-4 sm:px-6 border-b border-slate-200 bg-slate-50/90 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-[#0F2C59] text-amber-300">
              {preview.type === "ppt" && <Presentation className="w-4 h-4" />}
              {preview.type === "image" && <Eye className="w-4 h-4" />}
              {preview.type === "video" && <Play className="w-4 h-4" />}
              {preview.type === "music" && <Volume2 className="w-4 h-4" />}
              {preview.type === "3d_model" && <Layers className="w-4 h-4" />}
              {preview.type === "document" && <FileText className="w-4 h-4" />}
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-sm sm:text-base truncate">
                  {preview.title}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium">
                  {preview.type === "ppt"
                    ? "交互式课件演播"
                    : preview.type === "image"
                    ? "高清教学插图"
                    : preview.type === "video"
                    ? "微课脚本视频"
                    : preview.type === "music"
                    ? "情境背景音频"
                    : preview.type === "3d_model"
                    ? "3D 交互模型"
                    : "教研文档"}
                </span>
              </div>
              {preview.subtitle && (
                <p className="text-[11px] text-slate-400 truncate">{preview.subtitle}</p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick Export/Download */}
            <button
              onClick={() => {
                alert(`已将「${preview.title}」打包准备下载，西附两江校本教学水印已植入。`);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
              title="下载导出资源"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">导出</span>
            </button>

            {/* Toggle Fullscreen */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg hover:bg-slate-200/70 text-slate-600 transition-colors"
              title={isFullscreen ? "退出全屏 (Esc)" : "全屏放映"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
              title="关闭预览"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 bg-slate-900 overflow-hidden">
          {/* 1. PPT Mode Viewer */}
          {preview.type === "ppt" && (
            <div className="flex-1 flex flex-col h-full bg-[#0A192F] relative overflow-hidden">
              {/* Slide Projection Canvas */}
              <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
                {currentSlide ? (
                  <div
                    className={`w-full max-w-3xl aspect-[16/9] rounded-2xl shadow-2xl p-6 sm:p-10 flex flex-col justify-between transition-all duration-300 border border-slate-700/50 ${
                      activeTheme === "西附深蓝"
                        ? "bg-gradient-to-br from-[#0F2C59] via-[#1E3A8A] to-[#0A192F] text-white"
                        : activeTheme === "学术白雅"
                        ? "bg-gradient-to-br from-slate-50 to-white text-slate-900"
                        : "bg-gradient-to-br from-[#1A3636] to-[#0D1F22] text-emerald-50"
                    }`}
                  >
                    {/* Slide Top Branding */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs tracking-wider text-amber-300">
                          西南大学附属中学两江中学
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-slate-300">
                          高中新课程教学研讨
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        第 {currentSlideIndex + 1} 页 / 共 {slides.length} 页
                      </span>
                    </div>

                    {/* Slide Core Content */}
                    <div className="my-auto space-y-4">
                      <div>
                        <h2 className="text-xl sm:text-3xl font-bold tracking-tight mb-2 text-white">
                          {currentSlide.title}
                        </h2>
                        {currentSlide.subtitle && (
                          <p className="text-xs sm:text-sm text-blue-200 font-medium">
                            {currentSlide.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Bullets */}
                      {currentSlide.bullets && (
                        <div className="space-y-2.5 pt-2">
                          {currentSlide.bullets.map((bullet: string, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-start gap-3 text-xs sm:text-base text-slate-200"
                            >
                              <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0"></div>
                              <span className="leading-relaxed">{bullet}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Slide Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[11px] text-slate-400">
                      <span>生涯教育 · 卓越学术 · 自主生长</span>
                      <span>西附两江课件演播中枢</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-400 text-sm">暂无幻灯片页</div>
                )}
              </div>

              {/* PPT Control Bar */}
              <div className="h-14 bg-slate-950/80 border-t border-slate-800 px-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">母版主题：</span>
                  {["西附深蓝", "学术白雅", "教研青绿"].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setActiveTheme(theme)}
                      className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                        activeTheme === theme
                          ? "bg-blue-600 text-white font-medium"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>

                {/* Flip Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentSlideIndex === 0}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="上一页 (←)"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-xs text-slate-300 font-mono px-2">
                    {currentSlideIndex + 1} / {slides.length}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentSlideIndex((prev) =>
                        Math.min(slides.length - 1, prev + 1)
                      )
                    }
                    disabled={currentSlideIndex >= slides.length - 1}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="下一页 (→)"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. Image Mode Viewer */}
          {preview.type === "image" && (
            <div className="flex-1 flex flex-col h-full bg-slate-950 relative overflow-hidden">
              <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
                <div
                  className="relative transition-transform duration-200"
                  style={{
                    transform: `scale(${zoomLevel / 100}) rotate(${rotationAngle}deg)`,
                  }}
                >
                  <img
                    src={
                      preview.data?.imageUrl ||
                      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80"
                    }
                    alt={preview.title}
                    className="max-h-[600px] max-w-full object-contain rounded-xl shadow-2xl border border-slate-700"
                  />
                  {/* Subtle School Watermark */}
                  <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/60 backdrop-blur-md text-[10px] text-amber-300 font-medium border border-amber-400/20">
                    西南大学附属中学两江中学 · 教学专用
                  </div>
                </div>
              </div>

              {/* Image Control Bar */}
              <div className="h-14 bg-slate-900 border-t border-slate-800 px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <button
                    onClick={() => setZoomLevel((prev) => Math.max(50, prev - 25))}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700"
                    title="缩小"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="font-mono w-12 text-center">{zoomLevel}%</span>
                  <button
                    onClick={() => setZoomLevel((prev) => Math.min(200, prev + 25))}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700"
                    title="放大"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setRotationAngle((prev) => (prev + 90) % 360)}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 ml-2"
                    title="顺时针旋转90度"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-slate-400">
                  分辨率：2400 × 1350 · 高中教学高清插图
                </span>
              </div>
            </div>
          )}

          {/* 3. Video Mode Viewer */}
          {preview.type === "video" && (
            <div className="flex-1 flex flex-col h-full bg-black relative">
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-3xl aspect-[16/9] bg-slate-900 rounded-2xl border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center text-center p-6">
                  <div className="w-20 h-20 rounded-full bg-blue-600/20 border-2 border-blue-500/40 flex items-center justify-center mb-4 text-blue-400 animate-pulse">
                    <Play className="w-8 h-8 fill-blue-400 ml-1" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {preview.title}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md">
                    微课高清分镜已由 AI 渲染就绪。包含“片头概念抛出”、“三维动画直观推导”、“高考真题变式点拨”。
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-xs px-2.5 py-1 rounded bg-blue-900/60 text-blue-300 border border-blue-700">
                      1080P 60FPS
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300">
                      西附名师录播原声
                    </span>
                  </div>
                </div>
              </div>

              {/* Video Timeline Scenarios */}
              <div className="bg-slate-950 border-t border-slate-800 p-4 shrink-0">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>微课分镜脚本进度：</span>
                  <div className="flex items-center gap-2">
                    <span>倍速：</span>
                    {["1.0x", "1.25x", "1.5x"].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => setPlaybackSpeed(speed)}
                        className={`px-1.5 py-0.5 rounded text-[11px] ${
                          playbackSpeed === speed
                            ? "bg-blue-600 text-white"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {speed}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { time: "00:00 - 00:30", label: "校园风光引入与思考题" },
                    { time: "00:30 - 01:45", label: "核心知识点三维动画" },
                    { time: "01:45 - 02:50", label: "高考母题通法推导" },
                    { time: "02:50 - 03:20", label: "名师警示与分层作业" },
                  ].map((scene, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-left hover:border-blue-500 cursor-pointer transition-colors"
                    >
                      <span className="text-[10px] text-blue-400 font-mono block">
                        {scene.time}
                      </span>
                      <span className="text-xs text-slate-300 font-medium truncate block mt-0.5">
                        {scene.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. Audio/Music Mode Viewer */}
          {preview.type === "music" && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-slate-950 via-[#0F172A] to-slate-950 text-white">
              {/* Spinning Vinyl Record */}
              <div className="relative mb-8">
                <div
                  className={`w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-radial from-slate-900 via-slate-800 to-black border-4 border-slate-700 shadow-2xl flex items-center justify-center relative ${
                    isPlaying ? "animate-[spin_12s_linear_infinite]" : ""
                  }`}
                >
                  {/* Vinyl Grooves */}
                  <div className="w-44 h-44 rounded-full border border-slate-700/50 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border border-slate-700/40 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-[#0F2C59] border-2 border-amber-400/40 flex items-center justify-center text-center p-1">
                        <span className="text-[10px] font-bold text-amber-300 leading-tight">
                          西附静心
                          <br />
                          伴读曲
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tonearm Simulation */}
                <div className="absolute -top-4 -right-4 w-12 h-24 border-r-2 border-t-2 border-slate-400 rounded-tr-xl transform rotate-12 origin-top-right"></div>
              </div>

              {/* Title & metadata */}
              <h3 className="text-lg sm:text-xl font-bold mb-1 text-center">
                {preview.title}
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                调式：清雅古风 · BPM: 72 · 适用：课前2分钟静心 / 早读沉浸背景音
              </p>

              {/* Equalizer Bars Simulation */}
              <div className="flex items-end gap-1.5 h-10 mb-6">
                {[40, 70, 30, 90, 60, 85, 45, 100, 65, 50, 80, 40].map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-gradient-to-t from-blue-600 to-amber-400 rounded-full transition-all duration-300"
                    style={{
                      height: isPlaying ? `${h}%` : "15%",
                    }}
                  ></div>
                ))}
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-blue-900/40 hover:scale-105 transition-all"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-0.5" />
                  )}
                </button>
                <button
                  onClick={() =>
                    alert("已开启西附课堂课前 2 分钟铃声联动自动播放模式。")
                  }
                  className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="课铃联动设置"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* 5. 3D Model Interactive Mode */}
          {preview.type === "3d_model" && (
            <div className="flex-1 flex flex-col h-full bg-[#0B1329] relative overflow-hidden">
              <div className="flex-1 flex items-center justify-center p-8 relative">
                {/* Simulated 3D Geometry Object */}
                <div
                  className={`w-64 h-64 sm:w-80 sm:h-80 rounded-2xl border-2 border-dashed border-blue-500/40 flex items-center justify-center relative p-4 transition-all duration-500 ${
                    modelRotating ? "animate-[spin_20s_linear_infinite]" : ""
                  }`}
                  style={{
                    boxShadow: "0 0 50px rgba(30, 58, 138, 0.4) inset",
                  }}
                >
                  {/* Outer Capsule / Organelle membrane */}
                  <div className="w-full h-full rounded-full border-2 border-emerald-400/60 flex items-center justify-center relative">
                    {/* Inner layers */}
                    <div className="w-48 h-48 rounded-full border border-teal-300/40 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full border-2 border-emerald-500/80 bg-emerald-950/40 flex items-center justify-center text-center">
                        <span className="text-xs font-bold text-emerald-300">
                          {selectedLayer}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Feature Hotspots */}
                  <div className="absolute top-6 right-8 px-2 py-1 bg-blue-900/90 text-blue-200 text-[10px] rounded border border-blue-500/50">
                    A: 双层膜结构
                  </div>
                  <div className="absolute bottom-10 left-6 px-2 py-1 bg-emerald-900/90 text-emerald-200 text-[10px] rounded border border-emerald-500/50">
                    B: 类囊体基粒
                  </div>
                </div>

                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="font-semibold text-white">模型参数：</div>
                  <div>网格面数：42,000 面</div>
                  <div>材质渲染：PBR 物理着色</div>
                  <div>支持操作：鼠标拖拽旋转 / 滚轮缩放</div>
                </div>
              </div>

              {/* 3D Model Control Bar */}
              <div className="h-14 bg-slate-950 border-t border-slate-800 px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">解剖切面层：</span>
                  {["全部结构", "外膜层", "基质层", "类囊体垛叠"].map((layer) => (
                    <button
                      key={layer}
                      onClick={() => setSelectedLayer(layer)}
                      className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                        selectedLayer === layer
                          ? "bg-emerald-600 text-white font-medium"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {layer}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setModelRotating(!modelRotating)}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1.5"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>{modelRotating ? "暂停旋转" : "继续自转"}</span>
                </button>
              </div>
            </div>
          )}

          {/* 6. Document Reader Mode */}
          {preview.type === "document" && (
            <div className="flex-1 flex flex-col h-full bg-slate-900 overflow-y-auto p-6 sm:p-10">
              <div className="max-w-3xl mx-auto w-full bg-white rounded-xl shadow-2xl p-6 sm:p-10 text-slate-800 leading-relaxed font-serif text-sm sm:text-base border border-slate-200">
                <div className="border-b border-slate-200 pb-4 mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold font-sans text-slate-900">
                    {preview.title}
                  </h2>
                  <p className="text-xs font-sans text-slate-500 mt-1">
                    西南大学附属中学两江中学 · 教学研讨与资源中心归档
                  </p>
                </div>
                <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-700 space-y-4">
                  {typeof preview.data === "string"
                    ? preview.data
                    : JSON.stringify(preview.data, null, 2)}
                </div>
              </div>
            </div>
          )}

          {/* Right Sidebar: Details & Slide List (For PPT or Media) */}
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-800 bg-slate-950/95 flex flex-col shrink-0 text-slate-300">
            {/* Tabs */}
            <div className="flex border-b border-slate-800 text-xs font-medium">
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex-1 py-3 text-center transition-colors ${
                  activeTab === "preview"
                    ? "text-blue-400 border-b-2 border-blue-500 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {preview.type === "ppt" ? "幻灯片缩略图" : "资源元数据"}
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`flex-1 py-3 text-center transition-colors ${
                  activeTab === "details"
                    ? "text-blue-400 border-b-2 border-blue-500 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                教研意图
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={`flex-1 py-3 text-center transition-colors ${
                  activeTab === "notes"
                    ? "text-blue-400 border-b-2 border-blue-500 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                讲义备注
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 p-4 overflow-y-auto text-xs space-y-4">
              {activeTab === "preview" && preview.type === "ppt" && (
                <div className="space-y-2.5">
                  {slides.map((s: any, idx: number) => (
                    <div
                      key={idx}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        currentSlideIndex === idx
                          ? "border-blue-500 bg-blue-950/50 text-white"
                          : "border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-slate-400"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-[11px] text-amber-300">
                          第 {idx + 1} 页
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {s.bullets?.length || 0} 点要领
                        </span>
                      </div>
                      <p className="font-medium text-xs truncate text-slate-200">
                        {s.title}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "preview" && preview.type !== "ppt" && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-slate-400 text-[11px]">资源格式</p>
                    <p className="font-medium text-white mt-0.5">
                      {preview.type.toUpperCase()} 高清矢量渲染
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-slate-400 text-[11px]">归属学科</p>
                    <p className="font-medium text-white mt-0.5">高中学科新课程导学组</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-slate-400 text-[11px]">知识产权保护</p>
                    <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                      西南大学附属中学两江中学内部教研教学授权使用。
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "details" && (
                <div className="space-y-3 leading-relaxed text-slate-300">
                  <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-900/60">
                    <h4 className="font-semibold text-blue-300 text-xs mb-1">
                      【西附校本考纲对标】
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      本套多模态成果针对新高考评价体系“基础性、综合性、应用性、创新性”要求精细建构，特别强化思维可视与具象推导。
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <h4 className="font-semibold text-amber-300 text-xs mb-1">
                      【课堂使用建议】
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      建议将前 2 页用于 5 分钟课前微导入；中间 3 页配合黑板板书展开深度逻辑推演；最后一页留作当堂达标测验。
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "notes" && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-semibold text-white text-xs">
                        主讲教师备课讲义笔记
                      </span>
                      <button
                        onClick={() =>
                          handleCopy(
                            `【${preview.title}】备课教案与讲义要点：重点强化新高考通性通法，避免学生盲目刷题。`
                          )
                        }
                        className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copied ? "已复制" : "复制讲义"}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      在此环节需引导学生独立观察图形对称性与韦达定理方程消元结构，切忌直接给出公式代入。
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions inside Sidebar */}
            <div className="p-3 border-t border-slate-800 bg-slate-950 flex flex-col gap-2 shrink-0">
              {onSendToAssistant && (
                <button
                  onClick={() => {
                    onSendToAssistant(`请围绕资源「${preview.title}」进行进一步变式扩充与考点解析。`);
                    onClose();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>在 AI 助手中深入研讨</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
