from rest_framework import serializers
from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields= ['username', 'email', 'password']
        # make password write only, so it's not returned in the response
        extra_kwargs = {'password': {'write_only': True}} 

    # validate the user data
    def create(self, validated_data):
        # create the user with the validated data
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user