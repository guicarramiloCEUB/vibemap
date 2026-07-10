from rest_framework import serializers
from django.contrib.auth import get_user_model
import base64
import binascii

User = get_user_model()


class Base64BinaryField(serializers.Field):
    def to_internal_value(self, data):
        if data in (None, ''):
            return None

        if isinstance(data, str):
            payload = data
            if data.startswith('data:') and ',' in data:
                payload = data.split(',', 1)[1]

            try:
                return base64.b64decode(payload, validate=True)
            except (binascii.Error, ValueError) as error:
                raise serializers.ValidationError('avatar_url must be a valid base64 string') from error

        if isinstance(data, (bytes, bytearray, memoryview)):
            return bytes(data)

        raise serializers.ValidationError('avatar_url must be a base64 string or bytes payload')

    def to_representation(self, value):
        if value in (None, b''):
            return None

        return base64.b64encode(bytes(value)).decode('utf-8')

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    bio = serializers.CharField(required=False, allow_blank=True)
    avatar_url = Base64BinaryField(required=False)
    avatar_mime_type = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    friend_count = serializers.IntegerField(read_only=True, required=False)
    event_count = serializers.IntegerField(read_only=True, required=False)

    class Meta:
        model = User
        fields = (
            'email',
            'username',
            'password',
            'bio',
            'avatar_url',
            'avatar_mime_type',
            'friend_count',
            'event_count',
        )