from rest_framework import serializers
from users.models import Friendship

class FriendshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friendship
        fields = ('id', 'from_user', 'to_user', 'status', 'created_at')