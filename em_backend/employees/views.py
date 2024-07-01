from rest_framework import viewsets,status
from rest_framework.permissions import IsAuthenticated,OR
from .models import Employee, Department,User, Role
from .serializers import EmployeeSerializer, DepartmentSerializer, RoleSerializer
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from auth.serializers import UserSerializer
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from rest_framework_simplejwt.authentication import JWTAuthentication
from .permissions import IsAdminOrManagerPermission
from rest_framework.decorators import api_view, permission_classes





class IsAdminOrManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.role.name in ['Admin', 'Manager'])

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = [permissions.IsAuthenticated]

class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = [permissions.IsAuthenticated]
    @action(detail=True, methods=['post'])
    def assign_role(self, request, pk=None):
        try:
            role = self.get_object()
            employee_id = request.data.get('employee_id')
            employee = Employee.objects.get(id=employee_id)
            employee.role = role
            employee.save()

            # Assign permissions based on the role
            assign_permissions(role, employee.user)

            return Response({'message': 'Role assigned successfully'})
        except Employee.DoesNotExist:
            return Response({'error': 'Employee not found'}, status=404)
        except Role.DoesNotExist:
            return Response({'error': 'Role not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=400)

    

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    authentication_classes = (JWTAuthentication,)
    permissions = [IsAdminOrManagerPermission]
    def perform_destroy(self, instance):
        user = instance.user
        super().perform_destroy(instance)
        user.delete()
    def retrieve(self, request, pk=None):
        employee = Employee.objects.get(user=request.user)
        serializer = EmployeeSerializer(employee)
        return Response(serializer.data)
    

   


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = [permissions.IsAuthenticated]


def assign_permissions(role, user):
    if role.name == 'Admin':
        permissions = Permission.objects.all()
        user.user_permissions.set(permissions)
    elif role.name == 'Manager':
        content_type = ContentType.objects.get_for_model(Employee)
        permissions = Permission.objects.filter(
            content_type=content_type,
            codename__in=[
                'view_employee',
                'change_employee',
                'approve_leave',
                'assign_tasks',
            ]
        )
        user.user_permissions.set(permissions)
    elif role.name == 'Employee':
        content_type = ContentType.objects.get_for_model(Employee)
        permissions = Permission.objects.filter(
            content_type=content_type,
            codename__in=[
                'view_employee',
                'submit_leave',
                'view_tasks',
            ]
        )
        user.user_permissions.set(permissions)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_employee(request):
    if request.user.role.name in ['Admin', 'Manager']:
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({"message": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_delete_employee(request, employee_id):
    try:
        employee = Employee.objects.get(id=employee_id)
    except Employee.DoesNotExist:
        return Response({"message": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.user.role.name in ['Admin', 'Manager']:
        if request.method == 'PATCH':
            serializer = EmployeeSerializer(employee, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        elif request.method == 'DELETE':
            employee.delete()
            return Response({"message": "Employee deleted"}, status=status.HTTP_204_NO_CONTENT)
    return Response({"message": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)