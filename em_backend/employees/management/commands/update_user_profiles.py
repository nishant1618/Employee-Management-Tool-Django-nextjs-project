from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from employees.models import UserProfile, Role, Employee

class Command(BaseCommand):
    help = 'Update UserProfile table with existing usernames and roles from employees table'
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from employees.models import Employee, UserProfile

class Command(BaseCommand):
    help = 'Update UserProfile table with existing usernames and roles from employees table'

    def handle(self, *args, **kwargs):
        for employee in Employee.objects.all():
            user_profile, created = UserProfile.objects.get_or_create(user=employee.user)
            user_profile.role = employee.role
            user_profile.save()
            self.stdout.write(self.style.SUCCESS(f'Successfully updated UserProfile for {employee.user.username}'))
