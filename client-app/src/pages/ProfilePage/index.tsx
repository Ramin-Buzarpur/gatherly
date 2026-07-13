import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores/rootStore';

type SideTab = 'about' | 'events' | 'followers' | 'following';
type EventTab = 'future' | 'past' | 'hosting';

const ProfilePage = observer(() => {
  const { username } = useParams<{ username: string }>();
  const { profileStore } = useStore();
  const { profile, events, followings, isLoading, isLoadingEvents, isLoadingFollowings, isSubmitting } = profileStore;

  const [sideTab, setSideTab] = useState<SideTab>('about');
  const [eventTab, setEventTab] = useState<EventTab>('future');
  const [isEditing, setIsEditing] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editBio, setEditBio] = useState('');

  useEffect(() => {
    if (username) profileStore.loadProfile(username);
  }, [username]);

  useEffect(() => {
    if (sideTab === 'events' && username)
      profileStore.loadEvents(username, eventTab);
  }, [sideTab, eventTab, username]);

  useEffect(() => {
    if (sideTab === 'followers' && username)
      profileStore.loadFollowings(username, 'followers');
    if (sideTab === 'following' && username)
      profileStore.loadFollowings(username, 'following');
  }, [sideTab, username]);

  const handleEditStart = () => {
    setEditDisplayName(profile?.displayName ?? '');
    setEditBio(profile?.bio ?? '');
    setIsEditing(true);
  };

  const handleEditSubmit = async () => {
    await profileStore.updateProfile({ displayName: editDisplayName, bio: editBio });
    setIsEditing(false);
  };

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center py-40">
        <span className="text-[#14B8A6] text-[20px]">Loading profile...</span>
      </div>
    );
  }

  const sideNavItems: { key: SideTab; label: string; icon: React.ReactNode }[] = [
    {
      key: 'about', label: 'About',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      key: 'events', label: 'Events',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      key: 'followers', label: 'Followers',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      key: 'following', label: 'Following',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-6">

      {/* Header Card */}
      <div className="bg-white rounded-[16px] p-8 flex items-center gap-8" style={{ boxShadow: '4px 4px 8px 0 rgba(0,0,0,0.1)' }}>
        <img
          src={profile.imageUrl || `https://placehold.co/200x200/e2e8f0/64748b?text=${profile.displayName?.charAt(0) ?? 'U'}`}
          alt={profile.displayName}
          className="w-[160px] h-[160px] rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1">
          <h1 className="text-[36px] font-semibold text-[#1F2937] mb-2">
            {profile.displayName ?? profile.username}
          </h1>
          {!profile.isCurrentUser && (
            <span className="inline-block border border-[#14B8A6] text-[#14B8A6] text-[14px] px-4 py-1 rounded-full">
              {profile.isFollowing ? 'following' : 'follow'}
            </span>
          )}
        </div>
        <div className="flex flex-col items-end gap-4">
          <div className="flex gap-10">
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-[14px] text-gray-400">Followers</span>
              <span className="text-[20px] font-medium text-[#1F2937]">{profile.followersCount}</span>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-[14px] text-gray-400">Following</span>
              <span className="text-[20px] font-medium text-[#1F2937]">{profile.followingsCount}</span>
            </div>
          </div>
          {!profile.isCurrentUser && (
            <button
              onClick={() => profileStore.toggleFollow(profile.username)}
              disabled={isSubmitting}
              className={`w-[160px] py-2 rounded-[8px] text-[16px] font-medium border transition-colors ${
                profile.isFollowing
                  ? 'border-[#F59E0B] text-[#F59E0B] hover:bg-amber-50'
                  : 'bg-[#14B8A6] text-white border-[#14B8A6] hover:bg-[#0d9488]'
              }`}
            >
              {profile.isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-[16px] flex overflow-hidden" style={{ boxShadow: '4px 4px 8px 0 rgba(0,0,0,0.1)', minHeight: '400px' }}>

        {/* Side Nav */}
        <div className="w-[260px] flex-shrink-0 border-r border-gray-100 py-4">
          {sideNavItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setSideTab(item.key)}
              className={`w-full flex items-center gap-4 px-6 py-4 text-[18px] transition-colors ${
                sideTab === item.key
                  ? 'bg-[#E6F7F6] text-[#078C80] border-l-4 border-[#078C80]'
                  : 'text-[#6B7280] hover:bg-gray-50'
              }`}
            >
              <span className={sideTab === item.key ? 'text-[#078C80]' : 'text-[#9CA3AF]'}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="flex-1 p-8">

          {/* ABOUT */}
          {sideTab === 'about' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[28px] font-medium text-[#1F2937]">
                  About {profile.displayName ?? profile.username}
                </h2>
                {profile.isCurrentUser && !isEditing && (
                  <button onClick={handleEditStart} className="flex items-center gap-2 text-[#078C80] text-[16px] hover:opacity-70 transition-opacity">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit Profile
                  </button>
                )}
              </div>
              {isEditing ? (
                <div className="flex flex-col gap-4">
                  <p className="text-[14px] text-gray-400 uppercase tracking-wider font-medium">EDIT PROFILE</p>
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-white px-1 text-[12px] text-[#078C80]">Display Name</label>
                    <input value={editDisplayName} onChange={(e) => setEditDisplayName(e.target.value)}
                      className="w-full border border-[#078C80] rounded-[8px] px-4 py-3 text-[16px] outline-none focus:ring-2 focus:ring-[#078C80]/30" />
                  </div>
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-white px-1 text-[12px] text-[#078C80]">Bio</label>
                    <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)}
                      placeholder="Tell us a bit about yourself..." rows={4}
                      className="w-full border border-[#078C80] rounded-[8px] px-4 py-3 text-[16px] outline-none focus:ring-2 focus:ring-[#078C80]/30 resize-none" />
                  </div>
                  <div className="flex justify-end gap-3 mt-2">
                    <button onClick={() => setIsEditing(false)} className="px-6 py-2 rounded-[8px] border border-gray-300 text-[#6B7280] text-[16px] hover:bg-gray-50">Cancel</button>
                    <button onClick={handleEditSubmit} disabled={isSubmitting}
                      className="px-6 py-2 rounded-[8px] bg-[#078C80] text-white text-[16px] hover:bg-[#06756b] disabled:opacity-50 uppercase tracking-wider">
                      {isSubmitting ? 'Saving...' : 'UPDATE PROFILE'}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-[18px] text-gray-400 leading-relaxed">{profile.bio || 'No description added yet.'}</p>
              )}
            </div>
          )}

          {/* EVENTS */}
          {sideTab === 'events' && (
            <div>
              <div className="flex gap-8 border-b border-gray-200 mb-6">
                {(['future', 'past', 'hosting'] as EventTab[]).map((t) => (
                  <button key={t} onClick={() => setEventTab(t)}
                    className={`pb-3 text-[18px] capitalize transition-colors ${
                      eventTab === t ? 'text-[#1F2937] font-medium border-b-2 border-[#078C80]' : 'text-[#6B7280] hover:text-[#1F2937]'
                    }`}>
                    {t === 'future' ? 'Future Events' : t === 'past' ? 'Past Events' : 'Hosting'}
                  </button>
                ))}
              </div>
              {isLoadingEvents ? <p className="text-[#14B8A6]">Loading events...</p>
                : events.length === 0 ? <p className="text-gray-400">No events found.</p>
                : (
                  <div className="grid grid-cols-3 gap-4">
                    {events.map((ev) => (
                      <div key={ev.id} onClick={() => window.location.href = `/events/${ev.id}`}
                        className="rounded-[12px] overflow-hidden border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                        <img src={ev.imageUrl || `https://placehold.co/300x180/e2e8f0/64748b?text=${encodeURIComponent(ev.category)}`}
                          alt={ev.title} className="w-full h-[120px] object-cover" />
                        <div className="p-3">
                          <p className="text-[16px] font-medium text-[#1F2937] truncate">{ev.title}</p>
                          <p className="text-[13px] text-gray-400 mt-1">
                            {new Date(ev.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                          <p className="text-[13px] text-gray-400">
                            {new Date(ev.startDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}

          {/* FOLLOWERS */}
          {sideTab === 'followers' && (
            <div>
              <h2 className="text-[22px] font-medium text-[#1F2937] mb-2 pb-3 border-b border-gray-200">
                {profile.isCurrentUser ? 'Your followers' : `${profile.displayName ?? profile.username}'s Followers`}
              </h2>
              {isLoadingFollowings ? <p className="text-[#14B8A6] mt-4">Loading...</p>
                : followings.length === 0 ? <p className="text-gray-400 mt-4">No followers yet.</p>
                : (
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {followings.map((f) => (
                      <div key={f.id} onClick={() => window.location.href = `/profile/${f.username}`}
                        className="flex flex-col items-center gap-2 p-4 rounded-[12px] border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                        <img src={f.imageUrl || `https://placehold.co/100x100/e2e8f0/64748b?text=${f.displayName?.charAt(0) ?? 'U'}`}
                          alt={f.displayName} className="w-[70px] h-[70px] rounded-full object-cover" />
                        <p className="text-[16px] font-medium text-[#1F2937]">{f.displayName ?? f.username}</p>
                        <div className="flex items-center gap-1 text-[13px] text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {f.followersCount} Followers
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}

          {/* FOLLOWING */}
          {sideTab === 'following' && (
            <div>
              <h2 className="text-[22px] font-medium text-[#1F2937] mb-2 pb-3 border-b border-gray-200">
                {profile.isCurrentUser ? 'Your following' : `${profile.displayName ?? profile.username}'s Following`}
              </h2>
              {isLoadingFollowings ? <p className="text-[#14B8A6] mt-4">Loading...</p>
                : followings.length === 0 ? <p className="text-gray-400 mt-4">Not following anyone yet.</p>
                : (
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {followings.map((f) => (
                      <div key={f.id} onClick={() => window.location.href = `/profile/${f.username}`}
                        className="flex flex-col items-center gap-2 p-4 rounded-[12px] border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                        <img src={f.imageUrl || `https://placehold.co/100x100/e2e8f0/64748b?text=${f.displayName?.charAt(0) ?? 'U'}`}
                          alt={f.displayName} className="w-[70px] h-[70px] rounded-full object-cover" />
                        <p className="text-[16px] font-medium text-[#1F2937]">{f.displayName ?? f.username}</p>
                        <div className="flex items-center gap-1 text-[13px] text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {f.followersCount} Followers
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
});

export default ProfilePage;