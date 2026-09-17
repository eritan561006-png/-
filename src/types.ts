export type UserRole = "teacher" | "lead" | "admin" | "superadmin";

export interface User {
  id: string;
  name: string;
  employeeNo: string;
  subject: string;
  department: string;
  role: UserRole;
  avatar: string;
  creditBalance: number;
  creditMonthlyQuota: number;
  status: "active" | "disabled";
  lastLoginAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
  tokensUsed?: number;
  invokedSkill?: string;
  citedSources?: Array<{ title: string; relevance: string; page?: number }>;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
  model: string;
  pinned?: boolean;
}

export type SkillScope = "private" | "dept" | "public";
export type SkillStatus = "draft" | "pending" | "published" | "rejected";

export interface TeachingSkill {
  id: string;
  name: string;
  description: string;
  icon: string;
  subject: string;
  category: "命题" | "审题" | "教案" | "批改" | "综合";
  scope: SkillScope;
  status: SkillStatus;
  authorName: string;
  authorId: string;
  isOfficial?: boolean;
  rating: number;
  usageCount: number;
  promptTemplate: string;
  outputFormat: string;
  kbScope?: string;
  createdAt: string;
}

export interface KnowledgeDocument {
  id: string;
  name: string;
  subject: string;
  type: "教材" | "教学大纲" | "高考真题" | "校本资料" | "微专题";
  fileSize: string;
  chunkCount: number;
  status: "parsed" | "parsing" | "failed";
  updatedAt: string;
  scope: string;
}

export interface ModelGatewayConfig {
  id: string;
  name: string;
  provider: string;
  multiplier: number;
  status: "active" | "standby" | "disabled";
  latency: string;
  successRate: string;
  isDefault?: boolean;
}

export interface CreditTransaction {
  id: string;
  teacherId?: string;
  teacherName: string;
  amount: number;
  type: "chat" | "creation" | "skill_call" | "admin_grant" | "reset";
  detail: string;
  createdAt: string;
}

export interface PPTSlide {
  index: number;
  title: string;
  subtitle: string;
  bullets: string[];
}

export interface QuickCommand {
  id: string;
  command: string; // e.g. "/命题", "/审题", "/变式", "/解析", "/教案", "/学情", "/润色"
  label: string; // e.g. "新高考命题"
  description: string;
  icon: string;
  promptTemplate: string;
  category: "命题审题" | "教学设计" | "学情辅导" | "语言文本";
  isSystem?: boolean;
  enabled: boolean;
  hotkey?: string;
}

export type ResourceType =
  | "exam_question"
  | "lesson_plan"
  | "ppt"
  | "prompt"
  | "multimodal"
  | "diagnostic";

export interface TeachingResourceItem {
  id: string;
  title: string;
  type: ResourceType;
  folderId: string;
  folderName: string;
  subject: string;
  grade: string;
  content: string;
  summary: string;
  tags: string[];
  multimodalData?: any;
  previewUrl?: string;
  authorName: string;
  createdAt: string;
  starred?: boolean;
}

export interface ResourceFolder {
  id: string;
  name: string;
  icon?: string;
  count?: number;
}

export interface MultimodalPreviewState {
  isOpen: boolean;
  type: "ppt" | "image" | "video" | "music" | "digital_human" | "3d_model" | "document";
  title: string;
  data?: any;
  subtitle?: string;
}

export interface AIToolConfig {
  id: string;
  name: string;
  description: string;
  subject: string;
  type: "question_generator" | "exam_review" | "difficulty_estimator" | "lesson_designer" | "student_diagnostic";
  icon: string;
}
