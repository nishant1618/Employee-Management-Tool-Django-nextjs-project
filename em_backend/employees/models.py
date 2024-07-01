from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE,unique=True)
    role = models.ForeignKey('Role', on_delete=models.SET_NULL, null=True, blank=True)
    def __str__(self):
        return self.user.username

class Role(models.Model):
    name = models.CharField(max_length=50,unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employee')
    department = models.ForeignKey('Department', on_delete=models.SET_NULL, null=True, blank=True,related_name='employee')
    role = models.ForeignKey('Role', on_delete=models.SET_NULL,null=True, blank=True,related_name='user')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)

    permissions = [
            ("view_employee", "Can view employee details"),
            ("change_employee", "Can change employee details"),
            ("submit_leave", "Can submit leave requests"),
            ("view_tasks", "Can view assigned tasks"),
            ("approve_leave", "Can approve leave requests"),
            ("assign_tasks", "Can assign tasks to employees"),
            # Add more custom permissions as needed
    ]
    def __str__(self):
        return f"{self.user.username} - {self.role.name if self.role else 'No role assigned'} - {self.department.name if self.department else 'No department assigned'}"

class Department(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)

    def _str_(self):
        return self.name
    


