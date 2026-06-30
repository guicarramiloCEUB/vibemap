from django.urls import path, include
from rest_framework.routers import SimpleRouter
from events.resources import EventResources

router = SimpleRouter()
router.register(r'', EventResources, basename='event')

urlpatterns = [
    path('', include(router.urls)),
]
