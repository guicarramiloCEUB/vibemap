from django.contrib.auth import get_user_model
from users.models import Friendship
from events.models import Event
from django.db.models import Q, Count

User = get_user_model()

class UserService:
    @staticmethod
    def create_user(data):
        return User.objects.create_user(**data)

    def get_logged_in_user(self, request):
        if request.user.is_authenticated:
            user = User.objects.filter(pk=request.user.pk).annotate(
                friend_count=Count(
                    'sent_requests',
                    filter=Q(sent_requests__status='accepted'),
                    distinct=True,
                ) + Count(
                    'received_requests',
                    filter=Q(received_requests__status='accepted'),
                    distinct=True,
                ),
                event_count=Count('created_events', distinct=True),
            ).first()
            return user
        return None

    def update_user(self, user, data):
        for attr, value in data.items():
            setattr(user, attr, value)
        user.save()
        return user
    