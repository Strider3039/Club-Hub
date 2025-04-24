from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Club, Event, Friendship, CustomUser, Membership, Announcement, Comment, Reply, Like

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
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    club = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Membership
        fields = ['id', 'user', 'club', 'position']

class ClubSerializer(serializers.ModelSerializer):
    creator = serializers.PrimaryKeyRelatedField(read_only=True)
    events = EventSerializer(many=True, read_only=True)
    is_member = serializers.SerializerMethodField()

    class Meta:
        model = Club
        fields = ['id', 'name', 'description', 'creator', 'is_member', 'events']

    def get_is_member(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Membership.objects.filter(user=request.user, club=obj).exists()
        return False

    def create(self, validated_data):
        request = self.context.get('request')
        creator = request.user if request else None

        validated_data.pop('creator', None)
        club = Club.objects.create(creator=creator, **validated_data)

        if creator:
            Membership.objects.create(user=creator, club=club, position='President')

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

        data['to_user'] = to_user
        return data

    def create(self, validated_data):
        from_user = self.context['request'].user
        to_user = validated_data['to_user']
        return Friendship.objects.create(from_user=from_user, to_user=to_user, status='pending')

class LikeSerializer(serializers.ModelSerializer):
    user = UserSummarySerializer(read_only=True)

    class Meta:
        model = Like
        fields = ['id', 'user']

class ReplySerializer(serializers.ModelSerializer):
    user = UserSummarySerializer(read_only=True)

    class Meta:
        model = Reply
        fields = ['id', 'user', 'content', 'created_at']

class CommentSerializer(serializers.ModelSerializer):
    user = UserSummarySerializer(read_only=True)
    replies = ReplySerializer(many=True, read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'content', 'created_at', 'replies']

class AnnouncementSerializer(serializers.ModelSerializer):
    author = UserSummarySerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    likes = LikeSerializer(many=True, read_only=True)

    class Meta:
        model = Announcement
        fields = ['id', 'title', 'content', 'club', 'author', 'created_at', 'updated_at', 'comments', 'likes']

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['author'] = request.user
        return Announcement.objects.create(**validated_data)
