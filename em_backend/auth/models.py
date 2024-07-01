from django.db import models
from django.contrib.auth.models import AbstractUser
from .models import Role

class User(AbstractUser):
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True)
    email = models.EmailField(unique=True)
# Create your models here.
