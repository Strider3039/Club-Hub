from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer
from django.http import HttpResponse
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.hashers import make_password
from .serializers import ClubSerializer
from .serializers import EventSerializer
from .serializers import FriendshipSerializer
from .models import Friendship
from .models import Club
from .models import Event
from .models import Membership
from django.db.models import Q

def home(request):
    return HttpResponse("Welcome to the ClubHub!")

class RegisterView(APIView):
    permission_classes = [AllowAny] # allow any user to register
    def post(self, request):
        # get the data from the request
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            # Save the user if the serializer is valid
            serializer.save()
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        # Return validation errors if invalid
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)

        if user:
            # Generate refresh and access tokens for valid login
            refresh = RefreshToken.for_user(user)
            
            # Serialize user info
            user_data = RegisterSerializer(user).data

            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": user_data 
            })

        # Return error for invalid credentials
        return Response({"error": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class ChangePasswordView(APIView):
    
    def post(self, request):
        user = request.user
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        if not user.check_password(current_password):
            return Response({"error": "Current password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({"error": "New passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)
    
class DeleteAccountView(APIView):
    
    def post(self, request):
        user = request.user
        password_confirmation = request.data.get("password_confirmation")

        if not user.check_password(password_confirmation):
            return Response({"error": "Password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)

        user.delete()
        return Response({"message": "Account deleted successfully"}, status=status.HTTP_200_OK)
    
class ClubRegistrationView(APIView):
    
    def post(self, request):
        creator = request.user

        # check if the user already created a club
        if hasattr(creator, 'created_club'):
            return Response({"message": "You have already registered a club."}, status=400)

        serializer = ClubSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(creator=creator)
            return Response({"message": "Club created successfully"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Lists all clubs
class ClubListView(APIView):

    def get(self, request):
        clubs = Club.objects.all()
        serializer = ClubSerializer(clubs, many=True, context={'request': request})
        return Response(serializer.data)

class ClubEventsView(APIView):

    def get(self, request):
        club_id = request.query_params.get("club_id")
        if not club_id:
            return Response({"error": "club_id is required in query parameters."}, status=400)

        club = Club.objects.filter(pk=club_id).first()
        if not club:
            return Response({"error": "Club not found."}, status=404)

        events = club.events.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # This assumes the EventSerializer includes the `club` field
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ClubJoinView(APIView):

    def post(self, request, *args, **kwargs):
        club_id = kwargs.get("club_id") # get from URL

        if not club_id:
            return Response({"error": "club_id is required."}, status=400)

        try:
            club = Club.objects.get(pk=club_id)
        except Club.DoesNotExist:
            return Response({"error": "Club not found."}, status=404)
        
        # Check if the user is already a member of the club
        if Membership.objects.filter(user=request.user, club=club).exists():
            return Response({"error": "You are already a member of this club."}, status=400)
        
        # Create a new membership
        Membership.objects.create(user=request.user, club=club, position='member')
        return Response({"message": "You have successfully joined the club."}, status=201)

        
# Handles sending and accepting friend requests
class FriendshipView(APIView):

    # POST /friend-requests/
    def post(self, request):
        serializer = FriendshipSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # PATCH /friend-requests/<pk>/
    def patch(self, request, pk):
        try:
            friendship = Friendship.objects.get(pk=pk, to_user=request.user)
            friendship.status = 'accepted'
            friendship.save()
            return Response({'message': 'Friend request accepted.'})
        except Friendship.DoesNotExist:
            return Response({'error': 'Request not found or unauthorized.'}, status=404)

    # GET /friends/<friend_id>/
    def get(self, request, friend_id):
        user = request.user
        try:
            friendship = Friendship.objects.get(
                Q(from_user=user, to_user_id=friend_id) |
                Q(from_user_id=friend_id, to_user=user),
                status='accepted'
            )
            friend = friendship.to_user if friendship.from_user == user else friendship.from_user
            data = {
                'id': friend.id,
                'username': friend.username,
                'first_name': friend.first_name,
                'last_name': friend.last_name,
                'email': friend.email,
                'clubs': [club.name for club in friend.clubs.all()]
            }
            return Response(data)
        except Friendship.DoesNotExist:
            return Response({'error': 'You are not friends with this user.'}, status=404)

    # DELETE /friends/<friend_id>/
    def delete(self, request, friend_id):
        user = request.user
        try:
            friendship = Friendship.objects.get(
                Q(from_user=user, to_user_id=friend_id) |
                Q(from_user_id=friend_id, to_user=user),
                status='accepted'
            )
            friendship.delete()
            return Response({'message': 'Friend removed successfully.'}, status=status.HTTP_204_NO_CONTENT)
        except Friendship.DoesNotExist:
            return Response({'error': 'Friendship not found.'}, status=404)



# Lists all accepted friends for the current user
class FriendListView(APIView):
    
    # GET /friends/
    def get(self, request):
        user = request.user  # Current authenticated user

        # Find all accepted friendships where the user is either side of the relationship
        friendships = Friendship.objects.filter(
            Q(from_user=user) | Q(to_user=user),
            status='accepted'
        )

        # Prepare a simplified list of friend info (excluding current user)
        friends = []
        for f in friendships:
            # Determine the "other" user in the friendship
            friend = f.to_user if f.from_user == user else f.from_user
            friends.append({
                'id': friend.id,
                'username': friend.username,
                'clubs': [club.id for club in friend.clubs.all()]  # Assuming a many-to-many relationship
            })

        return Response(friends)

class PendingFriendRequestsView(APIView):
    
    

    # GET /friend-requests/pending/
    def get(self, request):
        user = request.user

        # Friend requests sent TO this user that are still pending
        pending_requests = Friendship.objects.filter(to_user=user, status='pending')

        data = [
            {
                "id": f.id,
                "from_user": {
                    "id": f.from_user.id,
                    "username": f.from_user.username
                },
                "created_at": f.created_at,
            }
            for f in pending_requests
        ]

        return Response(data, status=200)
