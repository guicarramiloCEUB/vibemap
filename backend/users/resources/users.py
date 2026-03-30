from rest_framework import generics, permissions, status
from rest_framework.response import Response
from users.serializers import RegisterSerializer
from users.services import UserService

class RegisterResource(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = UserService.create_user(serializer.validated_data)
        return Response(RegisterSerializer(user).data, status=status.HTTP_201_CREATED)