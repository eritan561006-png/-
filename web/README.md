# 两江中学智能教育助手 · 高保真原型

西南大学附属中学两江中学「智能教育助手」教师端 + 管理员后台的高保真可交互前端原型。

对应设计提示词见 [`../docs/智能教育助手-开发提示词.md`](../docs/智能教育助手-开发提示词.md)。

## 这是什么

这是一个**前端原型**，覆盖了第一版规划的 6 个核心界面：

1. 登录页
2. 教师 AI 工作台（首页）
3. AI 助手（三栏对话，含流式回复、Skill 调用、知识库引用模拟）
4. Skill 中心（学校公共 Skill / 我的 Skill / 创建 Skill 四步向导）
5. AI 创作中心（图片 / PPT / 视频 / 音乐 / 数字人 / 3D 模型，六个 Tab 均可生成模拟结果）
6. 管理员后台（数据看板 / 教师账号 / 知识库 / Skill 审核 / 模型管理 / 积分管理）

**AI 能力为本地模拟（mock）**，不依赖任何真实大模型 API Key，也不产生任何费用。对话流式效果、Skill 调用、知识库引用、图片/PPT/视频等生成结果均由前端模拟生成，用于验证交互流程与视觉设计。要接入真实模型，需在 `src/lib/mockAI.ts`、`src/lib/mockData.ts`、`src/pages/StudioPage.tsx` 中把 mock 逻辑替换为真实后端 API 调用。

> 学校真实校徽因沙箱环境出站网络限制未能获取（`xndxfz.swu.edu.cn` 被网络策略拦截），当前使用了一个占位校徽（`src/components/ui/SchoolMark.tsx` 与 `public/favicon.svg`），正式上线前请替换为学校官方 VI 素材。

## 技术栈

- React 19 + TypeScript + Vite 8
- Tailwind CSS v4（`@tailwindcss/vite`）
- react-router-dom 7（前端路由）
- recharts（管理员后台图表）
- lucide-react（图标）

## 本地运行

需要 Node.js 18+（推荐 20/22）。

```bash
cd web
npm install
npm run dev
```

打开终端提示的地址（默认 http://localhost:5173 ）即可访问。

### 演示账号

登录页下方已列出演示账号，密码统一为 `123456`：

| 姓名 | 工号 | 角色 |
|---|---|---|
| 张明 | XF2018042 | 教师 |
| 李芳 | XF2015017 | 学科组长 |
| 王强 | XF2011003 | 管理员（可进入 `/admin` 后台） |
| 陈静 | XF2020091 | 教师（积分余额较低，用于演示预警） |

刘洋（XF2019056）账号已被停用，用于演示"账号禁用"提示。

### 其他命令

```bash
npm run build    # 生产构建（tsc 类型检查 + vite build），产物在 web/dist
npm run preview  # 本地预览生产构建
npm run lint     # oxlint 代码检查
```

## 目录结构

```
web/src/
  lib/            数据模型、mock 数据、mock AI 响应引擎、鉴权 Context
  components/ui/  通用 UI 原子组件（Button/Card/Badge/MiniMarkdown…）
  components/layout/  教师端整体布局（顶部导航 + 侧边栏）
  pages/          6 个核心页面
  pages/admin/    管理员后台子页面
```

## 已知局限（原型阶段）

- 所有数据（教师、Skill、知识库、积分流水等）仅存在于浏览器内存 / localStorage（登录态），刷新页面后对话与创作记录会重置，登录状态会保留。
- 图片/视频/音乐/数字人/3D 生成结果均为占位图形与模拟进度条，未接入真实生成式 AI 服务。
- 尚未接入真实的学校统一身份认证（SSO）、真实知识库检索（RAG）与真实大模型网关。
- 管理员后台的"批量导入""导出""下架 Skill"等按钮为界面占位，暂无实际数据落盘逻辑。

这些局限在真实立项开发时，需要按 `docs/智能教育助手-开发提示词.md` 中的技术架构建议、数据模型与分阶段实施路线，对接真实后端与第三方 AI 服务。
