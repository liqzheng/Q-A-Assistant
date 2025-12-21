# AI PDF 问答助手

一个基于 React + Ant Design 前端和 Node.js + Express 后端的 PDF 智能问答系统。

## 项目结构

```
note-assistant/
├── frontend/                    # React + Ant Design 前端
│   ├── public/                  # 静态文件
│   ├── src/                     # 源代码
│   │   ├── App.js              # 主应用组件
│   │   ├── App.css             # 样式文件
│   │   └── index.js            # 入口文件
│   └── package.json            # 前端依赖
├── backend/                     # Node.js + Express 后端
│   ├── services/                # 服务模块
│   │   ├── pdfService.js       # PDF 解析服务
│   │   ├── vectorStore.js      # 向量存储服务
│   │   └── qaService.js        # 问答服务
│   ├── uploads/                 # 上传文件临时目录
│   ├── server.js               # 服务器入口
│   └── package.json            # 后端依赖
├── README.md                    # 项目说明
└── .gitignore                   # Git 忽略文件
```

## 功能特性

- 📄 PDF 文件上传
- 🔍 PDF 内容解析和向量化
- 💬 智能问答（基于 OpenAI API）
- 🎨 现代化 UI 界面

## 技术栈

### 前端
- React
- Ant Design
- Axios

### 后端
- Node.js
- Express
- pdf-parse (PDF 解析)
- openai (OpenAI API)
- 内存向量存储（可扩展为 Chroma/FAISS）

## 快速开始

### 后端启动

```bash
cd backend
npm install
npm start
```

### 前端启动

```bash
cd frontend
npm install
npm start
```

## 环境变量

后端需要配置 `.env` 文件（复制 `.env.example` 并填入实际值）：

```
OPENAI_API_KEY=your_openai_api_key
PORT=3001
```

## 使用说明

1. **配置环境变量**：在 `backend` 目录下创建 `.env` 文件，填入你的 OpenAI API Key

2. **安装依赖**：
   ```bash
   # 后端
   cd backend
   npm install
   
   # 前端
   cd ../frontend
   npm install
   ```

3. **启动服务**：
   ```bash
   # 终端1：启动后端（端口 3001）
   cd backend
   npm start
   
   # 终端2：启动前端（端口 3000）
   cd frontend
   npm start
   ```

4. **使用流程**：
   - 打开浏览器访问 http://localhost:3000
   - 上传 PDF 文件（系统会自动解析并生成向量索引）
   - 等待处理完成（根据 PDF 大小可能需要一些时间）
   - 在提问框中输入问题
   - 系统会基于 PDF 内容生成回答

## API 接口

### POST /api/upload
上传 PDF 文件
- 请求：multipart/form-data，字段名 `pdf`
- 响应：`{ success, documentId, fileName, chunksCount }`

### POST /api/ask
提问接口
- 请求：`{ question: string }`
- 响应：`{ answer: string, sources: Array }`

### GET /api/documents
获取所有文档列表
- 响应：`{ documents: Array }`

### DELETE /api/documents
清空所有文档
- 响应：`{ success: boolean, message: string }`

## 技术实现

### PDF 解析
- 使用 `pdf-parse` 库提取 PDF 文本内容
- 将文本切分成 1000 字符的块，重叠 200 字符

### 向量化
- 使用 OpenAI 的 `text-embedding-3-small` 模型生成向量嵌入
- 使用余弦相似度进行向量检索

### 问答生成
- 基于检索到的相关文档块
- 使用 OpenAI GPT-3.5-turbo 模型生成回答

### 向量存储
- 当前使用内存存储（适合小规模使用）
- 可扩展为 Chroma 或 FAISS 等专业向量数据库

