from django.contrib.auth.models import User
from employees.models import Employee
from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from employees.models import UserProfile

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims
        try:
            user_profile = UserProfile.objects.get(user=user)
            token['role'] = user_profile.role.name
        except UserProfile.DoesNotExist:
            token['role'] = None

        return token
    def validate(self, attrs):
        data = super().validate(attrs)

        # Add custom claims to response data
        try:
            user_profile = UserProfile.objects.get(user=self.user)
            data['role'] = user_profile.role.name  # Include role in response data
        except UserProfile.DoesNotExist:
            data['role'] = None

        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user