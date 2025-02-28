from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.products.views import ProductViewSet
from apps.orders.views import OrderViewSet
from apps.frontend.views import HomeView
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from django.views.decorators.csrf import csrf_exempt
from apps.users.views import login_view
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

# Swagger文档配置
schema_view = get_schema_view(
    openapi.Info(
        title="Bar Order System API",
        default_version='v1',
        description="酒吧点单系统API文档",
        terms_of_service="https://www.yourapp.com/terms/",
        contact=openapi.Contact(email="contact@yourapp.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
    url='http://127.0.0.1:8000',  # 添加基础URL
)

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    
    # Swagger URLs - 添加所有必要的 Swagger 路由
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('api/login/', login_view, name='login'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) \
  + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
