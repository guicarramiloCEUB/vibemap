from django.db import transaction
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from events.serializers import CreateEventSerializer
from events.services import EventService


class EventResources(viewsets.ViewSet):
    permission_classes = (permissions.IsAuthenticated,)

    @transaction.atomic
    @action(detail=False, methods=['post'], url_path='criar_evento')
    def create_event(self, request):
        serializer = CreateEventSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        event = EventService.create_event(request.user, serializer.validated_data)
        return Response(CreateEventSerializer(event).data, status=status.HTTP_201_CREATED)
