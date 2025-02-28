# 酒吧点餐管理系统

一个现代化的酒吧点餐管理系统，提供商品管理、订单处理和用户管理等功能。

## 功能特点

- 商品管理：添加、编辑、删除商品，管理商品分类和库存
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

