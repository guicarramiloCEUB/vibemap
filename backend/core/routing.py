"""
WebSocket URL routing for Channels
"""

from django.urls import re_path
from events.consumers import EventConsumer, ChatConsumer

websocket_urlpatterns = [
    # WebSocket routes for events and chat
    re_path(r'^ws/events/$', EventConsumer.as_asgi()),
    re_path(r'^ws/chat/(?P<event_id>\d+)/$', ChatConsumer.as_asgi()),
]
