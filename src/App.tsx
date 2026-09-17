import React, { useState } from "react";
import {
  User,
  TeachingSkill,
  KnowledgeDocument,
  ModelGatewayConfig,
  CreditTransaction,
  QuickCommand,
  TeachingResourceItem,
  ResourceFolder,
  MultimodalPreviewState,
} from "./types";
import {
  INITIAL_USERS,
  INITIAL_SKILLS,
  INITIAL_KNOWLEDGE_DOCS,
  INITIAL_MODELS,
  INITIAL_TRANSACTIONS,
  INITIAL_QUICK_COMMANDS,
  INITIAL_RESOURCES,
  INITIAL_RESOURCE_FOLDERS,
} from "./mockData";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { LoginView } from "./components/pages/LoginView";
import { DashboardView } from "./components/pages/DashboardView";
import { AssistantView } from "./components/pages/AssistantView";
import { SkillsView } from "./components/pages/SkillsView";
import { StudioView } from "./components/pages/StudioView";
import { AdminView } from "./components/pages/AdminView";
import { FavoritesView } from "./components/pages/FavoritesView";
import { VisualizationView } from "./components/pages/VisualizationView";
import { GuideView } from "./components/pages/GuideView";
import { MultimodalPreviewModal } from "./components/modals/MultimodalPreviewModal";
import { QuickCommandModal } from "./components/modals/QuickCommandModal";
import { AIToolModal } from "./components/modals/AIToolModal";

