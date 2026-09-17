import {
  User,
  TeachingSkill,
  KnowledgeDocument,
  ModelGatewayConfig,
  CreditTransaction,
  QuickCommand,
  TeachingResourceItem,
  ResourceFolder,
} from "./types";

export const INITIAL_USERS: User[] = [
  {
    id: "user-zhang",
    name: "张明远",
    employeeNo: "XF20230104",
    subject: "高中语文",
    department: "高二年级语文教研组",
    role: "teacher",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
    creditBalance: 1280,
    creditMonthlyQuota: 2000,
    status: "active",
    lastLoginAt: "今天 08:30",
  },
  {
    id: "user-li",
    name: "李华峰",
    employeeNo: "XF20180023",
    subject: "高中数学",
    department: "高三年级数学教研组长",
    role: "lead",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
    creditBalance: 2450,
    creditMonthlyQuota: 3000,
    status: "active",
    lastLoginAt: "今天 09:12",
  },
  {
    id: "user-wang",
    name: "王绍元",
    employeeNo: "XF20150002",
    subject: "信息科技",
    department: "智慧教育发展中心（校管理员）",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    creditBalance: 9999,
    creditMonthlyQuota: 10000,
    status: "active",
    lastLoginAt: "今天 10:05",
  },
  {
    id: "user-chen",
    name: "陈晓敏",
    employeeNo: "XF20210088",
    subject: "高中英语",
    department: "高一年级英语组",
    role: "teacher",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80",
    creditBalance: 860,
    creditMonthlyQuota: 2000,
    status: "active",
    lastLoginAt: "昨天 17:40",
  },
  {
    id: "user-zhao",
    name: "赵鹏",
    employeeNo: "XF20190045",
    subject: "高中物理",
    department: "高三年级物理组",
    role: "teacher",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=160&q=80",
    creditBalance: 160,
    creditMonthlyQuota: 2000,
    status: "active",
    lastLoginAt: "3天前",
  },
];

export const INITIAL_SKILLS: TeachingSkill[] = [
  {
    id: "gaokao-math-exam",
    name: "高考数学压轴命题助手",
    description: "依据新高考Ⅰ卷评价体系，结合解析几何与导数考查维度，生成结构化大题与评分标准。",
    icon: "Calculator",
    subject: "数学",
    category: "命题",
    scope: "public",
    status: "published",
    authorName: "西附两江数学组·官方",
    authorId: "school-official",
    isOfficial: true,
    rating: 4.9,
    usageCount: 2380,
    promptTemplate: "请作为西附两江资深高三数学命题教师，围绕【考点】命制一道难度系数约 0.55 的解答题，含双重变式与详细得分要点。",
    outputFormat: "题目文本 + 意图分析 + 参考答案 + 评分细则",
    kbScope: "历年新高考试题库",
    createdAt: "2026-03-01",
  },
  {
    id: "exam-review",
    name: "期中试卷智能审题与查重",
    description: "多维排查试卷题干严谨度、考查科学性、文字歧义与超纲知识点，并预估答题时长与均分。",
    icon: "FileCheck",
    subject: "综合",
    category: "审题",
    scope: "public",
    status: "published",
    authorName: "教学督导处·官方",
    authorId: "school-official",
    isOfficial: true,
    rating: 4.8,
    usageCount: 1840,
    promptTemplate: "请对以下输入的试卷试题进行三审三校排查，标注出易引起误解的语言表述、参数范围遗漏及分值设置不均问题。",
    outputFormat: "诊断清单 + 优化建议 + 难度预估",
    kbScope: "课程标准与审题规范",
    createdAt: "2026-02-15",
  },
  {
    id: "lesson-plan",
    name: "大单元新授课教案生成器",
    description: "以情境任务为驱动，输出教学重难点、核心问题链、学生活动、分层作业与板书结构设计。",
    icon: "BookOpen",
    subject: "语文",
    category: "教案",
    scope: "public",
    status: "published",
    authorName: "西附两江语文组·官方",
    authorId: "school-official",
    isOfficial: true,
    rating: 4.9,
    usageCount: 3120,
    promptTemplate: "请按照西附两江五步教学法，为高中【课题】生成一节完整的包含三维素养与生涯思考的单元教学设计。",
    outputFormat: "教学目标 + 驱动任务 + 板书框架 + 分层练习",
    kbScope: "部编版高中教材全集",
    createdAt: "2026-01-20",
  },
  {
    id: "essay-grading",
    name: "新高考任务驱动型作文精批",
    description: "依据高考作文发展等级量表，从立意深度、论证逻辑、修辞文采、字数书写多维度生成详细批语与升格范文。",
    icon: "PenTool",
    subject: "语文",
    category: "批改",
    scope: "public",
    status: "published",
    authorName: "张明远 老师",
    authorId: "user-zhang",
    isOfficial: false,
    rating: 4.7,
    usageCount: 950,
    promptTemplate: "请对以下学生作文进行高考赋分与维度切片评价，指出论证软肋并给出 200 字名校风格升格指导。",
    outputFormat: "得分评估 + 亮点短评 + 升格点拨",
    createdAt: "2026-04-10",
  },
  {
    id: "physics-experiment",
    name: "高中物理数字化探究实验设计",
    description: "设计基于传感器与微课情境的物理实验探究案，提供实验器材清单、误差分析与数据处理表。",
    icon: "Atom",
    subject: "物理",
    category: "教案",
    scope: "dept",
    status: "pending",
    authorName: "赵鹏 老师",
    authorId: "user-zhao",
    isOfficial: false,
    rating: 4.6,
    usageCount: 420,
    promptTemplate: "设计探究加速度与物体受力质量关系的拓展实验方案，结合高中物理创新教具进行微视频剧本编制。",
    outputFormat: "实验流程 + 误差预警 + 探究问题链",
    createdAt: "2026-05-02",
  },
  {
    id: "english-cloze",
    name: "高考英语语法填空语篇改写",
    description: "将新闻时事或科技外刊文本自适应降级至高考课标 3500 词，智能设空并生成语法考点考查说明。",
    icon: "Languages",
    subject: "英语",
    category: "命题",
    scope: "private",
    status: "draft",
    authorName: "陈晓敏 老师",
    authorId: "user-chen",
    isOfficial: false,
    rating: 4.5,
    usageCount: 160,
    promptTemplate: "将以下外刊材料改写为 200 词左右适合高三模考的完形填空试题，考点覆盖动词时态、非谓语、从句引导词等。",
    outputFormat: "改编试题 + 挖空解析 + 语法点清单",
    createdAt: "2026-05-18",
  },
];

