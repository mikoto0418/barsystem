from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'error': '请提供用户名和密码'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=username, password=password)
        
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'token': str(refresh.access_token),
                'refresh': str(refresh),
                'username': user.username,
                'role': 'admin'
            })
        else:
            return Response(
                {'error': '用户名或密码错误'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
    except Exception as e:
        print(f"Login error: {str(e)}")  # 添加服务器端日志
        return Response(
            {'error': '登录失败，请稍后重试'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        ) 