import json
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from events.models import Event, EventVote
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
            'events',
            {
                'type': 'pending_event_created', # O frontend vai escutar isso
                'event': {
                    **event_serializer.data,
                    'location': {
                            'type': 'Point',
                            'coordinates': [event.location.x, event.location.y] 
                    },
                    # Adicione as coordenadas aqui para o frontend calcular a distância
                }
            }
        )
            print(f"📢 WebSocket broadcast: Novo evento '{event.title}' criado!")
        except Exception as e:
            print(f"⚠️ Erro ao fazer broadcast do evento: {e}")
        
        return event
    
    @staticmethod
    def get_nearby_events(latitude, longitude, radius_meters, status='APPROVED'):
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

        # Filtra dinamicamente pelo status passado (PENDING ou APPROVED)
        events = Event.objects.filter(
            location__distance_lte=(user_location, radius_meters),
            #status=status
        ).annotate(
            distance=Distance('location', user_location)
        ).order_by('distance')

        return events
    
    @staticmethod
    def process_vote(user, event_id, is_confirmed):
        event = Event.objects.filter(id=event_id).first()
        if not event:
            return None, "Evento não encontrado."
        
        vote, creates = EventVote.objects.update_or_create(
            user=user,
            event=event,
            defaults={'is_confirmed': is_confirmed}
        )
        
        positive_votes = EventVote.objects.filter(event=event, is_confirmed=True).count()
        negative_votes = EventVote.objects.filter(event=event, is_confirmed=False).count()

        total_votes = positive_votes + negative_votes

        if total_votes >= 3 and event.status == 'PENDING':
            if positive_votes > negative_votes:
                event.status = 'APPROVED'
                event.save()

                channel_layer = get_channel_layer()
                async_to_sync(channel_layer.group_send)(
                    'events',
                    {
                        'type': 'event_approved',
                        'event': {
                            **EventSerializer(event).data,
                            'location': {
                                'type': 'Point',
                                'coordinates': [event.location.x, event.location.y]
                            }
                        },
                    }
                )
            return {'status': 'approved', 'message': 'Evento aprovado e publicado!'}
        
        return {'status': 'voted', 'positive_votes': positive_votes}


