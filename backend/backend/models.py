from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class CustomUser(AbstractUser):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    date_of_birth = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.username

class Club(models.Model):
    name = models.CharField(max_length=100, unique=True)
    members= models.ManyToManyField(CustomUser, related_name='clubs')
    officers = models.ManyToManyField(CustomUser, related_name='club_officers', blank=True)

    def __str__(self):
        return self.name
    
class Event(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    date = models.DateTimeField()
    club = models.ForeignKey(Club, related_name='events', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.title} - {self.club.name}"

class Friendship(models.Model):
    from_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='sent_friend_requests', on_delete=models.CASCADE
    )
    to_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='received_friend_requests', on_delete=models.CASCADE
    )
    status = models.CharField(max_length=10, choices=[('pending', 'Pending'), ('accepted', 'Accepted')])
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('from_user', 'to_user')

    def str(self):
        return f"{self.from_user} -> {self.to_user} ({self.status})"