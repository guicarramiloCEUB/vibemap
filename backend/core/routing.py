"""
WebSocket URL routing for Channels
"""

from django.urls import re_path
from events.consumers import EventConsumer

websocket_urlpatterns = [
    re_path(r'ws/events/$', EventConsumer.as_asgi()),
]
