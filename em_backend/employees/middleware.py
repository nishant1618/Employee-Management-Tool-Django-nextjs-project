from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth import get_user_model
from .models import UserProfile, Role

User = get_user_model()

class AssignAdminRoleMiddleware(MiddlewareMixin):
    def process_view(self, request, view_func, view_args, view_kwargs):
        if hasattr(request, 'user') and request.user.is_authenticated and request.user.is_superuser:
            try:
                user_profile = UserProfile.objects.get(user=request.user)
            except UserProfile.DoesNotExist:
                # Check if the "Admin" role exists
                role, created = Role.objects.get_or_create(name='Admin')
                # Create the UserProfile with the Admin role
                UserProfile.objects.create(user=request.user, role=role)
        return None