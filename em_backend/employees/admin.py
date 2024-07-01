# admin.py
from django.contrib import admin
from .models import Employee, Department,Role

class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('user', 'department')

class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
class RoleAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')

admin.site.register(Employee, EmployeeAdmin)
admin.site.register(Department, DepartmentAdmin)
admin.site.register(Role, RoleAdmin)