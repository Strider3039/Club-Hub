from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer
from django.http import HttpResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.hashers import make_password
from .serializers import ClubSerializer
from .serializers import FriendshipSerializer
from .models import Friendship
from django.db.models import Q

def home(request):
    return HttpResponse("Welcome to the ClubHub!")

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            # Save the user if the serializer is valid
            serializer.save()
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        # Return validation errors if invalid
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)

        if user:
            # Generate refresh and access tokens for valid login
            refresh = RefreshToken.for_user(user)
            return Response({"refresh": str(refresh), "access": str(refresh.access_token)})
        # Return error for invalid credentials
        return Response({"error": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class ChangePasswordView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

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
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        password_confirmation = request.data.get("password_confirmation")

        if not user.check_password(password_confirmation):
            return Response({"error": "Password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)

        user.delete()
        return Response({"message": "Account deleted successfully"}, status=status.HTTP_200_OK)
    

class ClubRegistrationView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # get the user from the request
        serializer = ClubSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            # save the club 
            serializer.save()
            # return success message
            return Response({"message": "Club created successfully"}, status=status.HTTP_201_CREATED)
        # return validation errors if invalid
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Handles sending and accepting friend requests
class FriendshipView(APIView):

    # POST /friend-requests/: Creates a new friend request
    def post(self, request):
        # Deserialize the incoming data (to_user_id) and inject current user into context
        serializer = FriendshipSerializer(data=request.data, context={'request': request})

        # Validate the data and create a new Friendship if valid
        if serializer.is_valid():
            serializer.save()  # creates a 'pending' request from request.user to to_user
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # If the request is invalid, return error details
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # PATCH /friend-requests/<pk>/: Accepts a friend request
    def patch(self, request, pk):
        try:
            # Find the friendship where the current user is the recipient (to_user)
            friendship = Friendship.objects.get(pk=pk, to_user=request.user)
        except Friendship.DoesNotExist:
            # Return error if not found or not authorized
            return Response({'error': 'Request not found or unauthorized.'}, status=404)

        # Accept the friend request
        friendship.status = 'accepted'
        friendship.save()

        return Response({'message': 'Friend request accepted.'})


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
                'username': friend.username
            })

        return Response(friends)