from django.db import transaction
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from events.serializers import EventSerializer, EventTypeSerializer
from events.services import EventService, EventTypeService


class EventResources(viewsets.ViewSet):
    permission_classes = (permissions.IsAuthenticated,)

    @transaction.atomic
    @action(detail=False, methods=['post'], url_path='criar_evento')
    def create_event(self, request):
        serializer = EventSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        event = EventService.create_event(request.user, serializer.validated_data)
        return Response(EventSerializer(event).data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], url_path='listar_tipos_eventos')
    def list_event_types(self, request):
        event_types = EventTypeService.list_event_types()
        return Response(EventTypeSerializer(event_types, many=True).data)