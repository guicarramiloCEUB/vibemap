from django.contrib.auth import get_user_model

User = get_user_model()

class UserService:
    @staticmethod
    def create_user(data):
        return User.objects.create_user(**data)