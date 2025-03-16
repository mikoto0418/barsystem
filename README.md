# 酒吧点餐管理系统

一个现代化的酒吧点餐管理系统，提供商品管理、订单处理和用户管理等功能。

## 功能特点

- 商品管理：添加、编辑、删除商品，管理商品分类和库存
  - 支持商品图片上传：可为每个商品添加图片，方便顾客识别
- 订单管理：实时订单处理，订单状态跟踪
- 用户管理：会员管理，用户权限控制
- 多语言支持：支持中英文切换

## 技术栈

### 前端
- Vue 3 - 渐进式 JavaScript 框架
- Vite - 现代前端构建工具
- Element Plus - Vue 3 的组件库
- Vue Router - 路由管理
- Pinia - 状态管理
- Axios - HTTP 请求库

### 后端
- Python 3.8+
- Django 4.0+
- Django REST framework - RESTful API 框架
- SQLite - 数据库
- Django Media 文件管理 - 处理图片上传和存储

## 环境要求

- Node.js 16+
- Python 3.8+
- npm 或 yarn

## 快速开始

1. 克隆项目
```bash
git clone [项目地址]
cd barsystem
```

2. 启动前端服务
```bash
cd bar_management
npm install
npm run dev
```

3. 启动后端服务
```bash
cd bar_order_system
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## 访问地址

### 前端入口
- 扫码点餐页面：http://localhost:5173/ordering/qr?table=[桌号]
- 机器人点餐页面：http://localhost:5173/ordering/r/[桌号]
- 服务员点餐页面：http://localhost:5173/ordering/staff
- 管理后台：http://localhost:5173/login

## 图片上传功能

系统支持商品图片上传功能，具体说明如下：

### 图片存储位置
- 所有上传的商品图片将存储在 `bar_order_system/media/products` 目录下
- 每个图片文件使用唯一的文件名（MD5哈希值）进行存储，避免文件名冲突

### 如何使用图片上传功能
1. 在管理后台登录系统
2. 进入商品管理页面
3. 添加新商品或编辑现有商品时，可以通过"商品图片"区域上传图片
4. 点击"点击更换图片"按钮选择本地图片文件
5. 选择完成后，系统会自动上传图片并显示预览
6. 点击"保存"按钮完成商品信息和图片的保存

### 图片访问方式
- 前端通过 `/media/products/[图片文件名]` 路径访问上传的图片
- 在商品列表和详情页面会自动显示已上传的商品图片

