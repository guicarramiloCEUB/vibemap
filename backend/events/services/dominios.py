from events.models import EventType



class EventTypeService:
    
    def list_event_types():
        qs = EventType.objects.all()

        return qs