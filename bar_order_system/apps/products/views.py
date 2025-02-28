from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Product
from .serializers import ProductSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class ProductViewSet(viewsets.ModelViewSet):
    """
    酒品管理接口
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    @swagger_auto_schema(
        operation_summary="获取酒品列表",
        operation_description="返回所有酒品信息"
    )
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_summary="创建新酒品",
        operation_description="""
        创建新的酒品
        - category: 类别 (BAIJIU/RED_WINE/BEER/FOREIGN)
        - temperature_requirement: 温度要求 (COLD/HOT/BOTH)
        """,
        request_body=ProductSerializer
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="获取酒品详情",
        operation_description="根据酒品ID获取详细信息"
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="更新酒品",
        operation_description="更新酒品全部信息",
        request_body=ProductSerializer
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="部分更新酒品",
        operation_description="更新酒品部分字段",
        request_body=ProductSerializer
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="删除酒品",
        operation_description="根据酒品ID删除酒品"
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="上传商品图片",
        operation_description="上传或更新商品图片",
        manual_parameters=[
            openapi.Parameter(
                'product_id',
                openapi.IN_FORM,
                description="商品ID",
                type=openapi.TYPE_INTEGER,
                required=True
            ),
            openapi.Parameter(
                'file',
                openapi.IN_FORM,
                description="图片文件",
                type=openapi.TYPE_FILE,
                required=True
            )
        ]
    )
    @action(detail=False, methods=['post'], url_path='upload-image')
    def upload_image(self, request):
        try:
            product_id = request.data.get('product_id')
            image_file = request.FILES.get('file')

            if not product_id or not image_file:
                return Response(
                    {'error': '缺少必要参数'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                return Response(
                    {'error': '商品不存在'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # 更新商品图片
            product.image = image_file
            product.save()

            return Response({
                'url': request.build_absolute_uri(product.image.url)
            })

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )