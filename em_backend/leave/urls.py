from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LeaveRequestViewSet, LeaveTypeViewSet
from auth.views import LoginView

router = DefaultRouter()
router.register(r'leave-requests', LeaveRequestViewSet, basename='leave-request')
router.register(r'leave-types', LeaveTypeViewSet, basename='leave-type')

urlpatterns = [
    path('login/',LoginView.as_view(), name='login'),
    path('', include(router.urls)),
]