# 才高题自来

`才高题自来` 是一款面向移动端的 AI 面试题训练 H5 Demo。项目围绕“AI 提示词工程师”岗位测试题完成，从应用名、产品定位、PRD、交互流程到前端实现形成一套完整交付。

核心体验：

- 根据岗位、难度、题型生成训练题单。
- 支持单选题、问答题、场景题混合练习。
- 完成练习后生成得分、薄弱能力、追问样例和复习建议。
- 使用 localStorage 保存历史练习和收藏题。
- 面向 Android / iOS 常见手机宽度做移动端 H5 适配。

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

## 交付材料

- 产品需求文档：[docs/PRD.md](docs/PRD.md)
- 首页截图：[docs/screenshots/home-mobile.png](docs/screenshots/home-mobile.png)
- 生成页截图：[docs/screenshots/generate-mobile.png](docs/screenshots/generate-mobile.png)
- 答题页截图：[docs/screenshots/practice-mobile.png](docs/screenshots/practice-mobile.png)
- 结果页截图：[docs/screenshots/result-mobile.png](docs/screenshots/result-mobile.png)
- 我的页截图：[docs/screenshots/mine-mobile.png](docs/screenshots/mine-mobile.png)

## 实现边界

当前版本是纯前端 H5 Demo：

- 使用 Mock AI 流程模拟生成题单和评分复盘。
- 使用 localStorage 保存练习记录和收藏题。
- 不在前端暴露任何真实 AI API Key。
- 不申请摄像头、定位、通讯录、相册、麦克风等敏感权限。

如果后续要接入真实大模型，应增加后端代理接口，由服务端保存 API Key 并负责内容安全、频率限制和日志脱敏。