export const INITIAL_KNOWLEDGE_DOCS: KnowledgeDocument[] = [
  {
    id: "kb-01",
    name: "西附两江高中新课程一体化教研导学大纲（2025-2026学年）.pdf",
    subject: "教学教研",
    type: "教学大纲",
    fileSize: "14.2 MB",
    chunkCount: 342,
    status: "parsed",
    updatedAt: "2026-09-01",
    scope: "全校公开",
  },
  {
    id: "kb-02",
    name: "2023-2026新高考全国Ⅰ卷全科真题及官方命题立意报告.docx",
    subject: "综合题库",
    type: "高考真题",
    fileSize: "28.5 MB",
    chunkCount: 890,
    status: "parsed",
    updatedAt: "2026-07-15",
    scope: "高中教师专享",
  },
  {
    id: "kb-03",
    name: "高中语文必修上/下册统编教材核心单元课件与教学目标.pdf",
    subject: "语文",
    type: "教材",
    fileSize: "45.1 MB",
    chunkCount: 1250,
    status: "parsed",
    updatedAt: "2026-08-20",
    scope: "语文教研组",
  },
  {
    id: "kb-04",
    name: "西附两江校本“生涯教育”融入学科课堂实施手册.pdf",
    subject: "校本特色",
    type: "校本资料",
    fileSize: "8.6 MB",
    chunkCount: 180,
    status: "parsed",
    updatedAt: "2026-04-12",
    scope: "全校公开",
  },
  {
    id: "kb-05",
    name: "高三一轮复习理科综合重难点错因归纳与变式训练集.docx",
    subject: "理科综合",
    type: "微专题",
    fileSize: "18.3 MB",
    chunkCount: 512,
    status: "parsed",
    updatedAt: "2026-09-08",
    scope: "高三年级理科组",
  },
];

export const INITIAL_MODELS: ModelGatewayConfig[] = [
  {
    id: "m-deepseek",
    name: "DeepSeek-V3",
    provider: "DeepSeek 官方通道",
    multiplier: 1.0,
    status: "active",
    latency: "680ms",
    successRate: "99.8%",
    isDefault: true,
  },
  {
    id: "m-qwen",
    name: "通义千问 2.5 Max",
    provider: "阿里云教育专区",
    multiplier: 1.2,
    status: "active",
    latency: "750ms",
    successRate: "99.6%",
  },
  {
    id: "m-gpt4o",
    name: "GPT-4o-Edu",
    provider: "微软 Azure 校园合规专线",
    multiplier: 2.0,
    status: "active",
    latency: "920ms",
    successRate: "99.4%",
  },
  {
    id: "m-gemini",
    name: "Gemini 2.5 Flash",
    provider: "Google Cloud AI",
    multiplier: 1.0,
    status: "active",
    latency: "520ms",
    successRate: "99.9%",
  },
];

