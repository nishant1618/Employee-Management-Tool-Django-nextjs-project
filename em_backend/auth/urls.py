from django.urls import path
from .views import LoginView
from .views import CustomTokenObtainPairView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),

]