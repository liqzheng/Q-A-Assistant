# GitHub 上传指南

## 🚀 快速步骤

### 方法 1：在 GitHub 网站创建仓库（推荐）

#### 步骤 1：在 GitHub 创建新仓库
1. 登录 GitHub (https://github.com)
2. 点击右上角 "+" → "New repository"
3. 填写信息：
   - Repository name: `note-assistant` 或 `ai-pdf-qa-assistant`
   - Description: `AI PDF Q&A Assistant - Full stack application with React, Node.js, and OpenAI API`
   - 选择 Public 或 Private
   - **不要**勾选 "Initialize this repository with a README"
4. 点击 "Create repository"

#### 步骤 2：在本地初始化 Git 并推送

```bash
# 进入项目目录
cd /Users/zhengliqiong/Documents/xp/note-assistant

# 初始化 Git 仓库（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: AI PDF Q&A Assistant"

# 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/note-assistant.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

---

### 方法 2：使用 GitHub CLI（如果已安装）

```bash
# 进入项目目录
cd /Users/zhengliqiong/Documents/xp/note-assistant

# 初始化 Git
git init
git add .
git commit -m "Initial commit: AI PDF Q&A Assistant"

# 使用 GitHub CLI 创建仓库并推送
gh repo create note-assistant --public --source=. --remote=origin --push
```

---

## 📋 详细步骤说明

### 1. 检查当前状态

```bash
cd /Users/zhengliqiong/Documents/xp/note-assistant
git status
```

### 2. 初始化 Git 仓库（如果还没有）

```bash
git init
```

### 3. 确保 .gitignore 正确

检查 `.gitignore` 文件，确保包含：
- `node_modules/`
- `.env`
- `uploads/`
- `build/`

### 4. 添加文件

```bash
# 添加所有文件
git add .

# 或者选择性添加
git add README.md
git add backend/
git add frontend/
git add .gitignore
```

### 5. 提交

```bash
git commit -m "Initial commit: AI PDF Q&A Assistant

- Built interactive UI with React and Ant Design
- Developed RESTful APIs with Express and Node.js
- Implemented vector store with similarity search
- Integrated GPT-3.5 Turbo with OpenAI API"
```

### 6. 在 GitHub 创建仓库

1. 访问 https://github.com/new
2. 填写仓库信息
3. **不要**初始化 README（因为本地已有文件）

### 7. 连接远程仓库

```bash
# 替换 YOUR_USERNAME 为你的 GitHub 用户名
git remote add origin https://github.com/YOUR_USERNAME/note-assistant.git

# 或者使用 SSH（如果配置了 SSH key）
git remote add origin git@github.com:YOUR_USERNAME/note-assistant.git
```

### 8. 推送代码

```bash
# 设置主分支为 main
git branch -M main

# 推送到 GitHub
git push -u origin main
```

---

## 🔐 认证方式

### 方式 1：Personal Access Token（推荐）

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 生成新 token，勾选 `repo` 权限
3. 推送时使用 token 作为密码

### 方式 2：SSH Key

```bash
# 检查是否已有 SSH key
ls -al ~/.ssh

# 如果没有，生成新的
ssh-keygen -t ed25519 -C "your_email@example.com"

# 添加到 GitHub
# Settings → SSH and GPG keys → New SSH key
```

### 方式 3：GitHub CLI

```bash
# 安装 GitHub CLI
brew install gh

# 登录
gh auth login
```

---

## 📝 推送后的操作

### 1. 添加项目描述

在 GitHub 仓库页面：
- 点击 ⚙️ Settings
- 添加 Description 和 Topics（如：react, nodejs, openai, ai, pdf-qa）

### 2. 更新 README

确保 `README.md` 包含：
- 项目介绍
- 安装步骤
- 使用方法
- 技术栈

### 3. 添加 License（可选）

```bash
# 创建 LICENSE 文件（MIT License）
# 或使用 GitHub 的 License 模板
```

---

## ⚠️ 注意事项

### 1. 不要提交敏感信息
- ✅ `.env` 已在 `.gitignore` 中
- ✅ `node_modules/` 已在 `.gitignore` 中
- ⚠️ 检查是否有 API Key 硬编码在代码中

### 2. 检查 .env.example
确保 `.env.example` 文件存在，供其他开发者参考。

### 3. 提交前检查

```bash
# 查看将要提交的文件
git status

# 查看文件内容（确保没有敏感信息）
git diff
```

---

## 🔄 后续更新

```bash
# 修改文件后
git add .
git commit -m "描述你的更改"
git push
```

---

## 📦 完整命令示例

```bash
# 1. 进入项目目录
cd /Users/zhengliqiong/Documents/xp/note-assistant

# 2. 初始化 Git（如果还没有）
git init

# 3. 添加文件
git add .

# 4. 提交
git commit -m "Initial commit: AI PDF Q&A Assistant"

# 5. 添加远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/note-assistant.git

# 6. 推送
git branch -M main
git push -u origin main
```

---

## 🆘 常见问题

### Q: 提示 "remote origin already exists"
```bash
# 删除现有远程仓库
git remote remove origin

# 重新添加
git remote add origin https://github.com/YOUR_USERNAME/note-assistant.git
```

### Q: 推送被拒绝
```bash
# 先拉取远程更改
git pull origin main --allow-unrelated-histories

# 解决冲突后再次推送
git push -u origin main
```

### Q: 忘记添加 .env 到 .gitignore
```bash
# 如果已经提交了 .env，需要从 Git 中删除（但保留本地文件）
git rm --cached backend/.env
git commit -m "Remove .env from repository"
git push
```

---

## ✅ 检查清单

- [ ] 已创建 GitHub 仓库
- [ ] 已初始化本地 Git 仓库
- [ ] `.gitignore` 已配置正确
- [ ] 已检查没有敏感信息（API Key 等）
- [ ] 已提交所有文件
- [ ] 已连接远程仓库
- [ ] 已成功推送到 GitHub
- [ ] README.md 已更新
- [ ] 已添加仓库描述和 Topics

