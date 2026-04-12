"""
WebSocket consumers for real-time events and chat
"""

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async


class EventConsumer(AsyncWebsocketConsumer):
    """
    Consumer for real-time event streaming
    """
    
    async def connect(self):
        await self.channel_layer.group_add("events", self.channel_name)
        await self.accept()
    
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("events", self.channel_name)
    
    async def receive(self, text_data):
        """Receive message from WebSocket"""
        data = json.loads(text_data)
        await self.channel_layer.group_send(
            "events",
            {
                "type": "event.message",
                "message": data
            }
        )
    
    async def event_message(self, event):
        """Handle event messages"""
        await self.send(text_data=json.dumps(event["message"]))


class ChatConsumer(AsyncWebsocketConsumer):
    """
    Consumer for event chat
    """
    
    async def connect(self):
        self.event_id = self.scope['url_route']['kwargs']['event_id']
        self.room_group_name = f'chat_{self.event_id}'
        
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
    
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
    
    async def receive(self, text_data):
        """Receive chat message from WebSocket"""
        data = json.loads(text_data)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat.message",
                "message": data,
                "sender": self.scope["user"].id if self.scope["user"].is_authenticated else None
            }
        )
    
    async def chat_message(self, event):
        """Handle chat messages"""
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender": event["sender"]
        }))
