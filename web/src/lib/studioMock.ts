import type { StudioType } from "./studio";

export interface StudioTaskResult {
  id: string;
  type: StudioType;
  title: string;
  createdAt: number;
  creditCost: number;
  status: "running" | "succeeded";
  progress: number;
  seed: number;
  meta: Record<string, string>;
}

const GRADIENTS = [
  "from-sky-400 to-blue-600",
  "from-emerald-400 to-teal-600",
  "from-violet-400 to-purple-600",
  "from-amber-400 to-orange-600",
  "from-rose-400 to-pink-600",
  "from-indigo-400 to-blue-700",
];

export function gradientFor(seed: number) {
  return GRADIENTS[seed % GRADIENTS.length];
}

export const PPT_OUTLINE_TEMPLATES = [
  "封面：标题 + 授课教师 + 日期",
  "本课目标",
  "情境导入",
  "核心概念讲解 (1/2)",
  "核心概念讲解 (2/2)",
  "典型例题精讲",
  "课堂练习",
  "本课小结 + 作业布置",
];
