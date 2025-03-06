from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser

class CustomUserCreationForm(UserCreationForm):
    pass

    class Meta:
        model = CustomUser
        fields = ("username", "password1", "password2")
