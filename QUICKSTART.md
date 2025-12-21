# 快速启动指南

## 前置要求

- Node.js (推荐 v16 或更高版本)
- npm 或 yarn
- OpenAI API Key

## 步骤 1: 配置后端环境变量

```bash
cd backend
cp .env.example .env
```

然后编辑 `.env` 文件，填入你的 OpenAI API Key：

```
OPENAI_API_KEY=sk-your-actual-api-key-here
PORT=3001
```

## 步骤 2: 安装后端依赖

```bash
cd backend
npm install
```

## 步骤 3: 安装前端依赖

```bash
cd ../frontend
npm install
```

## 步骤 4: 启动服务

### 方式一：分别启动（推荐用于开发）

**终端 1 - 启动后端：**
```bash
cd backend
npm start
```

后端将在 http://localhost:3001 运行

**终端 2 - 启动前端：**
```bash
cd frontend
npm start
```

前端将在 http://localhost:3000 运行，浏览器会自动打开

### 方式二：使用开发模式（自动重启）

后端使用 nodemon（需要先安装）：
```bash
cd backend
npm install -g nodemon  # 如果还没安装
npm run dev
```

## 步骤 5: 使用应用

1. 打开浏览器访问 http://localhost:3000
2. 点击"选择 PDF 文件"上传一个 PDF
3. 等待处理完成（会显示处理的文本块数量）
4. 在提问框中输入问题
5. 点击"提问"按钮获取回答

## 常见问题

### 1. 端口被占用
如果 3000 或 3001 端口被占用，可以：
- 修改后端 `.env` 中的 `PORT` 值
- 修改前端 `package.json` 中的 `proxy` 值，或使用环境变量 `PORT=3002 npm start`

### 2. OpenAI API 错误
- 确保 API Key 正确
- 检查账户余额
- 确认网络连接正常

### 3. PDF 处理很慢
- 大文件需要更多时间生成向量嵌入
- 系统在每个块之间添加了 100ms 延迟以避免 API 速率限制
- 可以考虑使用更快的向量数据库（如 Chroma）

## 下一步

- 查看 `README.md` 了解详细的项目结构和技术实现
- 根据需要修改文本切分大小（`backend/services/pdfService.js`）
- 调整向量检索数量（`backend/server.js` 中的 `topK` 参数）

