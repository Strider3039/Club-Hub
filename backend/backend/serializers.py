from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Club, Event
from .models import Friendship
from .models import CustomUser
from .models import Membership

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'email', 'date_of_birth', 'username', 'password']

    def create(self, validated_data):
        date_of_birth = validated_data.pop('date_of_birth', None)
        user = User.objects.create_user(**validated_data)
        if date_of_birth:
            user.date_of_birth = date_of_birth
            user.save()
        return user

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'date', 'club']

class MembershipSerializer(serializers.ModelSerializer):
    # get the user using the primary key
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    # get the club using the primary key
    club = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Membership
        fields = ['id', 'user', 'club', 'position']

class ClubSerializer(serializers.ModelSerializer):
    # get the creator of the club using the primary key
    creator = serializers.PrimaryKeyRelatedField(read_only=True)
    # get memberships using the primary key

    # get the events of the club using the event serializer
    events = EventSerializer(many=True, read_only=True)  # Use nested serializer to show full event details
    # check if the user is a member of the club
    is_member = serializers.SerializerMethodField()

    class Meta:
        model = Club
        fields = ['id', 'name', 'description', 'creator', 'is_member', 'events']

    def get_is_member(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user in obj.members.all()
        return False

    def create(self, validated_data):
        # get the request from context
        request = self.context.get('request')
        # set creator to the user making the request
        creator = request.user if request else None

        # pop the members and officers from the validated data
        members = validated_data.pop('members', [])
        officers = validated_data.pop('officers', [])
        events = validated_data.pop('events', [])

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
    from_user = UserSummarySerializer(read_only=True)
    to_user = UserSummarySerializer(read_only=True)

    friendUsername = serializers.CharField(write_only=True)

    class Meta:
        model = Friendship
        fields = ['id', 'from_user', 'to_user', 'friendUsername', 'status', 'created_at']
        read_only_fields = ['status', 'created_at']

    def validate(self, data):
        from_user = self.context['request'].user
        friend_username = data.get('friendUsername')

        try:
            to_user = User.objects.get(username=friend_username)
        except User.DoesNotExist:
            raise serializers.ValidationError("User does not exist.")

        if from_user == to_user:
            raise serializers.ValidationError("You cannot add yourself.")

        if Friendship.objects.filter(from_user=from_user, to_user=to_user).exists():
            raise serializers.ValidationError("Friend request already sent.")

        # Add to_user to validated data for use in create()
        data['to_user'] = to_user
        return data

    def create(self, validated_data):
        from_user = self.context['request'].user
        to_user = validated_data['to_user']

        return Friendship.objects.create(
            from_user=from_user,
            to_user=to_user,
            status='pending'
        )