export const INITIAL_TRANSACTIONS: CreditTransaction[] = [
  {
    id: "tx-1",
    teacherName: "张明远",
    amount: -15,
    type: "creation",
    detail: "生成《蜀道难》意境微课多媒体 PPT",
    createdAt: "10分钟前",
  },
  {
    id: "tx-2",
    teacherName: "李华峰",
    amount: -10,
    type: "skill_call",
    detail: "调用【高考数学压轴命题助手】命制解答题",
    createdAt: "半小时前",
  },
  {
    id: "tx-3",
    teacherName: "赵鹏",
    amount: -25,
    type: "creation",
    detail: "AI 创作中心生成【牛顿第二定律实验演示视频】",
    createdAt: "1小时前",
  },
  {
    id: "tx-4",
    teacherName: "系统管理员",
    amount: +2000,
    type: "admin_grant",
    detail: "全校高三备考教师月度激励积分批量划拨",
    createdAt: "今天 08:00",
  },
  {
    id: "tx-5",
    teacherName: "陈晓敏",
    amount: -8,
    type: "chat",
    detail: "AI 助手对话：高一英语课外阅读篇目智能分级",
    createdAt: "昨天 16:20",
  },
];

// ==================== 快捷指令配置数据 ====================
export const INITIAL_QUICK_COMMANDS: QuickCommand[] = [
  {
    id: "cmd-mingti",
    command: "/命题",
    label: "新高考命题与变式",
    description: "依据新高考评价体系命制大题，含母题、双变式及评分细则",
    icon: "FilePenLine",
    category: "命题审题",
    isSystem: true,
    enabled: true,
    hotkey: "Alt+1",
    promptTemplate:
      "请作为西附两江高三学科命题专家，围绕知识点【${考点}】命制一道新高考解答题。要求：1. 指明核心素养与命题意图；2. 题目题干情境真实严谨；3. 提供详细解题步骤与评分细则；4. 附一道同考点拓展变式题。",
  },
  {
    id: "cmd-shenti",
    command: "/审题",
    label: "试卷全维严谨性排查",
    description: "多维诊断题设科学性、表述歧义、超纲风险与预估难度系数",
    icon: "FileCheck2",
    category: "命题审题",
    isSystem: true,
    enabled: true,
    hotkey: "Alt+2",
    promptTemplate:
      "请对以下试题进行全维度智能审题：\n【试题内容】：${试题}\n请从以下4个维度输出诊断报告：\n1. 科学性与严谨性（有无概念漏洞或推导矛盾）\n2. 表述规范与语言歧义排查\n3. 新高考考纲对标与预估难度系数（0.1~1.0）\n4. 针对性修改与润色建议。",
  },
  {
    id: "cmd-bianshi",
    command: "/变式",
    label: "母题多维衍生变式",
    description: "根据给定母题生成梯级变式题（条件弱化、逆向反求、情境拓展）",
    icon: "GitFork",
    category: "命题审题",
    isSystem: false,
    enabled: true,
    hotkey: "Alt+3",
    promptTemplate:
      "基于以下母题生成 2 道梯度变式题：\n【母题】：${输入母题}\n要求：\n- 变式 1（夯实通法）：弱化条件或改变数据模型，考查基本迁移能力；\n- 变式 2（培优拓展）：采用逆向思维或跨知识点综合，适合作为压轴训练。\n每道题附带简要解答及思路提示。",
  },
  {
    id: "cmd-jiexi",
    command: "/解析",
    label: "深度学法通解剖析",
    description: "生成思路破题点、通性通法、一题多解及学生高频错因剖析",
    icon: "Sparkles",
    category: "教学设计",
    isSystem: true,
    enabled: true,
    hotkey: "Alt+4",
    promptTemplate:
      "请为以下题目撰写一份深度学法解析方案：\n【试题】：${试题}\n包含模块：\n1. 审题眼与破题突破口抓取\n2. 【法一·通性通法】详尽推导过程\n3. 【法二·巧解秒杀】几何直观或代数技巧\n4. 【名师警示】高三学生最易踩坑的 3 大典型错因归因与防范点拨。",
  },
  {
    id: "cmd-jiaoan",
    command: "/教案",
    label: "大单元任务驱动教案",
    description: "依据西附教学理念生成含育人素养、核心任务链的分层导学案",
    icon: "BookMarked",
    category: "教学设计",
    isSystem: true,
    enabled: true,
    hotkey: "Alt+5",
    promptTemplate:
      "请为高中课程【${课题}】设计一份 1 课时的大单元任务驱动型教学设计，遵循西附两江两案教学规范：\n1. 核心素养导向三维教学目标\n2. 真实情境引入与核心大问题链（任务一/任务二/任务三）\n3. 教学重难点突破路径及生生互动机制\n4. 板书设计结构提纲\n5. 分层课后作业（基础达标练+创新实践练）。",
  },
  {
    id: "cmd-xueqing",
    command: "/学情",
    label: "学情归因与分层对策",
    description: "分析试卷答题数据，定位班级知识盲区并输出差异化辅导方案",
    icon: "TrendingUp",
    category: "学情辅导",
    isSystem: false,
    enabled: true,
    promptTemplate:
      "根据本次测试【${考查模块/错题简述}】的学生答题情况，进行精准学情诊断：\n1. 错因分类诊断（概念模糊 / 逻辑不严 / 运算失误 / 答题格式不规范）；\n2. 薄弱知识点定位与知识图谱回扣建议；\n3. 分层跟进方案（基础层巩固任务、中等层思维进阶、卓越层压轴拓展）。",
  },
  {
    id: "cmd-runse",
    command: "/润色",
    label: "学术语言与格式精修",
    description: "规范数学公式LaTeX、标点、专业术语与学术用语表达",
    icon: "Wand2",
    category: "语言文本",
    isSystem: true,
    enabled: true,
    promptTemplate:
      "请对以下教研文本进行学术规范润色与格式排版升级：\n【待修文本】：${待修内容}\n要求：\n1. 修正所有语病、错别字及歧义用词；\n2. 规范所有数学公式及变量符号为标准 LaTeX 格式（例如 $f(x)$，向量 $\\vec{a}$）；\n3. 优化小标题逻辑编号与重点文字加粗标注，使排版赏心悦目、学术严谨。",
  },
];

