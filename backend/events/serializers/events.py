from rest_framework_gis.serializers import GeoModelSerializer
from rest_framework_gis.fields import GeometryField
from events.models import Event, EventType
from rest_framework import serializers


class EventSerializer(GeoModelSerializer):
    location = GeometryField()
    class Meta:
        model = Event
        geo_field = 'location'
        fields = (
            'id', 'title', 'description', 'location', 'location_name',
            'starts_at', 'ends_at', 'max_participants',
            'is_public', 'requires_approval', 'is_active', 'event_type', 'creator'
        )
        read_only_fields = ('id', 'starts_at', 'creator', 'created_at', 'updated_at')

class EventTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventType
        fields = ('id', 'name', 'description')
