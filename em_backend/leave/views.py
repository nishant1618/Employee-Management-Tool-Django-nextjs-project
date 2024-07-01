from rest_framework import viewsets
from .models import LeaveRequest, LeaveType
from .serializers import LeaveRequestSerializer, LeaveTypeSerializer
from rest_framework.permissions import IsAuthenticated

class LeaveRequestViewSet(viewsets.ModelViewSet):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated]

    

class LeaveTypeViewSet(viewsets.ModelViewSet):
    queryset = LeaveType.objects.all()
    serializer_class = LeaveTypeSerializer
    permission_classes = [IsAuthenticated]