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
    # get the officers of the club using the primary key
    officers = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.all(), required=False)

    class Meta:
        model = Club
        fields = ['id', 'name', 'description', 'members']


    def create(self, validated_data):
        # get the request from context
        request = self.context.get('request')
        # set creator to the user making the request
        creator = request.user if request else None

        # pop the members and officers from the validated data
        members = validated_data.pop('members', [])
        officers = validated_data.pop('officers', [])

        # create the club with the validated data
        club = Club.objects.create(**validated_data)

        # Ensure creator is in both lists
        if creator and creator not in members:
            members.append(creator)
        if creator and creator not in officers:
            officers.append(creator)

        # set the members and officers of the club
        club.members.set(members)
        club.officers.set(officers)

        return club