# admin.py
from django.contrib import admin
from .models import LeaveRequest, LeaveType

class LeaveRequestAdmin(admin.ModelAdmin):
    list_display = ('employee', 'leave_type', 'start_date', 'end_date', 'status')
    list_filter = ('status', 'leave_type')
    search_fields = ('employee__user__username', 'employee__user__email')

class LeaveTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')

admin.site.register(LeaveRequest, LeaveRequestAdmin)
admin.site.register(LeaveType, LeaveTypeAdmin)