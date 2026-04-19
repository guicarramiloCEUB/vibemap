from django.urls import path
from rest_framework.routers import DefaultRouter
from events.resources import EventResources

router = DefaultRouter()
router.register(r'', EventResources, basename='event')

urlpatterns = router.urls
