from rest_framework import generics, permissions, status
from rest_framework.response import Response
from users.serializers import FriendshipSerializer
from users.services import FriendshipService
from rest_framework.decorators import action
from rest_framework import viewsets
from django.db import transaction


class FriendshipResource(viewsets.ViewSet):

    def __init__(self, *args, **kwargs):  # 1. Added *args here
        super().__init__(*args, **kwargs) # 2. Passed *args here
        self.service = FriendshipService()

    serializer_class = FriendshipSerializer
    permission_classes = (permissions.AllowAny,)

    @transaction.atomic
    @action(detail=False, methods=['post'], url_path='enviar_solicitacao')
    def send_friendship_request(self, request):
        serializer = FriendshipSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        from_user = request.user
        to_user = serializer.validated_data.get('to_user')
        friendship = self.service.enviar_solicitacao(from_user, to_user)
        return Response(FriendshipSerializer(friendship).data, status=status.HTTP_201_CREATED)
    
    