from events.models import Event


class EventService:
    
    @staticmethod
    def create_event(user, data):
        """
        Create a new event
        
        Args:
            user: Creator user instance
            data: Dictionary with event data (title, description, location, etc)
        
        Returns:
            Event instance
        """
        return Event.objects.create(creator=user, **data)
