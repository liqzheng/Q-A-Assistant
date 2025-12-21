# 项目文件索引

## 📁 根目录文件

### `.gitignore`
Git 忽略配置文件，排除 node_modules、.env 等文件

### `README.md`
项目主要说明文档，包含项目介绍、技术栈、API 接口等

### `QUICKSTART.md`
快速启动指南，包含详细的安装和启动步骤

---

## 📁 backend/ 后端目录

### `server.js` ⭐ **核心文件**
Express 服务器主文件，包含所有 API 路由：
- `POST /api/upload` - 上传 PDF 文件
- `POST /api/ask` - 提问接口
- `GET /api/documents` - 获取文档列表
- `DELETE /api/documents` - 清空所有文档
- `GET /api/health` - 健康检查

### `package.json`
后端依赖配置，包含：
- express - Web 框架
- multer - 文件上传
- pdf-parse - PDF 解析
- openai - OpenAI API
- cors - 跨域支持
- dotenv - 环境变量

### `.env` ⚠️ **需要配置**
环境变量文件，需要填入：
```
OPENAI_API_KEY=your_api_key_here
PORT=3001
```

### `.env.example`
环境变量示例文件

### `.gitignore`
后端 Git 忽略配置

---

## 📁 backend/services/ 服务模块

### `pdfService.js`
PDF 处理服务：
- `parsePDF(filePath)` - 解析 PDF 提取文本
- `splitText(text, chunkSize, overlap)` - 将文本切分成块

### `vectorStore.js` ⭐ **核心文件**
向量存储服务（内存实现）：
- `generateEmbedding(text)` - 生成向量嵌入
- `addDocument(name, chunks)` - 添加文档
- `search(query, topK)` - 搜索相关文档块
- `getAllDocuments()` - 获取所有文档
- `clearAll()` - 清空所有文档

### `qaService.js`
问答服务：
- `generateAnswer(question, chunks)` - 基于文档块生成回答

---

## 📁 frontend/ 前端目录

### `package.json`
前端依赖配置，包含：
- react - React 框架
- react-dom - React DOM
- antd - Ant Design UI 组件库
- axios - HTTP 客户端
- react-scripts - Create React App 脚本

### `.gitignore`
前端 Git 忽略配置

---

## 📁 frontend/public/ 静态文件

### `index.html`
HTML 模板文件，React 应用的入口 HTML

---

## 📁 frontend/src/ 源代码

### `index.js` ⭐ **入口文件**
React 应用入口，渲染 App 组件

### `App.js` ⭐ **核心文件**
主应用组件，包含：
- PDF 上传功能
- 文档列表显示
- 问答界面
- 回答展示

### `App.css`
应用样式文件，包含布局和组件样式

### `index.css`
全局样式文件

---

## 📊 文件统计

- **总文件数**: 20 个
- **后端文件**: 7 个
- **前端文件**: 7 个
- **配置文件**: 6 个

## 🔑 关键文件说明

1. **`backend/server.js`** - 后端服务器，所有 API 的入口
2. **`backend/services/vectorStore.js`** - 向量存储核心逻辑
3. **`frontend/src/App.js`** - 前端主界面
4. **`backend/.env`** - 环境变量配置（需要填入 API Key）

## 🚀 快速访问

- 后端服务器: `backend/server.js`
- 前端应用: `frontend/src/App.js`
- 向量存储: `backend/services/vectorStore.js`
- PDF 处理: `backend/services/pdfService.js`
- 问答服务: `backend/services/qaService.js`