// ==================== 资源收藏夹数据 ====================
export const INITIAL_RESOURCE_FOLDERS: ResourceFolder[] = [
  { id: "all", name: "全部收藏资源", icon: "FolderOpen", count: 6 },
  { id: "gaokao-math", name: "高三一轮·高考真题与变式", icon: "Bookmark", count: 2 },
  { id: "lesson-plans", name: "西附校本大单元教案", icon: "BookOpen", count: 1 },
  { id: "multimodal-assets", name: "多模态课件与微课素材", icon: "Palette", count: 2 },
  { id: "prompt-templates", name: "名师专属 Prompt 模板", icon: "Sparkles", count: 1 },
];

export const INITIAL_RESOURCES: TeachingResourceItem[] = [
  {
    id: "res-1",
    title: "【高考数学】圆锥曲线焦点弦综合题与双变式训练方案",
    type: "exam_question",
    folderId: "gaokao-math",
    folderName: "高三一轮·高考真题与变式",
    subject: "高中数学",
    grade: "高三年级",
    summary: "新高考解答题压轴试题，考查抛物线韦达定理设线消元与角平分线垂直对称性，附两道同构变式题与评分细则。",
    tags: ["新高考Ⅰ卷", "解析几何", "抛物线", "变式训练", "17分解答题"],
    authorName: "张明远",
    createdAt: "2026-09-15 14:30",
    starred: true,
    content: `### 【西附两江·高三数学专项命题】圆锥曲线综合题与变式探究

**【命题立意与核心素养】**
- 考查素养：数学抽象、直观想象、逻辑推理、数学运算。
- 关键能力：坐标法思想、代数化简能力与转化化归策略。

#### 试题正文（建议分值：17分）
已知抛物线 $C: y^2 = 2px (p > 0)$ 的焦点为 $F$，准线方程为 $x = -1$。
(1) 求抛物线 $C$ 的标准方程；（4分）
(2) 过点 $P(4, 0)$ 的直线 $l$ 与抛物线 $C$ 相交于 $A, B$ 两点，以 $AB$ 为直径的圆记为圆 $M$。
① 若直线 $l$ 经过焦点 $F$，求圆 $M$ 被 $y$ 轴截得的弦长；（6分）
② 设点 $Q(-2, 0)$，试证明：无论直线 $l$ 斜率如何变化，$\\angle AQB$ 的平分线始终垂直于 $x$ 轴。（7分）

#### 【参考解答与评分细则】
(1) 由准线 $x = -\\frac{p}{2} = -1$，解得 $p = 2$。故抛物线 $C$ 的标准方程为 $y^2 = 4x$。（4分）
(2) ① 当直线过焦点 $F(1, 0)$ 与点 $P(4, 0)$ 时，直线重合于 $x$ 轴，与准线垂直，结合弦长公式计算得截距为 $4\\sqrt{3}$。（10分）
② 设直线 $l: x = my + 4$，代入 $y^2 = 4x$ 得 $y^2 - 4my - 16 = 0$。由韦达定理 $y_1 + y_2 = 4m, y_1 y_2 = -16$。
计算斜率和：$k_{QA} + k_{QB} = \\frac{y_1}{x_1 + 2} + \\frac{y_2}{x_2 + 2} = 0$，故角平分线恒垂直于 $x$ 轴。（17分）`,
  },
  {
    id: "res-2",
    title: "【大单元教案】《蜀道难》意象建构与李白浪漫主义精神特质",
    type: "lesson_plan",
    folderId: "lesson-plans",
    folderName: "西附校本大单元教案",
    subject: "高中语文",
    grade: "高二年级",
    summary: "选择性必修经典篇目，融合西附生涯教育理念，任务群驱动式设计，含空间地势还原与分层课后探究。",
    tags: ["任务群驱动", "古典诗歌", "李白", "西附两案", "精品教案"],
    authorName: "张明远",
    createdAt: "2026-09-14 11:20",
    starred: true,
    content: `### 【西附两江·大单元教学设计方案】
**课题**：高二语文选择性必修《蜀道难》文本多维细读与意象建构
**课时**：2 课时 | **授课教师**：张老师

#### 一、教学目标（三维育人素养）
1. **语言建构与运用**：掌握奔放奇险的乐府诗歌体势，品味“扪参历井仰胁息”等动词的艺术张力。
2. **思维提升与审美创造**：探究浪漫主义与现实喟叹的交织，理解自然险阻与社会仕途坎坷的双重视角。
3. **文化传承与生涯启迪**：结合西附“生涯教育”，引导学生在逆境中树立笃行坚毅的人生观。

#### 二、核心任务群驱动
- **任务一：闻蜀道之奇**（诵读感知句式长短错落之节奏）
- **任务二：摹蜀道之险**（空间维度绘制“入蜀路线图”与五丁开山神话还原）
- **任务三：品蜀道之叹**（小组研讨“锦城虽云乐，不如早还家”的深层时代困境）`,
  },
  {
    id: "res-3",
    title: "【学术课件 PPT】高考圆锥曲线微专题突破与通法复习（共6页）",
    type: "ppt",
    folderId: "multimodal-assets",
    folderName: "多模态课件与微课素材",
    subject: "高中数学",
    grade: "高三年级",
    summary: "西附深蓝学术风格课件，含考纲脉络、核心模型提炼、母题精讲、变式探究、学情防错及分层训练。",
    tags: ["课件PPT", "西附深蓝", "解析几何", "微专题", "可投影"],
    authorName: "李华峰",
    createdAt: "2026-09-13 16:50",
    starred: true,
    multimodalData: {
      type: "ppt",
      theme: "西附深蓝学术",
      slidesCount: 6,
      slides: [
        {
          index: 1,
          title: "高考圆锥曲线微专题突破与通法复习",
          subtitle: "西南大学附属中学两江中学 · 高三年级第一轮复习备考",
          bullets: ["主讲教师：张明远", "备课组：高中数学教研室", "指导理念：夯实通性通法，提升高阶运算"],
        },
        {
          index: 2,
          title: "一、考纲考向与命题脉络梳理",
          subtitle: "近年来新高考命题规律与考查频次深度解析",
          bullets: [
            "历年新高考Ⅰ卷、Ⅱ卷考查维度横向比对（均分约 6.2/17 分）",
            "高频考点分类：焦点弦性质、定点定值问题、最值范围模型",
            "命题新趋势：破除机械套路，突出几何直观与算理逻辑协同",
          ],
        },
        {
          index: 3,
          title: "二、核心知识体系与典型模型建构",
          subtitle: "化繁为简：建立从几何图形到代数方程的严谨映射",
          bullets: [
            "“设而不求”通法核心：何时设点、何时设线（斜率不存在讨论）",
            "弦长公式巧变形：结合弦长与韦达定理的快速化简技巧",
            "几何特征代数化：角平分线、垂直、共线等条件的等价转化式",
          ],
        },
        {
          index: 4,
          title: "三、典例剖析与多维变式探究",
          subtitle: "一题多解与一题多变，拓宽解题视野与迁移敏锐度",
          bullets: [
            "【母题精讲】：2025新高考变式母题审题要诀与破题点抓取",
            "【变式一（条件弱化）】：若直线过定点变动，如何构建定值桥梁？",
            "【变式二（结论开放）】：探究对称轴与角平分线的本质同一性",
          ],
        },
        {
          index: 5,
          title: "四、学情诊断与高频错因归因分析",
          subtitle: "精准把脉：避免反复踩坑与无谓失分",
          bullets: [
            "错因一：判别式 $\\Delta > 0$ 遗漏，导致增根未予剔除（失2分）",
            "错因二：直线斜率不存在情况未单独列出讨论（失2分）",
            "错因三：答题卡书写步骤跳步严重，未能按关键踩分点得分",
          ],
        },
        {
          index: 6,
          title: "五、课堂小结与个性化分层作业",
          subtitle: "知行合一，巩固内化",
          bullets: [
            "知识框架脑图回扣：通性通法是通往高分的唯一直径",
            "必做作业（全员）：完成校本导学案 P82-P84 基础达标练 1~4 题",
            "选做作业（培优）：探究二次曲线仿射变换视角下的焦点弦定理",
          ],
        },
      ],
    },
    content: "圆锥曲线微专题6页课件PPT，已完整适配多模态演播器与投影全屏模式。",
  },
  {
    id: "res-4",
    title: "【科学教学插画】高中生物·叶绿体微观亚显微结构解析图",
    type: "multimodal",
    folderId: "multimodal-assets",
    folderName: "多模态课件与微课素材",
    subject: "高中生物",
    grade: "高一年级",
    summary: "16:9 比例板书手绘与科学解剖插图，高清标注外膜、内膜、基粒与类囊体垛叠结构。",
    tags: ["教学插画", "细胞亚显微结构", "板书配图", "科学绘图"],
    authorName: "赵鹏",
    createdAt: "2026-09-12 10:15",
    starred: false,
    multimodalData: {
      type: "image",
      imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
      ratio: "16:9",
      style: "西附黑板板书手绘与科学插图风",
      annotationCount: 6,
    },
    content: "高清教学板书插画，可直接插入课件、导学案或投屏讲解。",
  },
  {
    id: "res-5",
    title: "【名师专属 Prompt】新高考跨学科情境命题标准模板",
    type: "prompt",
    folderId: "prompt-templates",
    folderName: "名师专属 Prompt 模板",
    subject: "综合学科",
    grade: "高中全学段",
    summary: "西附两江教研组提炼的高考新情境命题提示词，精准激发AI生成航天、芯片、生态等真实情境题。",
    tags: ["提示词模板", "新情境", "跨学科", "命题技巧", "必藏"],
    authorName: "李华峰",
    createdAt: "2026-09-10 15:40",
    starred: true,
    content: `角色：你拥有20年新高考国家级命题与审题经验，是西南大学附属中学两江中学的学科带头人。
任务：请根据【最新科技前沿/时代背景，例如：中国空间站梦天实验舱低温物理实验/重庆两江新区新能源汽车产业升级】，设计一道考查【具体学科核心知识点】的原创综合题。
要求：
1. 【情境铺垫】：文字简练生动，数据与物理/化学原理高度符合客观事实，情境文字控制在120字内；
2. 【设问梯度】：第(1)问立足基本通法；第(2)问引入变量制约与高阶逻辑；第(3)问具备开放探究特征；
3. 【评分规程】：给出采分点、关键公式分值与典型错误扣分细则。`,
  },
  {
    id: "res-6",
    title: "【学情诊断量表】高三摸底考试代数运算易错点归因矩阵",
    type: "diagnostic",
    folderId: "gaokao-math",
    folderName: "高三一轮·高考真题与变式",
    subject: "高中数学",
    grade: "高三年级",
    summary: "涵盖9类高频运算失分陷阱的结构化量表，支持一键针对性生成补偿性变式微练习题单。",
    tags: ["学情诊断", "错因归因", "补偿练习", "精准教学"],
    authorName: "张明远",
    createdAt: "2026-09-08 09:10",
    starred: false,
    content: `### 西附两江高三数学学情诊断矩阵与补偿方案
- **薄弱点 1**：韦达定理符号颠倒（失分率 28.4%）-> 补偿策略：强化设线方程 $x = my + n$ 标准形，固化对称式公式套路；
- **薄弱点 2**：点到直线距离公式根号化简失误（失分率 19.2%）-> 补偿策略：安排 5 分钟课前限时小练；
- **薄弱点 3**：忽略参数取值范围与几何位置隐含约束（失分率 34.6%）-> 补偿策略：引导作图数形结合。`,
  },
];

