from django.db import transaction
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.gis.geos import Point
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
    
    @action(detail=False, methods=['get'], url_path='nearby')
    def get_nearby_events(self, request):
        """
        Retorna eventos dentro de um raio especificado
        Query params:
            - lat: latitude
            - lng: longitude  
            - radius: raio em metros (default 5000)
        """
        try:
            lat = float(request.query_params.get('lat'))
            lng = float(request.query_params.get('lng'))
            radius = float(request.query_params.get('radius', 5000))
            status_event = request.query_params.get('status', 'APPROVED')  # 5km default
            
            events = EventService.get_nearby_events(lat, lng, radius, status_event)
            serializer = EventSerializer(events, many=True)
            return Response(serializer.data)
        except (ValueError, TypeError) as e:
            return Response(
                {'error': 'Parâmetros inválidos: lat, lng e radius devem ser números'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
    @transaction.atomic
    @action(detail=False, methods=['post'], url_path='registrar_voto')
    def register_vote(self, request):
        event_id = request.data.get('event_id')
        is_confirmed = request.data.get('is_confirmed')

        result = EventService.process_vote(request.user, event_id, is_confirmed)

        return Response(result, status=status.HTTP_200_OK)