export const App: React.FC = () => {
  // Authentication & Users state
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]); // Default to logged in as Zhang Mingyuan
  const [isLoggedOut, setIsLoggedOut] = useState<boolean>(false);

  // Core navigation state: "dashboard" | "assistant" | "skills" | "studio" | "admin"
  const [currentView, setCurrentView] = useState<string>("dashboard");

  // Sidebar collapse state
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Cross-page navigation parameters
  const [assistantParams, setAssistantParams] = useState<{
    skillId?: string;
    prompt?: string;
  }>({});

  const [studioParams, setStudioParams] = useState<{
    tab: string;
    prompt?: string;
  }>({ tab: "ppt" });

  // Skills state
  const [allSkills, setAllSkills] = useState<TeachingSkill[]>(INITIAL_SKILLS);

  // Knowledge docs state
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDocument[]>(INITIAL_KNOWLEDGE_DOCS);

  // Models Gateway state
  const [models] = useState<ModelGatewayConfig[]>(INITIAL_MODELS);

  // Transactions state
  const [transactions, setTransactions] = useState<CreditTransaction[]>(INITIAL_TRANSACTIONS);

  // Quick commands state
  const [quickCommands, setQuickCommands] = useState<QuickCommand[]>(INITIAL_QUICK_COMMANDS);
  const [isQuickCommandModalOpen, setIsQuickCommandModalOpen] = useState(false);

  // Teaching Resources / Favorites state
  const [resources, setResources] = useState<TeachingResourceItem[]>(INITIAL_RESOURCES);
  const [resourceFolders] = useState<ResourceFolder[]>(INITIAL_RESOURCE_FOLDERS);

  // Multimodal Preview Modal State
  const [previewState, setPreviewState] = useState<MultimodalPreviewState>({
    isOpen: false,
    type: "ppt",
    title: "",
  });

  // AI Tool Modal State
  const [isAIToolModalOpen, setIsAIToolModalOpen] = useState(false);

  // Handlers for resources
  const handleSaveResource = (resource: TeachingResourceItem) => {
    setResources((prev) => {
      const exists = prev.some((r) => r.id === resource.id);
      if (exists) {
        return prev.map((r) => (r.id === resource.id ? resource : r));
      }
      return [resource, ...prev];
    });
  };

  const handleDeleteResource = (resourceId: string) => {
    setResources((prev) => prev.filter((r) => r.id !== resourceId));
  };

  const handleToggleStarResource = (resourceId: string) => {
    setResources((prev) =>
      prev.map((r) => (r.id === resourceId ? { ...r, starred: !r.starred } : r))
    );
  };

  const handleOpenPreview = (state: MultimodalPreviewState) => {
    setPreviewState(state);
  };

  // Deduct credits handler
  const handleDeductCredits = (amount: number) => {
    if (!currentUser) return;
    setCurrentUser((prev) =>
      prev ? { ...prev, creditBalance: Math.max(0, prev.creditBalance - amount) } : null
    );
    setAllUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id
          ? { ...u, creditBalance: Math.max(0, u.creditBalance - amount) }
          : u
      )
    );

    // Record transaction
    const newTx: CreditTransaction = {
      id: `tx-${Date.now()}`,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      amount: -amount,
      type: currentView === "studio" ? "creation" : "chat",
      detail: `${currentView === "studio" ? "AI创作生成" : "智能备课助手对话"}扣除积分`,
      createdAt: new Date().toISOString().replace("T", " ").slice(0, 16),
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Switch User (Demo role switching)
  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
    setIsLoggedOut(false);
  };

  // Add new Skill
  const handleAddSkill = (newSkill: TeachingSkill) => {
    setAllSkills((prev) => [newSkill, ...prev]);
  };

  // Delete Skill
  const handleDeleteSkill = (skillId: string) => {
    setAllSkills((prev) => prev.filter((s) => s.id !== skillId));
  };

  // Approve Skill (Admin)
  const handleApproveSkill = (skillId: string) => {
    setAllSkills((prev) =>
      prev.map((s) =>
        s.id === skillId
          ? { ...s, status: "published", scope: "public", isOfficial: true }
          : s
      )
    );
  };

  // Reject Skill (Admin)
  const handleRejectSkill = (skillId: string, reason: string) => {
    setAllSkills((prev) =>
      prev.map((s) =>
        s.id === skillId
          ? { ...s, status: "rejected", description: `${s.description} (退回原因：${reason})` }
          : s
      )
    );
  };

  // Update user quota (Admin)
  const handleUpdateUserQuota = (userId: string, addedCredits: number) => {
    setAllUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, creditBalance: u.creditBalance + addedCredits }
          : u
      )
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) =>
        prev ? { ...prev, creditBalance: prev.creditBalance + addedCredits } : null
      );
    }

    const targetUser = allUsers.find((u) => u.id === userId);
    const newTx: CreditTransaction = {
      id: `tx-${Date.now()}`,
      teacherId: userId,
      teacherName: targetUser?.name || "未知教师",
      amount: addedCredits,
      type: "admin_grant",
      detail: "校级管理员批量划拨教研教学额度",
      createdAt: new Date().toISOString().replace("T", " ").slice(0, 16),
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Add knowledge doc (Admin)
  const handleAddKnowledgeDoc = (doc: KnowledgeDocument) => {
    setKnowledgeDocs((prev) => [doc, ...prev]);
  };

  // Dashboard navigate adapter
  const handleDashboardNavigate = (view: string, extraParams?: any) => {
    if (view === "assistant") {
      if (extraParams?.initialPrompt) {
        setAssistantParams({ prompt: extraParams.initialPrompt });
      } else if (extraParams?.skillId) {
        setAssistantParams({ skillId: extraParams.skillId });
      }
    } else if (view === "studio") {
      if (extraParams?.studioTab) {
        setStudioParams({ tab: extraParams.studioTab });
      }
    }
    setCurrentView(view);
  };

  // If user clicked logout or no user
  if (isLoggedOut || !currentUser) {
    return (
      <LoginView
        availableUsers={allUsers}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsLoggedOut(false);
          setCurrentView("dashboard");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Global Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        allUsers={allUsers}
        activeView={currentView}
        onNavigate={setCurrentView}
        onSwitchUser={handleSwitchUser}
        onLogout={() => setIsLoggedOut(true)}
      />

      {/* 2. Main Body with Sidebar + View */}
      <div className="flex-1 flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar Navigation */}
        <Sidebar
          activeView={currentView}
          currentUser={currentUser}
          onNavigate={setCurrentView}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* View Canvas Area */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          {/* Dashboard View */}
          {currentView === "dashboard" && (
            <DashboardView
              currentUser={currentUser}
              onNavigate={handleDashboardNavigate}
              publicSkills={allSkills.filter((s) => s.scope === "public" || s.isOfficial)}
              onOpenAITools={() => setIsAIToolModalOpen(true)}
              onOpenQuickCommands={() => setIsQuickCommandModalOpen(true)}
            />
          )}

          {/* Assistant View */}
          {currentView === "assistant" && (
            <AssistantView
              currentUser={currentUser}
              allSkills={allSkills}
              activeSkillId={assistantParams.skillId}
              initialPrompt={assistantParams.prompt}
              onNavigateToStudio={({ studioTab, prompt }) => {
                setStudioParams({ tab: studioTab, prompt });
                setCurrentView("studio");
              }}
              onDeductCredits={handleDeductCredits}
              quickCommands={quickCommands}
              onOpenQuickCommandConfig={() => setIsQuickCommandModalOpen(true)}
              onOpenAITools={() => setIsAIToolModalOpen(true)}
              onOpenPreview={handleOpenPreview}
              onSaveToFavorites={handleSaveResource}
            />
          )}

          {/* Skills View */}
          {currentView === "skills" && (
            <SkillsView
              currentUser={currentUser}
              allSkills={allSkills}
              onAddSkill={handleAddSkill}
              onUseSkill={(skill) => {
                setAssistantParams({ skillId: skill.id });
                setCurrentView("assistant");
              }}
              onDeleteSkill={handleDeleteSkill}
            />
          )}

          {/* Studio View */}
          {currentView === "studio" && (
            <StudioView
              currentUser={currentUser}
              initialTab={studioParams.tab}
              initialPrompt={studioParams.prompt}
              onDeductCredits={handleDeductCredits}
              onOpenPreview={handleOpenPreview}
              onSaveToFavorites={handleSaveResource}
            />
          )}

          {/* Favorites / Teaching Resources View */}
          {currentView === "favorites" && (
            <FavoritesView
              currentUser={currentUser}
              resources={resources}
              folders={resourceFolders}
              onAddResource={handleSaveResource}
              onDeleteResource={handleDeleteResource}
              onToggleStarResource={handleToggleStarResource}
              onOpenPreview={handleOpenPreview}
              onNavigateToAssistant={(prompt: string) => {
                setAssistantParams({ prompt });
                setCurrentView("assistant");
              }}
              onNavigateToStudio={(tab: string, prompt?: string) => {
                setStudioParams({ tab, prompt });
                setCurrentView("studio");
              }}
            />
          )}

          {/* Visualization / Teaching Research Data Dashboard */}
          {currentView === "visualization" && (
            <VisualizationView currentUser={currentUser} />
          )}

          {/* Guide / Manual and Prompt Dictionary View */}
          {currentView === "guide" && (
            <GuideView
              onSendToAssistant={(prompt: string) => {
                setAssistantParams({ prompt });
                setCurrentView("assistant");
              }}
              onGoToStudio={(tab?: string) => {
                if (tab) setStudioParams({ tab });
                setCurrentView("studio");
              }}
            />
          )}

          {/* Admin View */}
          {currentView === "admin" && (
            <AdminView
              currentUser={currentUser}
              allUsers={allUsers}
              allSkills={allSkills}
              knowledgeDocs={knowledgeDocs}
              models={models}
              transactions={transactions}
              onApproveSkill={handleApproveSkill}
              onRejectSkill={handleRejectSkill}
              onUpdateUserQuota={handleUpdateUserQuota}
              onAddKnowledgeDoc={handleAddKnowledgeDoc}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      {/* 1. Multimodal Preview Modal */}
      <MultimodalPreviewModal
        preview={previewState}
        onClose={() => setPreviewState((prev) => ({ ...prev, isOpen: false }))}
        onSendToAssistant={(content: string) => {
          setAssistantParams({ prompt: content });
          setCurrentView("assistant");
        }}
      />

      {/* 2. Quick Command Configuration Modal */}
      <QuickCommandModal
        isOpen={isQuickCommandModalOpen}
        onClose={() => setIsQuickCommandModalOpen(false)}
        commands={quickCommands}
        onSaveCommands={setQuickCommands}
        onSelectCommand={(cmd) => {
          setAssistantParams({ prompt: cmd.promptTemplate });
          setCurrentView("assistant");
        }}
      />

      {/* 3. AI Specialized Tool Modal */}
      <AIToolModal
        isOpen={isAIToolModalOpen}
        onClose={() => setIsAIToolModalOpen(false)}
        currentUser={currentUser}
        onAddFavorite={handleSaveResource}
        onOpenInAssistant={(prompt: string) => {
          setAssistantParams({ prompt });
          setCurrentView("assistant");
        }}
      />
    </div>
  );
};
export default App;