// ==================== 教研数据可视化数据 ====================
export const VISUALIZATION_DATA = {
  overviewMetrics: {
    weeklyAiAssistedHours: 1420,
    generatedQuestionsTotal: 8460,
    multimodalAssetsCount: 3120,
    knowledgeChunksIndexed: 14890,
    averageTeacherSatisfaction: 98.4,
    monthlyCreditUsage: 184500,
  },
  subjectAdoption: [
    { subject: "数学", count: 3240, percentage: 38, activeTeachers: 24, growth: "+18%" },
    { subject: "语文", count: 2160, percentage: 25, activeTeachers: 21, growth: "+14%" },
    { subject: "英语", count: 1480, percentage: 17, activeTeachers: 18, growth: "+12%" },
    { subject: "物理", count: 980, percentage: 11, activeTeachers: 12, growth: "+22%" },
    { subject: "化学", count: 620, percentage: 7, activeTeachers: 9, growth: "+9%" },
    { subject: "生物/其他", count: 180, percentage: 2, activeTeachers: 8, growth: "+15%" },
  ],
  difficultyDistribution: [
    { range: "0.20-0.35 (极高压轴)", actualPct: 12, targetPct: 10, label: "拔尖压轴" },
    { range: "0.35-0.55 (中高难度)", actualPct: 34, targetPct: 35, label: "核心区分" },
    { range: "0.55-0.75 (中等基础)", actualPct: 42, targetPct: 40, label: "通性通法" },
    { range: "0.75-0.95 (基础送分)", actualPct: 12, targetPct: 15, label: "基础达标" },
  ],
  weeklyCreationTrend: [
    { week: "第1周", questions: 620, ppts: 140, lessonPlans: 95 },
    { week: "第2周", questions: 890, ppts: 210, lessonPlans: 130 },
    { week: "第3周", questions: 1250, ppts: 310, lessonPlans: 180 },
    { week: "第4周", questions: 1580, ppts: 440, lessonPlans: 240 },
    { week: "第5周", questions: 1980, ppts: 520, lessonPlans: 290 },
    { week: "第6周(本周)", questions: 2140, ppts: 580, lessonPlans: 340 },
  ],
  knowledgeRadar: [
    { dimension: "解析几何与代数消元", score: 94, benchmark: 85 },
    { dimension: "导数单调性与零点讨论", score: 91, benchmark: 80 },
    { dimension: "立体几何空间向量", score: 88, benchmark: 82 },
    { dimension: "概率统计与分布列", score: 85, benchmark: 78 },
    { dimension: "函数性质与零点模型", score: 96, benchmark: 88 },
    { dimension: "数列通项与错位相减", score: 87, benchmark: 84 },
  ],
  topTeacherContributors: [
    { rank: 1, name: "张明远", subject: "高中语文", contributions: 342, department: "高二年级组" },
    { rank: 2, name: "李华峰", subject: "高中数学", contributions: 318, department: "高三年级组" },
    { rank: 3, name: "赵鹏", subject: "高中物理", contributions: 276, department: "高三年级组" },
    { rank: 4, name: "陈晓敏", subject: "高中英语", contributions: 215, department: "高一年级组" },
    { rank: 5, name: "刘建国", subject: "高中化学", contributions: 189, department: "高二年级组" },
  ],
};

