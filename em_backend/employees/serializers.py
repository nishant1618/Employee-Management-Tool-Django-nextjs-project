from rest_framework import serializers
from .models import Employee, Department,Role,User
from django.contrib.auth import get_user_model
from auth.serializers import UserSerializer

class RoleSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = Role
        fields = '__all__'



class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id','name','description']

class EmployeeSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    role = RoleSerializer(read_only=True)
    department = DepartmentSerializer(read_only=True)
    role_id = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(), write_only=True, source='role'
    )
    department_id = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(), write_only=True, source='department'
    )
    

    class Meta:
        model = Employee
        fields = ['id', 'user', 'department', 'role','first_name','last_name','phone_number', 'role_id', 'department_id']
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = UserSerializer().create(user_data)
        employee = Employee.objects.create(user=user, **validated_data)
        return employee
    
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        if user_data:
            user_serializer = UserSerializer(instance.user, data=user_data, partial=True)
            if user_serializer.is_valid(raise_exception=True):
                user_serializer.save()
        instance.role = validated_data.get('role', instance.role)
        instance.department = validated_data.get('department', instance.department)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        
        instance.save()
        return instance
