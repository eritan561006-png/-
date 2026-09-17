import { knowledgeDocs, skills } from "./mockData";
import type { SkillItem } from "./types";

export interface AIResponsePlan {
  skill?: SkillItem;
  citedDocIds: string[];
  content: string;
}

const KEYWORD_SKILL_MAP: Array<{ keywords: string[]; skillId: string }> = [
  { keywords: ["命题", "出题", "试卷", "题目"], skillId: "sk-001" },
  { keywords: ["作文", "批改"], skillId: "sk-002" },
  { keywords: ["审题", "审核试卷"], skillId: "sk-003" },
  { keywords: ["教案", "课时"], skillId: "sk-004" },
];

function pickSkill(input: string): SkillItem | undefined {
  for (const entry of KEYWORD_SKILL_MAP) {
    if (entry.keywords.some((k) => input.includes(k))) {
      return skills.find((s) => s.id === entry.skillId);
    }
  }
  return undefined;
}

function pickCitedDocs(input: string): string[] {
  const hits = knowledgeDocs.filter((doc) =>
    input.includes(doc.subject) || input.includes(doc.type),
  );
  if (hits.length > 0) return hits.slice(0, 2).map((d) => d.id);
  return knowledgeDocs.slice(0, 1).map((d) => d.id);
}

const GENERIC_BODIES = [
  (topic: string) =>
    `已为你梳理关于"${topic}"的教学要点，建议从情境导入、核心概念讲解、典型例题、课堂练习四个环节展开，并预留5分钟总结反馈时间。`,
  (topic: string) =>
    `关于"${topic}"，结合本学期学情数据，建议重点关注中等及以下水平学生的基础巩固，同时为学有余力学生设计1-2道拓展题。`,
  (topic: string) =>
    `我已整理出"${topic}"相关的3个易错点与对应讲解思路，可直接用于课堂讲评或纳入下次周测。`,
];

function buildSkillBody(skill: SkillItem, input: string): string {
  switch (skill.id) {
    case "sk-001":
      return [
        "已根据《2026版高中数学课程标准》与近五年真题分布，生成 5 道中等难度选择题：",
        "",
        "**第1题** 已知函数 f(x) = x³ − 3x + 1，判断其在区间 (−1, 1) 上的单调性。",
        "A. 单调递增　B. 单调递减　C. 先增后减　D. 先减后增",
        "*解析：f'(x) = 3x² − 3，在 (−1,1) 内 f'(x) < 0，故单调递减。* **答案：B**",
        "",
        "**第2题～第5题** 已按同一知识点、递增难度梯度生成完毕（此处为演示，已省略）。",
        "",
        "📎 已同步标注每题对应课标条目与历年真题相似度，可在右侧「Skill 调用」面板查看完整结构化输出，并一键导出为 Word 试卷。",
      ].join("\n");
    case "sk-002":
      return [
        "已按高考作文评分标准（立意 20 + 结构 20 + 语言 30 + 书写 10 + 发展等级 20）完成批改：",
        "",
        "| 维度 | 得分 | 简评 |",
        "|---|---|---|",
        "| 立意 | 17/20 | 主题清晰，情感真挚，可进一步升华主旨 |",
        "| 结构 | 16/20 | 首尾呼应，中间段落可增加一次转折 |",
        "| 语言 | 24/30 | 用词准确，建议增加 1-2 处修辞手法 |",
        "| 书写 | 9/10 | 卷面整洁 |",
        "",
        "**综合得分：约 52/60（一类文下）**",
        "**升格建议**：在第三段加入一处细节描写，强化“心动瞬间”的画面感。",
      ].join("\n");
    case "sk-003":
      return [
        "审题完成，发现以下情况：",
        "- ✅ 知识点覆盖率 92%，符合本单元教学要求",
        "- ⚠️ 第 8、15 题重复考查“函数单调性”，建议替换其中一题",
        "- ⚠️ 难度分布：容易 30% / 中等 45% / 困难 25%，困难题占比略高于建议值（20%）",
        "",
        "建议将第 15 题替换为中等难度题目，并附上 2 道可选替换题供你参考。",
      ].join("\n");
    case "sk-004":
      return [
        "已生成 45 分钟英语听说课教案：",
        "",
        "**教学目标**：能运用旅行相关词汇与句型描述一次旅行经历",
        "**情境导入（5min）**：展示三张旅行图片，引导学生猜测目的地",
        "**听力活动（15min）**：播放对话录音，完成信息填空",
        "**口语输出（15min）**：Pair work，两两描述一次难忘的旅行",
        "**板书设计 + 作业布置（10min）**：核心句型总结 + 录制1分钟旅行口语作业",
        "",
        "完整教案已可在「AI创作中心 → PPT」一键生成配套课件。",
      ].join("\n");
    default:
      return GENERIC_BODIES[0](input);
  }
}

export function planAIResponse(userInput: string, forcedSkillId?: string): AIResponsePlan {
  const skill = forcedSkillId ? skills.find((s) => s.id === forcedSkillId) : pickSkill(userInput);
  const citedDocIds = pickCitedDocs(userInput);
  const content = skill
    ? buildSkillBody(skill, userInput)
    : GENERIC_BODIES[Math.floor(Math.random() * GENERIC_BODIES.length)](
        userInput.slice(0, 24) || "你的问题",
      );
  return { skill, citedDocIds, content };
}

/** Splits text into small chunks to simulate token-by-token streaming. */
export function chunkForStreaming(text: string): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    const size = 2 + Math.floor(Math.random() * 4);
    chunks.push(text.slice(i, i + size));
    i += size;
  }
  return chunks;
}
