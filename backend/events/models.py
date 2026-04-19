from django.db import models
from django.contrib.gis.db import models as gis_models
from django.conf import settings


class EventType(models.Model):
    """Event type classification"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class Event(models.Model):
    """Event model"""
    # Basic info
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    
    # PostGIS location (combines lat/long)
    location = gis_models.PointField(srid=4326, null=True, blank=True)
    location_name = models.CharField(max_length=255, blank=True, null=True)
    
    # Timing
    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField(blank=True, null=True)
    
    # Capacity
    max_participants = models.IntegerField(blank=True, null=True)
    
    # Status
    is_public = models.BooleanField(default=True)
    requires_approval = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    # Relations
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_events'
    )
    event_type = models.ForeignKey(
        EventType,
        on_delete=models.PROTECT,
        related_name='events'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-starts_at']

    def __str__(self):
        return f"{self.title}"
