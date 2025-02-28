from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class OrderViewSet(viewsets.ModelViewSet):
    """
    订单管理接口
    """
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        # 使用 select_related 和 prefetch_related 优化查询
        return Order.objects.prefetch_related(
            'details',
            'details__product'
        ).all()

    @swagger_auto_schema(
        operation_summary="获取订单列表",
        operation_description="返回所有订单信息，支持按订单方式筛选",
        manual_parameters=[
            openapi.Parameter(
                'order_method',
                openapi.IN_QUERY,
                description="订单方式筛选 (QR/ROBOT/STAFF)",
                type=openapi.TYPE_STRING,
                required=False,
                enum=['QR', 'ROBOT', 'STAFF']
            )
        ]
    )
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_summary="创建订单",
        operation_description="创建新订单，包含订单明细信息"
    )
    def create(self, request, *args, **kwargs):
        try:
            # 打印接收到的数据，用于调试
            print("接收到的订单数据:", request.data)
            
            serializer = self.get_serializer(data=request.data)
            if not serializer.is_valid():
                print("序列化器验证错误:", serializer.errors)
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
                headers=headers
            )
        except Exception as e:
            print("创建订单时发生错误:", str(e))
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @swagger_auto_schema(
        operation_summary="获取订单详情",
        operation_description="根据订单ID获取订单详细信息"
    )
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_summary="更新订单",
        operation_description="""
        更新订单全部信息，包含订单明细
        - 需要提供所有字段，包括未修改的字段
        - 订单明细会先删除再重新创建
        """,
        request_body=OrderSerializer
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="部分更新订单",
        operation_description="更新订单部分字段，只需提供要修改的字段",
        request_body=OrderSerializer
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="删除订单",
        operation_description="根据订单ID删除订单及其明细"
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="取消订单",
        operation_description="将订单状态更改为已取消",
        responses={200: openapi.Response(
            description="订单取消成功",
            examples={"application/json": {"status": "order cancelled"}}
        )}
    )
    @action(detail=True, methods=['post'])
    def cancel_order(self, request, pk=None):
        order = self.get_object()
        order.status = 'CANCELLED'
        order.save()
        return Response({'status': 'order cancelled'})

    @swagger_auto_schema(
        operation_summary="完成订单",
        operation_description="将订单状态更改为已完成",
        responses={200: openapi.Response(
            description="订单完成成功",
            examples={"application/json": {"status": "order completed"}}
        )}
    )
    @action(detail=True, methods=['post'])
    def complete_order(self, request, pk=None):
        order = self.get_object()
        order.status = 'COMPLETED'
        order.save()
        return Response({'status': 'order completed'}) 