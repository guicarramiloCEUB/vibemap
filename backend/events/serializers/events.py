from rest_framework_gis.serializers import GeoModelSerializer
from rest_framework_gis.fields import GeometryField
from events.models import Event


class CreateEventSerializer(GeoModelSerializer):
    location = GeometryField()
    class Meta:
        model = Event
        geo_field = 'location'
        fields = (
            'title', 'description', 'location', 'location_name',
            'starts_at', 'ends_at', 'max_participants',
            'is_public', 'requires_approval', 'is_active', 'event_type'
        )
