# employees/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from employees.models import Employee, UserProfile
from django.db import IntegrityError

@receiver(post_save, sender=Employee)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance.user, role=instance.role)
    else:
        user_profile, created = UserProfile.objects.get_or_create(user=instance.user)
        user_profile.role = instance.role
        user_profile.save()

def create_or_update_user_profile(user, role_name):
    try:
        # Attempt to retrieve existing UserProfile
        profile = UserProfile.objects.get(user=user)
        # Update profile if needed
        profile.role = role_name  # Assuming 'role' is a ForeignKey to Role model
        profile.save()
    except UserProfile.DoesNotExist:
        # Create new UserProfile if it doesn't exist
        profile = UserProfile.objects.create(user=user, role=role_name)
    except IntegrityError as e:
        # Handle integrity error (if necessary)
        print(f"IntegrityError: {e}")
        profile = None
    
    return profile