from django.db import models
from apps.products.models import Product

class Order(models.Model):
    """
    订单模型
    用于存储订单的基本信息，包括订单方式、桌号、人数等
    """
    
    # 订单来源选项
    ORDER_METHOD_CHOICES = [
        ('QR', '扫码点餐'),
        ('ROBOT', '机器人点餐'),
        ('STAFF', '商家点餐'),
    ]
    
    # 订单状态选项
    ORDER_STATUS_CHOICES = [
        ('PENDING', '待完成'),
        ('COMPLETED', '已完成'),
        ('CANCELLED', '已取消'),
    ]
    
    # 订单基本信息
    created_time = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    order_method = models.CharField(
        max_length=10, 
        choices=ORDER_METHOD_CHOICES,
        verbose_name='点餐方式'
    )
    table_number = models.CharField(max_length=20, verbose_name='桌号')
    number_of_diners = models.IntegerField(verbose_name='就餐人数')
    robot_id = models.CharField(max_length=50, null=True, blank=True, verbose_name='机器人ID')
    
    # 订单状态和金额
    status = models.CharField(
        max_length=10,
        choices=ORDER_STATUS_CHOICES,
        default='PENDING',
        verbose_name='订单状态'
    )
    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='总金额'
    )
    remarks = models.TextField(blank=True, null=True, verbose_name='备注')

    class Meta:
        verbose_name = '订单'
        verbose_name_plural = '订单'
        
    def __str__(self):
        return f'订单{self.id} - {self.table_number}'

class OrderDetail(models.Model):
    """
    订单详情模型
    用于存储订单中的具体商品信息，包括数量、价格、温度选择等
    """
    
    # 饮品温度选项
    TEMPERATURE_CHOICES = [
        ('COLD', '冷饮'),
        ('HOT', '热饮'),
    ]
    
    # 关联订单和商品
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='details',
        verbose_name='所属订单'
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        verbose_name='商品'
    )
    
    # 商品具体信息
    quantity = models.IntegerField(verbose_name='数量')
    unit_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='单价'
    )
    temperature_choice = models.CharField(
        max_length=10,
        choices=TEMPERATURE_CHOICES,
        verbose_name='温度选择'
    )
    
    class Meta:
        verbose_name = '订单详情'
        verbose_name_plural = '订单详情'
        
    def __str__(self):
        return f'{self.order.id} - {self.product.name}'