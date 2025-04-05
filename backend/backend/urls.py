"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from . import views
from .views import FriendshipView
from .views import FriendListView
from .views import ClubListView
from .views import PendingFriendRequestsView


urlpatterns = [
    path('admin/', admin.site.urls),  # Admin URL
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    path('delete-account/', views.DeleteAccountView.as_view(), name='delete-account'),
    path('clubs/', views.ClubRegistrationView.as_view(), name='club-register'),
    path("clubs/list/", ClubListView.as_view()),
    path('friends/<int:friend_id>/', views.FriendshipView.as_view(), name='friendship-detail'),
    path("friend-requests/", FriendshipView.as_view(), name="friend_requests"),
    path('friends/', FriendListView.as_view(), name='friend-list'),
    path("friend-requests/pending/", PendingFriendRequestsView.as_view(), name="pending-friend-requests"),
]   
