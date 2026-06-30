from django.contrib.auth import get_user_model
from users.models import Friendship

User = get_user_model()

class FriendshipService:

    def enviar_solicitacao(self, from_user, to_user):
        if from_user == to_user:
            raise ValueError("Não é possível enviar uma solicitação de amizade para si mesmo.")
        if Friendship.objects.filter(from_user=from_user, to_user=to_user).exists():
            raise ValueError("Solicitação de amizade já enviada.")
        if Friendship.objects.filter(from_user=to_user, to_user=from_user).exists():
            raise ValueError("O usuário já enviou uma solicitação de amizade para você.")

        friendship = Friendship.objects.create(from_user=from_user, to_user=to_user, status='pending')
        return friendship

    def aceitar_solicitacao(self, from_user, to_user):
        try:
            friendship = Friendship.objects.get(from_user=from_user, to_user=to_user, status='pending')
            friendship.status = 'accepted'
            friendship.save()
            return friendship
        except Friendship.DoesNotExist:
            raise ValueError("Solicitação de amizade não encontrada.")