from django.db import models
from django.conf import settings

class Product(models.Model):
    CATEGORY_CHOICES = [
        ('BAIJIU', '白酒'),
        ('RED_WINE', '红酒'),
        ('BEER', '啤酒'),
        ('FOREIGN', '洋酒')
    ]
    
    TEMPERATURE_CHOICES = [
        ('COLD', '冷饮'),
        ('HOT', '热饮'),
        ('BOTH', '冷热皆可')
    ]
    
    name = models.CharField(max_length=100, verbose_name='名称')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, verbose_name='类别')
    alcohol_content = models.DecimalField(max_digits=5, decimal_places=2, verbose_name='酒精度')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='价格')
    temperature_requirement = models.CharField(
        max_length=10, 
        choices=TEMPERATURE_CHOICES,
        default='COLD',
        verbose_name='温度要求'
    )
    description = models.TextField(blank=True, null=True, verbose_name='描述')
    image = models.ImageField(upload_to='products/', blank=True, null=True, verbose_name='商品图片')
    
    class Meta:
        verbose_name = '商品'
        verbose_name_plural = '商品'
        
    def __str__(self):
        return self.name