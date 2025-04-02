from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    date_of_birth = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.username

class Club(models.Model):
    name = models.CharField(max_length=100, Unique=True)
    members= models.ManyToManyField(CustomUser, related_name='clubs')
    description = models.TextField()

    def __str__(self):
        return self.name
    
class Event(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    date = models.DateTimeField()
    club = models.ForeignKey(Club, related_name='events', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.title} - {self.club.name}"

