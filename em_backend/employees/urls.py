from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmployeeViewSet, DepartmentViewSet,RoleViewSet
from auth.views import LoginView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from auth.views import CustomTokenObtainPairView
from . import views

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet, basename='employee')
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'users', views.UserViewSet)
router.register(r'roles', RoleViewSet)

urlpatterns = [
    path('login/',LoginView.as_view(), name='login'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]