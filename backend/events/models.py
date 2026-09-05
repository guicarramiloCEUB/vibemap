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

    STATUS_CHOICES = [
        ('PENDING', 'Pendente'),
        ('APPROVED', 'Aprovado'),
        ('REJECTED', 'Rejeitado'),
    ]
    """Event model"""
    # Basic info
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    
    # PostGIS location (combines lat/long)
    location = gis_models.PointField(srid=4326, null=True, blank=True)
    location_name = models.CharField(max_length=255, blank=True, null=True)
    
    # Timing
    starts_at = models.DateTimeField(null=True, blank=True)
    ends_at = models.DateTimeField(blank=True, null=True)
    
    # Capacity
    max_participants = models.IntegerField(blank=True, null=True)
    
    # Status
    is_public = models.BooleanField(default=True)
    requires_approval = models.BooleanField(default=False)
    status = models.CharField(
        max_length=10, 
        choices=STATUS_CHOICES, 
        default='PENDING'
    )
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
    
class EventVote(models.Model):
    """Model to represent a user's vote on an event"""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='event_votes'
    )
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='votes'
    )
    is_confirmed = models.BooleanField()  # True for upvote, False for downvote
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'event')  # Ensure a user can only vote once per event

    def __str__(self):
        return f"{self.user} voted {'up' if self.vote else 'down'} on {self.event}"
