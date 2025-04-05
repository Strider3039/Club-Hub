from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Club, Event
from .models import Friendship
from .models import CustomUser

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'email', 'date_of_birth', 'username', 'password']

    def create(self, validated_data):
        date_of_birth = validated_data.pop('date_of_birth', None)
        user = User.objects.create_user(**validated_data)
        if date_of_birth:
            user.date_of_birth = date_of_birth
            user.save()
        return user

class ClubSerializer(serializers.ModelSerializer):
    # get the members of the club using the primary key
    members = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.all())
    # get the officers of the club using the primary key
    officers = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.all(), required=False)

    class Meta:
        model = Club
        fields = ['id', 'name', 'description', 'members', 'officers']


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
    
class UserSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class FriendshipSerializer(serializers.ModelSerializer):
    # Represent the sender and receiver as brief user objects (read-only)
    from_user = UserSummarySerializer(read_only=True)
    to_user = UserSummarySerializer(read_only=True)

    # Client provides only the ID of the recipient when sending request
    to_user_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Friendship
        # These are the fields exposed in the API
        fields = ['id', 'from_user', 'to_user', 'to_user_id', 'status', 'created_at']
        # These fields are controlled by the system, not the user
        read_only_fields = ['status', 'created_at']

    def validate(self, data):
        # Grab the user sending the request (from token/session context)
        from_user = self.context['request'].user
        to_user_id = data['to_user_id']

        # Prevent sending a request to someone you already requested
        if Friendship.objects.filter(from_user=from_user, to_user_id=to_user_id).exists():
            raise serializers.ValidationError("Friend request already sent.")

        # Prevent sending a request to yourself
        if from_user.id == to_user_id:
            raise serializers.ValidationError("You cannot add yourself.")

        return data

    def create(self, validated_data):
        # Sender is inferred from auth context
        from_user = self.context['request'].user

        # Recipient is looked up by ID
        to_user = User.objects.get(id=validated_data['to_user_id'])

        # Create a new pending friendship request
        return Friendship.objects.create(
            from_user=from_user,
            to_user=to_user,
            status='pending'
        )