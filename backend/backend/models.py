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
    description = models.TextField(blank=True)
    creator = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='created_club', null=True)

    def __str__(self):
        return self.name

# create a membership model to link users to clubs
class Membership(models.Model):
    POSITION_CHOICES = [
        ('member', 'Member'),
        ('officer', 'Officer'),
        ('President', 'President'),
        ('Vice President', 'Vice President')
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    club = models.ForeignKey(Club, on_delete=models.CASCADE)
    position = models.CharField(max_length=20, choices=POSITION_CHOICES, default='member')

    # add a unique constraint to prevent duplicate memberships
    class Meta:
        unique_together = ('user', 'club')

    # add a string representation for the membership
    def __str__(self):
        return f"{self.user.username} - {self.club.name} ({self.position})"

class Event(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    date = models.DateTimeField()
    club = models.ForeignKey(Club, on_delete=models.CASCADE, null=True, blank=True)

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