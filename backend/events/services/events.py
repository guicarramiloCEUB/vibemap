import json
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from events.models import Event
from events.serializers.events import EventSerializer
from django.utils import timezone
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from django.db.models import Q


class EventService:
    
    @staticmethod
    def create_event(user, data):
        """
        Create a new event
        
        Args:
            user: Creator user instance
            data: Dictionary with event data (title, description, location, etc)
        
        Returns:
            Event instance
        """
        # Preencher starts_at com horário atual
        data['starts_at'] = timezone.now()
        event = Event.objects.create(creator=user, **data)
        
        # 🔄 Broadcast do novo evento via WebSocket
        try:
            channel_layer = get_channel_layer()
            event_serializer = EventSerializer(event)
            
            # Envia mensagem ao grupo "events"
            async_to_sync(channel_layer.group_send)(
                'events',  # Nome do grupo
                {
                    'type': 'event_created',  # Chama o método event_created() no consumer
                    'event': event_serializer.data,
                }
            )
            print(f"📢 WebSocket broadcast: Novo evento '{event.title}' criado!")
        except Exception as e:
            print(f"⚠️ Erro ao fazer broadcast do evento: {e}")
        
        return event
    
    @staticmethod
    def get_nearby_events(latitude, longitude, radius_meters):
        """
        Buscar eventos dentro de um raio especificado usando PostGIS ST_DWithin
        
        Args:
            latitude: Latitude do ponto de referência
            longitude: Longitude do ponto de referência
            radius_meters: Raio em metros
        
        Returns:
            QuerySet de eventos ordenados por distância
        """
        # Criar ponto de referência (GeoJSON format: [lng, lat])
        user_location = Point(longitude, latitude, srid=4326)
        
        # QuerySet com ST_DWithin (distância em metros)
        events = Event.objects.filter(
            location__distance_lte=(user_location, radius_meters)
        ).annotate(
            distance=Distance('location', user_location)
        ).order_by('distance').filter(
            is_active=True
        )
        
        return events