// ==================== 教师使用指南与手册数据 ====================
export const TEACHER_GUIDE_SECTIONS = [
  {
    id: "quickstart",
    title: "新教师 3 分钟极速上手指南",
    icon: "Rocket",
    badge: "新手必读",
    summary: "带您在 3 分钟内完成从输入教学想法到生成一份带评分细则的高考大题与配套微课 PPT。",
    steps: [
      {
        step: 1,
        title: "选择或唤醒 AI 助手",
        detail: "在顶部或侧边栏点击「AI 助手」，您可在输入框内直接输入日常教学自然语言指令，或输入快捷指令如「/命题」。",
      },
      {
        step: 2,
        title: "挂载校本知识库与专属 Skill",
        detail: "点击输入框右侧的「校本知识库」按钮与「Skill 技能选择器」，即可精准调用西附两江官方审题/命题标准规范。",
      },
      {
        step: 3,
        title: "一键转入多模态创作或加入收藏",
        detail: "生成满意的试卷或教案后，点击产出卡片下方的「一键转入 PPT 创作中心」或「收藏到教研资源库」，即刻复用于课堂与研讨。",
      },
    ],
  },
  {
    id: "prompts",
    title: "西附两江优秀 Prompt 提示词工程手册",
    icon: "Sparkles",
    badge: "学科精编",
    summary: "由校教学督导处与各教研组长联合沉淀的高中各学科高转化率提示词模板，支持一键复制与即刻测试。",
    categories: [
      {
        name: "高考数学专项",
        items: [
          {
            title: "解析几何母题同构与递进变式",
            prompt: "请以‘过抛物线焦点弦与圆的交点问题’为母题，生成一道难度系数0.58的新高考解答题，附双梯度变式及得分要点。",
            tag: "压轴题",
          },
          {
            title: "函数导数多参零点分类讨论通法",
            prompt: "针对高三学生对‘导数含参单调性讨论易漏区间’的痛点，命制一道三小问梯度试题，并给出通性通法解剖思路。",
            tag: "通法剖析",
          },
        ],
      },
      {
        name: "高中语文专项",
        items: [
          {
            title: "新高考任务驱动型作文命题与写作量表",
            prompt: "以‘两江新区智能制造产业崛起与青年生涯规划’为现实情境，设计一道新高考任务驱动型材料作文，含审题立意指引与评价量规。",
            tag: "任务写作",
          },
          {
            title: "文言文跨篇目对比细读与词法串讲",
            prompt: "对比《过秦论》与《六国论》中的政论文行文论证逻辑，生成 1 课时的大单元导学研讨问题链与思维导图提纲。",
            tag: "大单元",
          },
        ],
      },
      {
        name: "高中英语专项",
        items: [
          {
            title: "读后续写情境线索铺陈与协同微写作",
            prompt: "提供一段 300 词关于‘中学生跨文化青年志愿者经历’的读后续写前文，生成 2 个关键续写线索段落、高频情感形容词库及范文。",
            tag: "读后续写",
          },
        ],
      },
    ],
  },
  {
    id: "skill-specs",
    title: "Skill 技能编排与校本发布规范",
    icon: "FileCode2",
    badge: "教研进阶",
    summary: "了解如何将自己的个性化命题心得封装成自动化 Skill，并通过备课组长与校级管理员审核共享给全校。",
    rules: [
      {
        title: "明确的角色定义 (Role & Persona)",
        desc: "在提示词模板开头必须指明专家角色、学段与学科背景，例如‘你拥有15年新高考评价命题经验...’",
      },
      {
        title: "结构化输入槽位 (Placeholders)",
        desc: "使用规范的占位符如【${考点}】、【${年级}】、【${难度系数}】，方便同组教师按需动态填入参数。",
      },
      {
        title: "输出规范与西附学术格式 (Output Formatting)",
        desc: "强制要求包含‘命题意图’、‘试题呈现’、‘评分细则’三个模块，数学物理公式必须以 LaTeX 格式包裹。",
      },
    ],
  },
  {
    id: "faq",
    title: "常见使用问题与积分规则 FAQ",
    icon: "HelpCircle",
    badge: "使用答疑",
    summary: "为您解答额度扣减、多模型通道选型、知识库命中原理及资源导出权限等高频疑问。",
    faqs: [
      {
        q: "全校教师的积分额度是如何发放与扣减的？",
        a: "每位专任教师每月初由系统自动划拨 2000~3000 基础教研积分；普通 AI 对话每次消耗 5~10 积分，多模态 PPT 课件生成消耗 15 积分，微课视频生成消耗 25 积分。备课组长或校管理员可随时在后台批量追加专项额度。",
      },
      {
        q: "DeepSeek-V3 与 通义千问、GPT-4o-Edu、Gemini 在教学中有何选型建议？",
        a: "高考理科命题、数学推演推荐优先选用 DeepSeek-V3；文科大单元教学设计、多语言写作推荐选用通义千问或 GPT-4o-Edu；多模态课件提纲与图片建议选用 Gemini。",
      },
      {
        q: "校本知识库是如何参与我的备课生成的？",
        a: "开启‘校本知识库’开关后，系统采用语义向量切片技术，在后台自动检索西附两江校本教学大纲及近年真题，并在回答右侧清晰标注引用来源与契合度。",
      },
    ],
  },
];
