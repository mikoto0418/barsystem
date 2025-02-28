from rest_framework import serializers
from .models import Order, OrderDetail
from apps.products.models import Product

class OrderDetailSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        required=True
    )
    
    class Meta:
        model = OrderDetail
        fields = ['product', 'quantity', 'unit_price', 'temperature_choice']

class OrderSerializer(serializers.ModelSerializer):
    details = OrderDetailSerializer(many=True, required=True)
    
    class Meta:
        model = Order
        fields = '__all__'
        extra_kwargs = {
            'status': {'default': 'PENDING'},
            'total_amount': {'required': True},
            'table_number': {
                'required': True,
                'allow_blank': False,
                'error_messages': {
                    'blank': '桌号不能为空',
                    'required': '请提供桌号'
                }
            },
            'number_of_diners': {
                'required': True,
                'min_value': 1,
                'error_messages': {
                    'min_value': '就餐人数至少为1人',
                    'required': '请提供就餐人数'
                }
            }
        }

    def validate(self, data):
        """
        添加自定义验证逻辑
        """
        if data.get('order_method') == 'ROBOT':
            # 如果是机器人点餐，确保有robot_id
            if not data.get('robot_id'):
                raise serializers.ValidationError({'robot_id': '机器人点餐必须提供机器人ID'})
            # 机器人点餐可以使用特殊的桌号格式
            if not data.get('table_number'):
                data['table_number'] = f"ROBOT_{data['robot_id']}"
        
        return data

    def create(self, validated_data):
        details_data = validated_data.pop('details')
        order = Order.objects.create(**validated_data)
        
        for detail_data in details_data:
            OrderDetail.objects.create(
                order=order,
                product_id=detail_data['product'].id,
                quantity=detail_data['quantity'],
                unit_price=detail_data['unit_price'],
                temperature_choice=detail_data['temperature_choice']
            )
        return order

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # 添加产品名称等额外信息
        details_data = []
        for detail in instance.details.all():
            detail_data = OrderDetailSerializer(detail).data
            detail_data['product_name'] = detail.product.name
            details_data.append(detail_data)
        data['details'] = details_data
        return data

    def update(self, instance, validated_data):
        # 处理订单主表数据
        instance.order_method = validated_data.get('order_method', instance.order_method)
        instance.table_number = validated_data.get('table_number', instance.table_number)
        instance.number_of_diners = validated_data.get('number_of_diners', instance.number_of_diners)
        instance.total_amount = validated_data.get('total_amount', instance.total_amount)
        instance.status = validated_data.get('status', instance.status)
        instance.remarks = validated_data.get('remarks', instance.remarks)
        instance.save()

        # 处理订单明细
        if 'details' in validated_data:
            # 删除原有明细
            instance.details.all().delete()
            # 创建新明细
            details_data = validated_data.get('details')
            for detail_data in details_data:
                OrderDetail.objects.create(order=instance, **detail_data)

        return instance 