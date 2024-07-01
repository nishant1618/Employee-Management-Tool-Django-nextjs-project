from rest_framework import permissions

class IsAdminOrManagerPermission(permissions.BasePermission):
    """
    Allows access only to admin and manager roles.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['Admin', 'Manager']