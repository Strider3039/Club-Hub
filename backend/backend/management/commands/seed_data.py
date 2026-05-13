from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from backend.models import Club, Membership, Event, Announcement, Friendship
from django.utils import timezone
from datetime import timedelta

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed comprehensive demo data for development and testing'

    def handle(self, *args, **kwargs):
        if User.objects.filter(username='demo_user').exists():
            self.stdout.write('Demo data already exists — skipping seed.')
            return

        self.stdout.write('Seeding ClubHub demo data...\n')

        # ============================================================
        # USERS
        # ============================================================
        users_data = [
            {'username': 'demo_user',     'first_name': 'Demo',    'last_name': 'User',     'email': 'demo@clubhub.com',     'date_of_birth': '2000-01-15'},
            {'username': 'alice_johnson', 'first_name': 'Alice',   'last_name': 'Johnson',  'email': 'alice@clubhub.com',    'date_of_birth': '1999-03-22'},
            {'username': 'bob_smith',     'first_name': 'Bob',     'last_name': 'Smith',    'email': 'bob@clubhub.com',      'date_of_birth': '2001-07-08'},
            {'username': 'charlie_davis', 'first_name': 'Charlie', 'last_name': 'Davis',    'email': 'charlie@clubhub.com',  'date_of_birth': '2000-11-30'},
            {'username': 'emma_wilson',   'first_name': 'Emma',    'last_name': 'Wilson',   'email': 'emma@clubhub.com',     'date_of_birth': '1998-05-14'},
            {'username': 'frank_miller',  'first_name': 'Frank',   'last_name': 'Miller',   'email': 'frank@clubhub.com',    'date_of_birth': '2002-02-19'},
            {'username': 'grace_lee',     'first_name': 'Grace',   'last_name': 'Lee',      'email': 'grace@clubhub.com',    'date_of_birth': '2001-09-03'},
            {'username': 'henry_chen',    'first_name': 'Henry',   'last_name': 'Chen',     'email': 'henry@clubhub.com',    'date_of_birth': '1999-12-25'},
            {'username': 'ivy_patel',     'first_name': 'Ivy',     'last_name': 'Patel',    'email': 'ivy@clubhub.com',      'date_of_birth': '2000-06-11'},
            {'username': 'jack_brown',    'first_name': 'Jack',    'last_name': 'Brown',    'email': 'jack@clubhub.com',     'date_of_birth': '2001-04-27'},
        ]

        users = {}
        for data in users_data:
            dob = data.pop('date_of_birth')
            user = User.objects.create_user(password='Demo1234!', **data)
            user.date_of_birth = dob
            user.save()
            users[user.username] = user
        self.stdout.write(self.style.SUCCESS(f'  Created {len(users)} users'))

        # ============================================================
        # CLUBS (one creator each — Club.creator is OneToOne)
        # ============================================================
        clubs_data = [
            ('Chess Club',          'demo_user',     'Strategic board game enthusiasts meeting weekly to play, learn openings, and compete in club tournaments.'),
            ('Photography Society', 'alice_johnson', 'Capture the world through your lens. Weekly group shoots, critique sessions, and an annual exhibition.'),
            ('Coding Club',         'bob_smith',     'Learn to code, build real projects, and collaborate on open-source. All skill levels are welcome.'),
            ('Hiking & Outdoors',   'charlie_davis', 'Explore local trails and nature together. Monthly group hikes, camping trips, and stargazing nights.'),
            ('Film & Cinema Club',  'emma_wilson',   'Watch and discuss classic and contemporary films. Weekly screenings followed by group discussions.'),
            ('Book Club',           'frank_miller',  'A monthly book discussion group exploring fiction, non-fiction, and everything in between.'),
            ('Music Society',       'grace_lee',     'Connect with fellow musicians. Jam sessions, recitals, and collaborative projects every week.'),
            ('Debate Team',         'henry_chen',    'Sharpen your argumentation skills. Weekly practice rounds and inter-club competitions throughout the year.'),
        ]

        clubs = {}
        for name, creator_username, description in clubs_data:
            creator = users[creator_username]
            club = Club.objects.create(name=name, description=description, creator=creator)
            Membership.objects.create(user=creator, club=club, position='President')
            clubs[name] = club
        self.stdout.write(self.style.SUCCESS(f'  Created {len(clubs)} clubs'))

        # ============================================================
        # ADDITIONAL MEMBERSHIPS (varied roles to test permissions)
        # ============================================================
        extra_memberships = [
            # demo_user is the discoverable test account — give them lots of clubs
            ('demo_user',     'Photography Society', 'member'),
            ('demo_user',     'Coding Club',         'officer'),
            ('demo_user',     'Film & Cinema Club',  'Vice President'),
            ('demo_user',     'Book Club',           'member'),

            ('alice_johnson', 'Chess Club',          'Vice President'),
            ('alice_johnson', 'Coding Club',         'member'),
            ('alice_johnson', 'Music Society',       'officer'),

            ('bob_smith',     'Chess Club',          'officer'),
            ('bob_smith',     'Film & Cinema Club',  'member'),
            ('bob_smith',     'Debate Team',         'Vice President'),

            ('charlie_davis', 'Photography Society', 'officer'),
            ('charlie_davis', 'Film & Cinema Club',  'member'),
            ('charlie_davis', 'Book Club',           'member'),

            ('emma_wilson',   'Chess Club',          'member'),
            ('emma_wilson',   'Coding Club',         'member'),
            ('emma_wilson',   'Music Society',       'member'),

            ('frank_miller',  'Hiking & Outdoors',   'officer'),
            ('frank_miller',  'Debate Team',         'member'),

            ('grace_lee',     'Photography Society', 'member'),
            ('grace_lee',     'Film & Cinema Club',  'officer'),
            ('grace_lee',     'Book Club',           'Vice President'),

            ('henry_chen',    'Coding Club',         'Vice President'),
            ('henry_chen',    'Chess Club',          'member'),

            ('ivy_patel',     'Hiking & Outdoors',   'Vice President'),
            ('ivy_patel',     'Music Society',       'member'),
            ('ivy_patel',     'Book Club',           'officer'),

            ('jack_brown',    'Debate Team',         'officer'),
            ('jack_brown',    'Photography Society', 'member'),
            ('jack_brown',    'Music Society',       'Vice President'),
        ]

        for username, club_name, position in extra_memberships:
            Membership.objects.get_or_create(
                user=users[username],
                club=clubs[club_name],
                defaults={'position': position},
            )
        self.stdout.write(self.style.SUCCESS(f'  Created {len(extra_memberships)} additional memberships'))

        # ============================================================
        # EVENTS (mix of past and upcoming dates for calendar testing)
        # ============================================================
        now = timezone.now()
        events_data = [
            # Past events (test historical data)
            ('Spring Kickoff Tournament', 'Casual rapid chess tournament to start the semester.',                                     now - timedelta(days=14), 'Chess Club'),
            ('Black & White Photo Walk',  'Group shoot in monochrome — focus on contrast and shadow.',                                now - timedelta(days=21), 'Photography Society'),
            ('JavaScript Basics Workshop','Intro session on JS fundamentals: variables, functions, and async/await.',                 now - timedelta(days=7),  'Coding Club'),
            ('Forest Trail Hike',         'Gentle 5-mile group hike. Beginner-friendly.',                                              now - timedelta(days=10), 'Hiking & Outdoors'),
            ('Hitchcock Retrospective',   'Watched Vertigo and Rear Window. Great turnout!',                                           now - timedelta(days=18), 'Film & Cinema Club'),

            # Upcoming events (test calendar and event creation)
            ('Club Championship',         'Annual chess tournament. Prizes for the top 3 finishers.',                                  now + timedelta(days=7),  'Chess Club'),
            ('Beginner Workshop',         'Learn essential openings and endgame tactics. No experience needed.',                       now + timedelta(days=21), 'Chess Club'),
            ('Landscape Photo Walk',      'Group shoot through Riverside Park. Practice wide-angle and golden-hour techniques.',       now + timedelta(days=3),  'Photography Society'),
            ('Portrait Workshop',         'Studio lighting and portrait techniques with live models.',                                  now + timedelta(days=18), 'Photography Society'),
            ('Spring Hackathon',          '24-hour coding challenge. Build something awesome with a team!',                            now + timedelta(days=10), 'Coding Club'),
            ('React Workshop',            'Intro to modern front-end development: React hooks, state, and API calls.',                 now + timedelta(days=24), 'Coding Club'),
            ('Spring Trail Hike',         'Moderate 8-mile hike through the state forest. Bring water and sturdy footwear.',           now + timedelta(days=5),  'Hiking & Outdoors'),
            ('Night Sky Camping',         'Overnight camping trip with guided stargazing. Telescopes provided. Limited spots!',         now + timedelta(days=35), 'Hiking & Outdoors'),
            ('Kubrick Screening',         "Screening of 2001: A Space Odyssey followed by discussion on themes and cinematography.",   now + timedelta(days=2),  'Film & Cinema Club'),
            ('Indie Film Showcase',       'Monthly short-film night featuring international indie films and a Q&A with local makers.', now + timedelta(days=16), 'Film & Cinema Club'),
            ('Monthly Book Discussion',   'This month: "The Midnight Library" by Matt Haig. Bring your thoughts!',                     now + timedelta(days=12), 'Book Club'),
            ('Author Q&A',                'Virtual Q&A session with a local author about the writing process.',                        now + timedelta(days=28), 'Book Club'),
            ('Open Mic Night',            'Acoustic open mic for members. Sign up at the start — all instruments welcome.',            now + timedelta(days=6),  'Music Society'),
            ('Chamber Recital',           'Quarterly chamber music recital. Bring guests! Refreshments after.',                        now + timedelta(days=40), 'Music Society'),
            ('Practice Round',            'Weekly debate practice. Topic: AI policy.',                                                  now + timedelta(days=4),  'Debate Team'),
            ('Inter-Club Tournament',     'Compete against debate teams from other organizations. Day-long event.',                    now + timedelta(days=30), 'Debate Team'),
        ]

        for title, description, date, club_name in events_data:
            Event.objects.create(title=title, description=description, date=date, club=clubs[club_name])
        self.stdout.write(self.style.SUCCESS(f'  Created {len(events_data)} events'))

        # ============================================================
        # ANNOUNCEMENTS
        # ============================================================
        announcements_data = [
            ('Welcome to Chess Club!',     'New members, please introduce yourselves at the next meeting. Boards and clocks are provided.',           now - timedelta(days=30), 'Chess Club'),
            ('Tournament Sign-ups Open',   'Sign up for the Club Championship before the deadline. First prize: $100 voucher!',                       now - timedelta(days=3),  'Chess Club'),
            ('Rating System Update',       'We are switching to ELO-based ranking starting next month. See the website for details.',                  now - timedelta(days=10), 'Chess Club'),

            ('New Equipment Available',    'Two new tripods and a softbox kit are now available for member checkout. Reserve via the form.',           now - timedelta(days=5),  'Photography Society'),
            ('Exhibition Submissions',     'Annual member exhibition submissions are open. Limit 3 photos per member. Deadline: end of month.',         now - timedelta(days=12), 'Photography Society'),

            ('Hackathon Sponsors Needed',  'We are looking for company sponsors for the Spring Hackathon. Reach out if you have leads!',                now - timedelta(days=2),  'Coding Club'),
            ('Open-Source Project Kickoff','Join our new open-source club project — a community event-planning app. Weekly stand-ups Wednesdays.',     now - timedelta(days=8),  'Coding Club'),
            ('GitHub Org Migration',       'All club projects are moving to a new GitHub organization. Members will be invited via email.',             now - timedelta(days=20), 'Coding Club'),

            ('Safety Reminder',            'Reminder: bring at least 2 liters of water and proper footwear for any hike. Check weather beforehand.',    now - timedelta(days=4),  'Hiking & Outdoors'),
            ('Trip Permits Approved',      'Permits for the spring camping trip have been approved! We can take up to 25 members.',                     now - timedelta(days=15), 'Hiking & Outdoors'),

            ('Theme Voting Open',          'Vote on next month\'s theme: French New Wave, Korean Cinema, or 80s Sci-Fi. Polls close Sunday.',           now - timedelta(days=1),  'Film & Cinema Club'),
            ('New Streaming Account',      'Members can now access our shared streaming account for club screening prep. Credentials in member chat.', now - timedelta(days=11), 'Film & Cinema Club'),

            ('Reading Schedule Posted',    'The reading schedule for the next quarter is now available. Books are at the library reserve desk.',        now - timedelta(days=6),  'Book Club'),
            ('Guest Author Confirmed',     'We have confirmed a guest author for next month\'s Q&A — details coming soon!',                              now - timedelta(days=14), 'Book Club'),

            ('Practice Room Reserved',     'We have the main practice room reserved every Tuesday evening for the rest of the semester.',               now - timedelta(days=9),  'Music Society'),
            ('Spring Recital Sign-up',     'If you want to perform at the spring recital, sign up by Friday. Bring sheet music if you have it.',         now - timedelta(days=3),  'Music Society'),

            ('Topic for Practice Round',   'This week\'s topic: "Should AI be regulated as a public utility?" Prepare both sides.',                      now - timedelta(days=2),  'Debate Team'),
            ('Tournament Registration',    'The inter-club tournament registration is open. We need at least 8 members to field a full team.',          now - timedelta(days=18), 'Debate Team'),
        ]

        for title, description, date, club_name in announcements_data:
            Announcement.objects.create(title=title, description=description, date=date, club=clubs[club_name])
        self.stdout.write(self.style.SUCCESS(f'  Created {len(announcements_data)} announcements'))

        # ============================================================
        # FRIENDSHIPS (accepted)
        # ============================================================
        accepted_pairs = [
            ('demo_user',     'alice_johnson'),
            ('demo_user',     'bob_smith'),
            ('demo_user',     'emma_wilson'),
            ('alice_johnson', 'charlie_davis'),
            ('alice_johnson', 'grace_lee'),
            ('bob_smith',     'emma_wilson'),
            ('bob_smith',     'henry_chen'),
            ('charlie_davis', 'emma_wilson'),
            ('charlie_davis', 'frank_miller'),
            ('grace_lee',     'ivy_patel'),
            ('henry_chen',    'jack_brown'),
        ]

        for from_username, to_username in accepted_pairs:
            Friendship.objects.create(
                from_user=users[from_username],
                to_user=users[to_username],
                status='accepted',
            )

        # ============================================================
        # PENDING FRIEND REQUESTS (so the Accept flow can be tested)
        # demo_user receives requests from other users.
        # ============================================================
        pending_pairs = [
            ('grace_lee',    'demo_user'),
            ('frank_miller', 'demo_user'),
            ('ivy_patel',    'demo_user'),
            ('jack_brown',   'alice_johnson'),
            ('henry_chen',   'emma_wilson'),
        ]

        for from_username, to_username in pending_pairs:
            Friendship.objects.create(
                from_user=users[from_username],
                to_user=users[to_username],
                status='pending',
            )
        self.stdout.write(self.style.SUCCESS(
            f'  Created {len(accepted_pairs)} accepted friendships and {len(pending_pairs)} pending requests'
        ))

        # ============================================================
        # SUMMARY
        # ============================================================
        self.stdout.write('\n' + '=' * 60)
        self.stdout.write(self.style.SUCCESS('Demo data seeded successfully!'))
        self.stdout.write('=' * 60)
        self.stdout.write('\nTest accounts (all use password: Demo1234!)\n')
        self.stdout.write('  Primary demo account:')
        self.stdout.write('    username: demo_user')
        self.stdout.write('    - President of Chess Club')
        self.stdout.write('    - Vice President of Film & Cinema Club')
        self.stdout.write('    - Officer in Coding Club')
        self.stdout.write('    - Member of Photography Society, Book Club')
        self.stdout.write('    - Has 3 pending friend requests')
        self.stdout.write('\n  Other test accounts:')
        for u in users_data:
            self.stdout.write(f'    {u["username"]}')
        self.stdout.write('')
