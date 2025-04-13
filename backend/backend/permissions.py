def can_remove_club(position):
    return position == 'President'

def can_manage_members(position):
    return position in ['President', 'Vice President']

def can_edit_club_info(position):
    return position in ['President', 'Vice President']

def can_post_events(position):
    return position in ['President', 'Vice President', 'Officer']