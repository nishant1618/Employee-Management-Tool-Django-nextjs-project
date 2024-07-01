from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from employees.models import UserProfile
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from django.contrib.auth import login

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer




class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            serializer = CustomTokenObtainPairSerializer()
            token = serializer.get_token(user)
            try:
                user_profile = UserProfile.objects.get(user=user)
                role = user_profile.role.name
            except UserProfile.DoesNotExist:
                role = None
            
            # Return token and role in response
            return Response({
                'refresh': str(token),
                'access': str(token.access_token),
                'role': role,  # Include role in response
            })
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

