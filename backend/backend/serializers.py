from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Club, Event

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'date_of_birth', 'username', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class ClubSerializer(serializers.ModelSerializer):
    # get the members of the club using the primary key
    members = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.all())

    class Meta:
        model = Club
        fields = ['id', 'name', 'description', 'members']


    def create(self, validated_data):
        # get the request object to access the user
        request = self.context.get('request')
        # get the user from the request
        creator = request.user if request else None
        # pop the members from the validated data
        members = validated_data.pop('members', [])
        # create the club object
        club = Club.objects.create(**validated_data)

        # Add creator to members list if not already there
        if creator and creator not in members:
            members.append(creator)
        # set the members of the club
        club.members.set(members)
        return club