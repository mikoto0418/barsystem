# Generated by Django 4.2 on 2025-01-18 10:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('products', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_time', models.DateTimeField(auto_now_add=True, verbose_name='创建时间')),
                ('order_method', models.CharField(choices=[('QR', '扫码点餐'), ('ROBOT', '机器人点餐'), ('STAFF', '商家点餐')], max_length=10, verbose_name='点餐方式')),
                ('table_number', models.CharField(max_length=20, verbose_name='桌号')),
                ('number_of_diners', models.IntegerField(verbose_name='就餐人数')),
                ('robot_id', models.CharField(blank=True, max_length=50, null=True, verbose_name='机器人ID')),
                ('status', models.CharField(choices=[('PENDING', '待完成'), ('COMPLETED', '已完成'), ('CANCELLED', '已取消')], default='PENDING', max_length=10, verbose_name='订单状态')),
                ('total_amount', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='总金额')),
                ('remarks', models.TextField(blank=True, null=True, verbose_name='备注')),
            ],
            options={
                'verbose_name': '订单',
                'verbose_name_plural': '订单',
            },
        ),
        migrations.CreateModel(
            name='OrderDetail',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField(verbose_name='数量')),
                ('unit_price', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='单价')),
                ('temperature_choice', models.CharField(choices=[('COLD', '冷饮'), ('HOT', '热饮')], max_length=10, verbose_name='温度选择')),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='details', to='orders.order', verbose_name='订单')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='products.product', verbose_name='酒品')),
            ],
            options={
                'verbose_name': '订单明细',
                'verbose_name_plural': '订单明细',
            },
        ),
    ]
