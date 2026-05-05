"""
WebSocket Consumers for real-time event updates
"""
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import sync_to_async
from django.core.serializers.json import DjangoJSONEncoder

from .models import Event


class EventConsumer(AsyncWebsocketConsumer):
    """
    Consumer que faz broadcast de eventos novos para todos os clientes conectados.
    
    Fluxo:
    1. Cliente conecta → join ao group "events"
    2. Novo evento criado → backend envia message ao group
    3. Todos recebem via WebSocket
    """
    
    async def connect(self):
        """Chamado quando cliente WebSocket conecta"""
        self.room_group_name = 'events'
        
        # Adiciona este consumer ao group 'events'
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        # Aceita a conexão WebSocket
        await self.accept()
        print(f"✅ Cliente conectado ao WebSocket (group: {self.room_group_name})")
    
    async def disconnect(self, close_code):
        """Chamado quando cliente desconecta"""
        # Remove do group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        print(f"❌ Cliente desconectado do WebSocket")
    
    async def receive(self, text_data):
        """
        Chamado quando cliente envia mensagem via WebSocket.
        Aqui podemos receber eventos e fazer broadcast.
        """
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'new_event':
                # Faz broadcast de novo evento para o group
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'event_created',  # Chama o método abaixo
                        'event': data.get('event'),
                    }
                )
                print(f"📢 Evento broadcasting: {data.get('event', {}).get('title')}")
        except json.JSONDecodeError:
            print("❌ Erro ao parsear JSON do WebSocket")
    
    async def event_created(self, event):
        """
        Chamado quando uma mensagem 'event.created' é enviada ao group.
        Envia a mensagem para o cliente conectado.
        """
        print(f"🔄 event_created chamado no consumer! Event: {event}")
        # event contém: 'type' (já consumido), 'event' (dados)
        try:
            message = json.dumps(
                {
                    'type': 'event_created',
                    'event': event.get('event'),
                },
                cls=DjangoJSONEncoder
            )
            print(f"📤 Enviando mensagem para cliente: {message[:100]}...")
            await self.send(text_data=message)
            print(f"✅ Mensagem enviada com sucesso!")
        except Exception as e:
            print(f"❌ Erro ao enviar mensagem: {e}")
