from django.urls import path, include
from users.resources import UserResource, FriendshipResource
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import SimpleRouter

# Instancia o router e registra o seu recurso
router = SimpleRouter()
router.register(r'', UserResource, basename='users')
router.register(r'friendship', FriendshipResource, basename='friendship')

urlpatterns = [
    # Inclui todas as rotas automáticas do router
    path('', include(router.urls)),
    
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
