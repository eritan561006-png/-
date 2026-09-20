export type StudioType = "image" | "ppt" | "video" | "music" | "avatar" | "3d";

export interface StudioTypeMeta {
  id: StudioType;
  label: string;
  icon: string;
  accent: string;
  creditBase: number;
  async: boolean;
  description: string;
}

export const studioTypes: StudioTypeMeta[] = [
  { id: "image", label: "图片", icon: "🖼️", accent: "text-sky-600 bg-sky-50 dark:bg-sky-900/30 dark:text-sky-300", creditBase: 6, async: false, description: "生成板书插画、课件配图、知识点示意图" },
  { id: "ppt", label: "PPT", icon: "📊", accent: "text-orange-600 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-300", creditBase: 20, async: false, description: "根据教案/知识点一键生成课件大纲与成稿" },
  { id: "video", label: "视频", icon: "🎬", accent: "text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-300", creditBase: 80, async: true, description: "生成微课讲解视频、知识点动画短片" },
  { id: "music", label: "音乐", icon: "🎵", accent: "text-pink-600 bg-pink-50 dark:bg-pink-900/30 dark:text-pink-300", creditBase: 15, async: true, description: "课间铃声、朗诵配乐、轻音乐生成" },
  { id: "avatar", label: "数字人", icon: "🧑‍💻", accent: "text-teal-600 bg-teal-50 dark:bg-teal-900/30 dark:text-teal-300", creditBase: 60, async: true, description: "AI 教师形象播报，用于微课/通知录制" },
  { id: "3d", label: "3D模型", icon: "🧊", accent: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-300", creditBase: 40, async: true, description: "几何体、细胞结构等教学模型生成" },
];
