# 才高题自来

`才高题自来` 是一款面向移动端的 AI 面试题训练 H5 Demo。项目围绕“AI 提示词工程师”岗位测试题完成，从应用名、产品定位、PRD、交互流程到前端实现形成一套完整交付。

核心体验：

- 根据岗位、难度、题型生成训练题单。
- 支持单选题、问答题、场景题混合练习。
- 完成练习后生成得分、薄弱能力、追问样例和复习建议。
- 使用 localStorage 保存历史练习和收藏题。
- 面向 Android / iOS 常见手机宽度做移动端 H5 适配。

## 后续产品化优化方向

当前版本定位为招聘测试 Demo，重点验证“题单生成 - 练习作答 - 结果复盘 - 历史沉淀”的核心闭环，因此优先采用轻量前端实现，避免在 Demo 阶段引入过重的账号、服务端和商业化复杂度。如果该项目继续产品化，我会按以下方向推进：

- 接入真实 AI 服务：将当前静态题库与规则生成升级为大模型生成，支持按岗位 JD、候选人简历、能力维度动态出题，并增加 Prompt 模板管理、内容安全过滤和生成结果缓存。
- 增加后端与数据库：引入 Node.js / NestJS 或轻量 Serverless API，使用 PostgreSQL / MySQL 存储用户、题单、练习记录、错题本、收藏题和评分报告，解决多设备同步与长期数据沉淀问题。
- 完善账号与权限体系：支持手机号、邮箱或第三方登录，区分普通用户、运营管理员、内容管理员等角色，管理员可维护题库、能力标签、题型模板和推荐策略。
- 优化评分与复盘能力：将当前规则评分升级为多维评分模型，覆盖表达结构、岗位匹配度、业务理解、Prompt 设计能力、风险意识等维度，并给出可执行的改写建议。
- 支持语音练习场景：在 Web 端接入浏览器 Speech Recognition / MediaRecorder，在移动端或 App 场景接入系统语音能力，实现口述作答、语音转文字、答题回放和面试表达训练。
- 增强移动端工程化：如果需要上架应用商店，可使用 Capacitor / Tauri Mobile / React Native 包装为 Android App，补充启动页、图标、权限说明、隐私政策和应用商店合规材料。
- 增加测试与质量保障：补充核心逻辑单元测试、组件测试、E2E 回归测试和移动端兼容性截图校验，保证题单生成、答题流程、结果计算和本地存储稳定可靠。
- 完善部署与运维：在现有 Docker 部署基础上补充 CI/CD、自动构建、版本回滚、访问日志、错误监控、性能监控和 HTTPS 域名配置，让项目具备正式线上服务的可维护性。
- 做数据化产品迭代：增加练习漏斗、题型完成率、薄弱能力分布、复习转化率等数据指标，用真实使用数据优化推荐策略和训练路径。

## 项目结构

```text
.
├── docs/
│   ├── PRD.md
│   └── screenshots/
│       ├── home-mobile.png
│       ├── generate-mobile.png
│       ├── practice-mobile.png
│       ├── result-mobile.png
│       └── mine-mobile.png
├── scripts/
│   └── verify-demo.cjs
├── src/
│   ├── app/
│   │   └── App.tsx
│   ├── components/
│   │   ├── BottomNav.tsx
│   │   ├── BrandHeader.tsx
│   │   ├── Field.tsx
│   │   └── Metric.tsx
│   ├── data/
│   │   ├── practiceOptions.ts
│   │   └── questionBank.ts
│   ├── features/
│   │   ├── generator/
│   │   ├── home/
│   │   ├── practice/
│   │   └── profile/
│   ├── lib/
│   │   ├── practiceEngine.ts
│   │   └── storage.ts
│   ├── styles/
│   │   ├── app.css
│   │   └── global.css
│   ├── types/
│   │   └── practice.ts
│   └── main.tsx
├── package.json
└── vite.config.ts
```

目录分层说明：

- `docs/`：PRD 和最终演示截图。
- `src/app/`：应用入口和页面状态编排。
- `src/components/`：跨页面复用的 UI 组件。
- `src/data/`：题库、选项、生成步骤等静态产品数据。
- `src/features/`：按业务页面拆分的功能模块。
- `src/lib/`：评分、生成题单、日期格式化、本地存储等业务逻辑。
- `src/styles/`：全局样式与移动端界面样式。
- `src/types/`：核心 TypeScript 类型定义。

## 技术栈

- React
- TypeScript
- Vite
- lucide-react
- CSS variables
- localStorage
- Playwright

## 本地运行

```bash
npm install
npm run dev
```

默认访问地址：

```text
http://127.0.0.1:5173/
```

## 质量检查

```bash
npm run lint
npm run build
```

## 自动演示验证

先启动本地服务：

```bash
npm run dev -- --host 127.0.0.1 --port 5173
```

再运行自动演示脚本：

```bash
npm run verify:demo
```

验证脚本会自动完成：

- 打开首页。
- 进入生成页。
- 生成 AI 提示词工程师题单。
- 完成 5 道题。
- 查看结果复盘。
- 查看历史记录。

脚本生成的临时截图会输出到 `artifacts/`，该目录不提交到仓库。正式演示截图保存在 `docs/screenshots/`。
