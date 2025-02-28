# Bar Order System API 文档

## 产品相关接口 (Products)

### 1. 获取产品列表
```
GET /api/products/
```
- 描述：获取所有酒品列表
- 分页：默认每页10条

### 2. 创建新产品
```
POST /api/products/
```
- 描述：创建新的酒品
- 必填字段：
  - name: 名称
  - category: 类别 (BAIJIU/RED_WINE/BEER/FOREIGN)
  - alcohol_content: 酒精度
  - price: 价格
  - temperature_requirement: 温度要求 (COLD/HOT/BOTH)
  - description: 描述

### 3. 获取产品详情
```
GET /api/products/{id}/
```
- 描述：获取指定ID的酒品详情

### 4. 更新产品
```
PUT /api/products/{id}/
```
- 描述：更新指定ID的酒品全部信息
- 需要提供所有字段

### 5. 部分更新产品
```
PATCH /api/products/{id}/
```
- 描述：更新指定ID的酒品部分信息
- 只需提供要更新的字段

### 6. 删除产品
```
DELETE /api/products/{id}/
```
- 描述：删除指定ID的酒品

## 订单相关接口 (Orders)

### 1. 获取订单列表
```
GET /api/orders/
```
- 描述：获取所有订单列表
- 查询参数：
  - order_method: 订单方式 (QR/ROBOT/STAFF)
- 分页：默认每页10条

### 2. 创建新订单
```
POST /api/orders/
```
- 描述：创建新订单
- 必填字段：
  - order_method: 订单方式 (QR/ROBOT/STAFF)
  - table_number: 桌号
  - number_of_diners: 就餐人数
  - total_amount: 总金额
  - details: 订单明细数组
    - product: 产品ID
    - quantity: 数量
    - unit_price: 单价
    - temperature_choice: 温度选择 (COLD/HOT)

### 3. 获取订单详情
```
GET /api/orders/{id}/
```
- 描述：获取指定ID的订单详情

### 4. 更新订单
```
PUT /api/orders/{id}/
```
- 描述：更新指定ID的订单全部信息
- 需要提供所有字段，包括订单明细

### 5. 部分更新订单
```
PATCH /api/orders/{id}/
```
- 描述：更新指定ID的订单部分信息
- 只需提供要更新的字段

### 6. 删除订单
```
DELETE /api/orders/{id}/
```
- 描述：删除指定ID的订单及其明细

### 7. 取消订单
```
POST /api/orders/{id}/cancel_order/
```
- 描述：将订单状态更改为已取消

### 8. 完成订单
```
POST /api/orders/{id}/complete_order/
```
- 描述：将订单状态更改为已完成

## 数据模型

### Product 模型字段
```python
- name: str                    # 名称
- category: str                # 类别
- alcohol_content: float       # 酒精度
- price: decimal              # 价格
- temperature_requirement: str # 温度要求
- description: str            # 描述
```

### Order 模型字段
```python
- created_time: datetime      # 创建时间
- order_method: str           # 点餐方式
- table_number: str           # 桌号
- number_of_diners: int       # 就餐人数
- robot_id: str               # 机器人ID（可选）
- status: str                 # 订单状态
- total_amount: decimal       # 总金额
- remarks: str                # 备注（可选）
- details: [OrderDetail]      # 订单明细
```

### OrderDetail 模型字段
```python
- product: Product            # 关联的产品
- quantity: int              # 数量
- unit_price: decimal        # 单价
- temperature_choice: str    # 温度选择
```

## 注意事项
1. 所有涉及金额的字段都使用字符串格式的数字
2. 所有时间字段使用 ISO 格式
3. API 返回的数据默认按每页10条分页
4. 所有请求和响应的 Content-Type 都是 application/json
