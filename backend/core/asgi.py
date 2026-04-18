"""
ASGI config for core project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Initialize Django ASGI application early to ensure it's loaded
django_asgi_app = get_asgi_application()

# Try to load Channels WebSocket routing, fallback to pure ASGI if needed
try:
    from channels.routing import ProtocolTypeRouter, URLRouter
    from channels.auth import AuthMiddlewareStack
    from core.routing import websocket_urlpatterns

    application = ProtocolTypeRouter({
        # Django's ASGI application to handle traditional HTTP requests
        'http': django_asgi_app,
        
        # WebSocket chat handler with authentication
        'websocket': AuthMiddlewareStack(
            URLRouter(
                websocket_urlpatterns
            )
        ),
    })
except ImportError:
    # Fallback for development or environments without Channels
    application = django_asgi_app
