export type Role = "teacher" | "lead" | "admin";

export interface Teacher {
  id: string;
  name: string;
  employeeNo: string;
  subject: string;
  department: string;
  role: Role;
  status: "active" | "disabled";
  password: string;
  creditBalance: number;
  creditMonthlyQuota: number;
  lastLoginAt: string;
  avatarColor: string;
}

export interface SkillItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  subject: string;
  type: "命题" | "审题" | "教案" | "批改" | "其他";
  scope: "public" | "private";
  status: "draft" | "pending" | "published" | "rejected";
  ownerName: string;
  usageCount: number;
  rating: number;
  official: boolean;
  promptTemplate: string;
}

export interface KnowledgeDoc {
  id: string;
  name: string;
  subject: string;
  type: string;
  chunks: number;
  updatedAt: string;
  visibility: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: number;
  invokedSkillId?: string;
  citedDocIds?: string[];
  tokens?: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
  pinned?: boolean;
}

export interface CreationTask {
  id: string;
  type: "image" | "ppt" | "video" | "music" | "avatar" | "3d";
  title: string;
  status: "pending" | "running" | "succeeded" | "failed";
  createdAt: number;
  creditCost: number;
  thumbnail?: string;
}

export interface CreditTransaction {
  id: string;
  userName: string;
  change: number;
  reason: string;
  createdAt: string;
}

export interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  creditMultiplier: number;
  status: "enabled" | "disabled";
  successRate: number;
  latencyMs: number;
}
