from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer
from django.http import HttpResponse
import traceback

def home(request):
    return HttpResponse("Welcome to the ClubHub!")

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                refresh = RefreshToken.for_user(user)
                return Response({
                    "refresh": str(refresh),
                    "access": str(refresh.access_token)
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                print("🔥 Exception during register:", str(e))
                traceback.print_exc()  # Full traceback
                return Response({"error": "Something went wrong."}, status=500)
        print("❌ Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=400)

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
