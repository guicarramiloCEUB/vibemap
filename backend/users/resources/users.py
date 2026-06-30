from rest_framework import generics, permissions, status
from rest_framework.response import Response
from users.serializers import UserSerializer
from users.services import UserService
from rest_framework.decorators import action
from rest_framework import viewsets
from django.db import transaction


class UserResource(viewsets.ViewSet):

    def __init__(self, *args, **kwargs):  # 1. Added *args here
        super().__init__(*args, **kwargs) # 2. Passed *args here
        self.service = UserService()

    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)

    @transaction.atomic
    @action(detail=False, methods=['post'], url_path='register_user')
    def register_user(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.service.create_user(serializer.validated_data)
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], url_path='me')
    def get_logged_in_user(self, request):
        user = self.service.get_logged_in_user(request)
        if user:
            return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
        return Response({"detail": "Usuário não autenticado."}, status=status.HTTP_401_UNAUTHORIZED)
    
    