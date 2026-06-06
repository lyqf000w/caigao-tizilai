# 才高题自来

面向移动端的 AI 面试题训练 H5 Demo。

本项目用于 AI 提示词工程师岗位测试题，展示如何使用 AI 将指定应用名“才高题自来”落地为一款有完整用户路径的工具类产品。

## 产品定位

才高题自来是一款面向求职者和学习者的 AI 题目生成与训练工具。用户选择岗位、难度和题型后，系统会生成专属题单，并提供答题、评分、追问建议、复习建议和历史记录。

核心演示路径：

1. 进入首页。
2. 选择“AI 提示词工程师”训练方向。
3. 生成面试冲刺题单。
4. 完成单选题、问答题和场景题。
5. 查看 AI 复盘报告。
6. 在“我的”页面查看历史记录。

## 技术栈

- React
- TypeScript
- Vite
- CSS 变量与原生 CSS
- localStorage 本地持久化
- Playwright 本地验证

## 为什么使用纯前端

本次题目要求是 H5 产品 Demo，重点是移动端产品完成度、AI 使用过程和可演示体验。因此 MVP 采用纯前端实现：

- Mock AI 生成题单和评分，确保演示稳定。
- localStorage 保存练习记录、收藏题和错题沉淀。
- 不在前端暴露任何真实 AI API Key。
- 后续如需接入真实大模型，可增加后端代理接口。

## 本地运行

```bash
npm install
npm run dev
```

默认访问：

```text
http://127.0.0.1:5173/
```

## 构建检查

```bash
npm run lint
npm run build
```

## 自动演示验证

先启动本地服务：

```bash
npm run dev -- --host 127.0.0.1 --port 5173
```

再运行：

```bash
node scripts/verify-demo.cjs
```

脚本会自动完成：

- 打开首页
- 进入生成页
- 生成题单
- 完成 5 道题
- 进入结果页
- 查看历史记录

截图会输出到：

```text
artifacts/
```

## 交付材料建议

建议最终提交或展示时包含：

- `PRD.md`：产品需求文档。
- 产品 Demo 截图：`artifacts/home-mobile-final.png`、`artifacts/generate-mobile.png`、`artifacts/practice-mobile.png`、`artifacts/result-mobile.png`、`artifacts/mine-mobile.png`。
- AI 使用过程截图或录屏：保留需求分析、PRD、代码实现、问题修复、浏览器验证过程。
- 可运行项目代码。
- 如有时间，可部署到 Vercel、Netlify 或 GitHub Pages，提供测试链接。
