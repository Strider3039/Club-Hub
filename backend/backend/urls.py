from django.contrib import admin
from django.urls import path
from . import views
from .views import (
    FriendshipView, FriendListView, ClubListView, PendingFriendRequestsView,
    ClubEventsView, ClubJoinView, AnnouncementView, CommentView, ReplyView, LikeToggleView
)

urlpatterns = [
    path('admin/', admin.site.urls),  # Admin URL

    # Authorization URLs
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    path('delete-account/', views.DeleteAccountView.as_view(), name='delete-account'),

    # Club URLs
    path('clubs/', views.ClubRegistrationView.as_view(), name='club-register'),
    path("clubs/list/", ClubListView.as_view()),
    path('clubs/events/', ClubEventsView.as_view(), name='club-events'),
    path('clubs/join/<int:club_id>/', ClubJoinView.as_view(), name='club-join'),
    path('clubs/delete/<int:club_id>/', views.ClubDeleteView.as_view(), name='club-delete'),
    path('clubs/update/<int:club_id>/', views.ClubUpdateView.as_view(), name='club-update'),
    path('clubs/<int:club_id>/', views.ClubDetailView.as_view(), name='club-detail'),
    # path('clubs/announcements/<int:club_id>/', views.AnnouncementListView.as_view(), name='club-announcements'),

    # Friends URLs
    path('friends/', FriendListView.as_view(), name='friend-list'),

    # Membership URLs
    path('membershipList/<int:club_id>/', views.MembershipListView.as_view(), name='membership-list'),
    path('membershipUpdate/<int:club_id>/<int:user_id>/', views.MembershipUpdateView.as_view(), name='membership-update'),
    path('membershipDelete/<int:club_id>/<int:user_id>/', views.MembershipRemoveView.as_view(), name='membership-delete'),

    # Friend Requests URLs
    path('friends/<int:friend_id>/', views.FriendshipView.as_view(), name='friendship-detail'),
    path("friend-requests/", FriendshipView.as_view(), name="friend_requests"),
    path("friend-requests/pending/", PendingFriendRequestsView.as_view(), name="pending-friend-requests"),
    path("friend-requests/<int:pk>/", FriendshipView.as_view(), name="friend_requests_patch"),

    # Announcements
    path('clubs/<int:club_id>/announcements/', AnnouncementView.as_view(), name='announcement-list-create'),
    path('announcements/<int:pk>/', AnnouncementView.as_view(), name='announcement-edit-delete'),

    # Comments and Replies
    path('announcements/<int:announcement_id>/comments/', CommentView.as_view(), name='announcement-comment'),
    path('comments/<int:comment_id>/replies/', ReplyView.as_view(), name='comment-reply'),

    # Likes
    path('announcements/<int:announcement_id>/like/', LikeToggleView.as_view(), name='announcement-like-toggle'),
]
