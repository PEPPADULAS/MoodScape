'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings, 
  BarChart3, 
  Trophy, 
  Palette,
  Camera,
  Edit3,
  Save,
  Lock,
  Mail,
  Calendar,
  TrendingUp,
  Award,
  Target,
  CheckCircle,
  FileText,
  Bell,
  Eye,
  EyeOff,
  Mail as MailIcon,
  Bell as BellIcon,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { SmoothNavigation } from '@/components/navigation/smooth-navigation';
import { useTheme } from '@/contexts/theme-context';
import { PageLoadingSpinner } from '@/components/loading/seasonal-loading';
import { PageTransition } from '@/components/animations/micro-interactions';
import { DynamicBackground, SeasonalGradientBackground, ConstellationEffect } from '@/components/backgrounds/dynamic-background';

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  avatar: string;
}

interface ActivityStats {
  totalEntries: number;
  currentStreak: number;
  longestStreak: number;
  totalWords: number;
  reminderCompletionRate: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  dateEarned?: string;
}

interface Thought {
  id: string;
  content: string;
  createdAt: string;
  mood?: string;
}

interface Reminder {
  id: string;
  title: string;
  completed: boolean;
  notifyAt: string;
}

interface CustomGoal {
  id: string;
  title: string;
  current: number;
  target: number;
  completed: boolean;
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { theme } = useTheme();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'activity' | 'preferences' | 'achievements'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    email: '',
    bio: '',
    avatar: ''
  });
  const [tempProfile, setTempProfile] = useState<UserProfile>({
    name: '',
    email: '',
    bio: '',
    avatar: ''
  });
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  // Account deletion state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  
  // Real data state
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    profileVisibility: false
  });
  
  // Custom goals with real data
  const [customGoals, setCustomGoals] = useState<CustomGoal[]>([
    {
      id: 'entries-per-week',
      title: 'Write 3 entries per week',
      current: 0,
      target: 3,
      completed: false
    },
    {
      id: 'maintain-streak',
      title: 'Maintain 7-day streak',
      current: 0,
      target: 7,
      completed: false
    }
  ]);
  
  // Helper functions for statistics
  const calculateCurrentStreak = (thoughtsData: Thought[]): number => {
    if (thoughtsData.length === 0) return 0;
    
    // Sort thoughts by date (newest first)
    const sortedThoughts = [...thoughtsData].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if the most recent thought was today
    const lastThoughtDate = new Date(sortedThoughts[0].createdAt);
    lastThoughtDate.setHours(0, 0, 0, 0);
    
    if (lastThoughtDate.getTime() !== today.getTime()) {
      // If the last thought wasn't today, check if it was yesterday
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastThoughtDate.getTime() !== yesterday.getTime()) {
        return 0; // No streak
      }
    }
    
    // Count consecutive days
    for (let i = 0; i < sortedThoughts.length - 1; i++) {
      const currentDate = new Date(sortedThoughts[i].createdAt);
      const nextDate = new Date(sortedThoughts[i + 1].createdAt);
      
      currentDate.setHours(0, 0, 0, 0);
      nextDate.setHours(0, 0, 0, 0);
      
      const diffTime = currentDate.getTime() - nextDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      if (Math.abs(diffDays) <= 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const calculateLongestStreak = (thoughtsData: Thought[]): number => {
    if (thoughtsData.length === 0) return 0;
    
    // This would require more complex logic to track historical streaks
    // For now, we'll return the current streak as a placeholder
    return calculateCurrentStreak(thoughtsData);
  };

  const calculateReminderCompletionRate = (remindersData: Reminder[]): number => {
    if (remindersData.length === 0) return 100;
    
    const completedReminders = remindersData.filter(r => r.completed).length;
    return Math.round((completedReminders / remindersData.length) * 100);
  };

  const calculateEntriesThisWeek = (thoughtsData: Thought[]): number => {
    if (thoughtsData.length === 0) return 0;
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return thoughtsData.filter(thought => {
      const thoughtDate = new Date(thought.createdAt);
      return thoughtDate >= oneWeekAgo;
    }).length;
  };

  // Computed statistics
  const activityStats: ActivityStats = {
    totalEntries: thoughts.length,
    currentStreak: calculateCurrentStreak(thoughts),
    longestStreak: calculateLongestStreak(thoughts),
    totalWords: thoughts.reduce((total, thought) => total + (thought.content?.split(' ').length || 0), 0),
    reminderCompletionRate: calculateReminderCompletionRate(reminders)
  };
  
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-entry',
      title: 'First Entry',
      description: 'Write your first journal entry',
      icon: '📝',
      earned: false
    },
    {
      id: 'week-streak',
      title: '7-Day Streak',
      description: 'Maintain a 7-day writing streak',
      icon: '🔥',
      earned: false
    },
    {
      id: 'month-streak',
      title: '30-Day Streak',
      description: 'Maintain a 30-day writing streak',
      icon: '🏆',
      earned: false
    },
    {
      id: 'word-master',
      title: 'Word Master',
      description: 'Write 10,000 words',
      icon: '✍️',
      earned: false
    },
    {
      id: 'reminder-hero',
      title: 'Reminder Hero',
      description: 'Complete 90% of reminders for a month',
      icon: '🔔',
      earned: false
    }
  ]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
    
    // Initialize profile with session data
    if (session?.user) {
      console.log('Session user data:', session.user); // Debug log
      setUserProfile({
        name: session.user.name || '',
        email: session.user.email || '',
        bio: '', // Will be fetched from API
        avatar: session.user.image || ''
      });
      setTempProfile({
        name: session.user.name || '',
        email: session.user.email || '',
        bio: '', // Will be fetched from API
        avatar: session.user.image || ''
      });
    }
  }, [status, session, router]);

  // Fetch real data
  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserData();
    }
  }, [status]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch thoughts
      const thoughtsResponse = await fetch('/api/thoughts');
      if (thoughtsResponse.ok) {
        const thoughtsData = await thoughtsResponse.json();
        setThoughts(thoughtsData);
        
        // Update custom goals with real data
        updateCustomGoals(thoughtsData);
      }
      
      // Fetch reminders
      const remindersResponse = await fetch('/api/calendar/reminders/due');
      if (remindersResponse.ok) {
        const remindersData = await remindersResponse.json();
        setReminders(remindersData);
      }
      
      // Fetch user profile data
      const profileResponse = await fetch('/api/user/profile');
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        console.log('Profile data fetched:', profileData); // Debug log
        setUserProfile(prev => ({
          ...prev,
          bio: profileData.bio || prev.bio,
          avatar: profileData.avatar || prev.avatar
        }));
        setTempProfile(prev => ({
          ...prev,
          bio: profileData.bio || prev.bio,
          avatar: profileData.avatar || prev.avatar
        }));
      } else {
        console.error('Failed to fetch profile data:', profileResponse.status);
      }
      
      // Update achievements based on real data
      updateAchievements(thoughts, reminders);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCustomGoals = (thoughtsData: Thought[]) => {
    const entriesThisWeek = calculateEntriesThisWeek(thoughtsData);
    const currentStreak = calculateCurrentStreak(thoughtsData);
    
    setCustomGoals(prev => prev.map(goal => {
      if (goal.id === 'entries-per-week') {
        return {
          ...goal,
          current: entriesThisWeek,
          completed: entriesThisWeek >= goal.target
        };
      }
      if (goal.id === 'maintain-streak') {
        return {
          ...goal,
          current: currentStreak,
          completed: currentStreak >= goal.target
        };
      }
      return goal;
    }));
  };

  const updateAchievements = (thoughtsData: Thought[], remindersData: Reminder[]) => {
    const updatedAchievements = [...achievements];
    
    // First entry achievement
    if (thoughtsData.length > 0) {
      const firstEntry = updatedAchievements.find(a => a.id === 'first-entry');
      if (firstEntry) {
        firstEntry.earned = true;
        firstEntry.dateEarned = new Date(thoughtsData[thoughtsData.length - 1].createdAt).toISOString();
      }
    }
    
    // 7-day streak achievement
    const currentStreak = calculateCurrentStreak(thoughtsData);
    if (currentStreak >= 7) {
      const weekStreak = updatedAchievements.find(a => a.id === 'week-streak');
      if (weekStreak) {
        weekStreak.earned = true;
        weekStreak.dateEarned = new Date().toISOString();
      }
    }
    
    // Word master achievement
    const totalWords = thoughtsData.reduce((total, thought) => total + (thought.content?.split(' ').length || 0), 0);
    if (totalWords >= 10000) {
      const wordMaster = updatedAchievements.find(a => a.id === 'word-master');
      if (wordMaster) {
        wordMaster.earned = true;
        wordMaster.dateEarned = new Date().toISOString();
      }
    }
    
    setAchievements(updatedAchievements);
  };

  const handleSaveProfile = async () => {
    try {
      console.log('Saving profile data:', tempProfile); // Debug log
      // Save profile data to the database
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: tempProfile.name,
          bio: tempProfile.bio,
          avatar: tempProfile.avatar
        }),
      });
      
      console.log('Profile save response status:', response.status); // Debug log
      if (response.ok) {
        const responseData = await response.json();
        console.log('Profile save response data:', responseData); // Debug log
        setUserProfile({ ...tempProfile });
        setIsEditing(false);
        // Update the session with new user data - simplified approach
        if (session) {
          // Just refresh the session without adding extra data
          await update();
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to save profile:', errorData);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleChangePassword = async () => {
    try {
      setPasswordError('');
      setPasswordSuccess('');
      
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError('New passwords do not match');
        return;
      }
      
      if (passwordData.newPassword.length < 6) {
        setPasswordError('Password must be at least 6 characters long');
        return;
      }
      
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        if (result.requiresReauth) {
          setPasswordSuccess('Password changed successfully. You will be redirected to sign in.');
          // Sign out the user and redirect to sign in page
          setTimeout(() => {
            signOut({ callbackUrl: '/auth/signin' });
          }, 3000);
        } else {
          setPasswordSuccess('Password changed successfully');
        }
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setPasswordError(result.error || 'Failed to change password');
      }
    } catch (error) {
      setPasswordError('An error occurred while changing password');
      console.error('Error changing password:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleteError('');
      
      const response = await fetch('/api/user/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: deletePassword
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Sign out and redirect to home
        await signOut({ redirect: false });
        router.push('/');
      } else {
        setDeleteError(result.error || 'Failed to delete account');
      }
    } catch (error) {
      setDeleteError('An error occurred while deleting account');
      console.error('Error deleting account:', error);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setTempProfile({ ...tempProfile, avatar: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePreference = (preference: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [preference]: !prev[preference]
    }));
  };

  // Adjust styling based on theme mode
  const getContainerClasses = () => {
    if (theme.mode === 'light') {
      return `bg-white/80 backdrop-blur-sm relative`;
    }
    return `${theme.background} relative`;
  };

  const getHeaderClasses = () => {
    if (theme.mode === 'light') {
      return "border-b border-gray-300 bg-white/80 backdrop-blur-sm";
    }
    return `border-b ${theme.card.includes('border') ? theme.card.split(' ').find(c => c.includes('border')) : 'border-gray-200'}`;
  };

  const getBackButtonClasses = () => {
    if (theme.mode === 'light') {
      return "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all hover:bg-gray-100 text-gray-700";
    }
    return `flex items-center space-x-2 px-3 py-2 rounded-lg transition-all hover:bg-gray-700 text-white`;
  };

  const getSidebarClasses = () => {
    if (theme.mode === 'light') {
      return `bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-300`;
    }
    return `${theme.card} rounded-2xl p-6 backdrop-blur-sm border`;
  };

  const getMainContentClasses = () => {
    if (theme.mode === 'light') {
      return `bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-300`;
    }
    return `${theme.card} rounded-2xl p-6 backdrop-blur-sm border`;
  };

  const getTitleClasses = () => {
    if (theme.mode === 'light') {
      return "text-xl font-bold text-gray-900";
    }
    return `text-xl font-bold ${theme.text}`;
  };

  const getTextClasses = () => {
    if (theme.mode === 'light') {
      return "text-gray-700";
    }
    return theme.text;
  };

  const getSubtleTextClasses = () => {
    if (theme.mode === 'light') {
      return "text-gray-600";
    }
    return theme.accent;
  };

  if (status === 'loading') {
    return (
      <div className={`min-h-screen ${theme.background} flex items-center justify-center`}>
        <PageLoadingSpinner />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className={`min-h-screen ${getContainerClasses()}`}>
        {/* Dynamic Background Layers */}
        <SeasonalGradientBackground />
        <ConstellationEffect />
        
        {/* Header */}
        <header className={getHeaderClasses()}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <span className="text-3xl">👤</span>
                <h1 className={getTitleClasses()}>My Profile</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <SmoothNavigation onSignOut={() => signOut()} />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-1/4">
              <div className={getSidebarClasses()}>
                <h2 className={getTitleClasses().replace('text-xl', 'text-lg') + ' mb-4'}>Profile Settings</h2>
                <nav className="space-y-2">
                  {[
                    { id: 'profile', label: 'Profile Information', icon: User },
                    { id: 'activity', label: 'Activity Dashboard', icon: BarChart3 },
                    { id: 'preferences', label: 'Preferences', icon: Settings },
                    { id: 'achievements', label: 'Achievements', icon: Trophy }
                  ].map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                        activeTab === item.id
                          ? `${theme.button} text-white shadow-lg`
                          : `${theme.mode === 'light' ? 'text-gray-900 hover:bg-gray-100' : `${theme.text} hover:bg-gray-100 dark:hover:bg-gray-700`}`
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </motion.button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Profile Content */}
            <div className="lg:w-3/4">
              <div className={getMainContentClasses()}>
                {/* Profile Information Tab */}
                {activeTab === 'profile' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className={getTitleClasses()}>Profile Information</h2>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                          isEditing 
                            ? `${theme.button} text-white` 
                            : `${theme.mode === 'light' ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' : 'bg-gray-700 hover:bg-gray-600 text-white'}`
                        }`}
                      >
                        {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                        <span>{isEditing ? 'Save' : 'Edit'}</span>
                      </button>
                    </div>

                    {isEditing ? (
                      <div className="space-y-6">
                        {/* Avatar Upload */}
                        <div className="flex items-center space-x-6">
                          <div className="relative">
                            <img
                              src={tempProfile.avatar || '/default-avatar.png'}
                              alt="Profile"
                              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                            <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer">
                              <Camera className="w-5 h-5 text-gray-700" />
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                              />
                            </label>
                          </div>
                          <div>
                            <h3 className={getTitleClasses()}>Profile Picture</h3>
                            <p className={getSubtleTextClasses()}>
                              JPG, PNG or GIF. Max size 5MB.
                            </p>
                          </div>
                        </div>

                        {/* Name */}
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${theme.text}`}>
                            Name
                          </label>
                          <input
                            type="text"
                            value={tempProfile.name}
                            onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                            className={`w-full px-4 py-2 rounded-lg border ${
                              theme.mode === 'light' 
                                ? 'bg-white border-gray-300 text-gray-900' 
                                : 'bg-gray-800 border-gray-600 text-white'
                            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${theme.text}`}>
                            Email
                          </label>
                          <input
                            type="email"
                            value={tempProfile.email}
                            disabled
                            className={`w-full px-4 py-2 rounded-lg border ${
                              theme.mode === 'light' 
                                ? 'bg-gray-100 border-gray-300 text-gray-500' 
                                : 'bg-gray-800 border-gray-600 text-gray-400'
                            }`}
                          />
                          <p className={`mt-1 text-sm ${getSubtleTextClasses()}`}>
                            Email cannot be changed
                          </p>
                        </div>

                        {/* Bio */}
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${theme.text}`}>
                            Bio
                          </label>
                          <textarea
                            value={tempProfile.bio}
                            onChange={(e) => setTempProfile({ ...tempProfile, bio: e.target.value })}
                            rows={4}
                            className={`w-full px-4 py-2 rounded-lg border ${
                              theme.mode === 'light' 
                                ? 'bg-white border-gray-300 text-gray-900' 
                                : 'bg-gray-800 border-gray-600 text-white'
                            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          />
                        </div>

                        {/* Save Button */}
                        <div className="flex space-x-4">
                          <button
                            onClick={handleSaveProfile}
                            className={`${theme.button} text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity`}
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => {
                              setIsEditing(false);
                              setTempProfile({ ...userProfile });
                            }}
                            className={`px-6 py-2 rounded-lg font-medium ${
                              theme.mode === 'light' 
                                ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' 
                                : 'bg-gray-700 hover:bg-gray-600 text-white'
                            }`}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Avatar */}
                        <div className="flex items-center space-x-6">
                          <img
                            src={userProfile.avatar || '/default-avatar.png'}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                          />
                          <div>
                            <h3 className={getTitleClasses()}>{userProfile.name}</h3>
                            <p className={getSubtleTextClasses()}>{userProfile.email}</p>
                          </div>
                        </div>

                        {/* Bio */}
                        <div>
                          <h3 className={`text-lg font-semibold mb-2 ${theme.text}`}>Bio</h3>
                          <p className={getTextClasses()}>
                            {userProfile.bio || 'No bio yet. Add one to tell others about yourself.'}
                          </p>
                        </div>

                        {/* Password Change Section */}
                        <div className="border-t pt-6">
                          <h3 className={`text-lg font-semibold mb-4 ${theme.text}`}>Change Password</h3>
                          <div className="space-y-4">
                            <div>
                              <label className={`block text-sm font-medium mb-2 ${theme.text}`}>
                                Current Password
                              </label>
                              <input
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                className={`w-full px-4 py-2 rounded-lg border ${
                                  theme.mode === 'light' 
                                    ? 'bg-white border-gray-300 text-gray-900' 
                                    : 'bg-gray-800 border-gray-600 text-white'
                                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                              />
                            </div>
                            <div>
                              <label className={`block text-sm font-medium mb-2 ${theme.text}`}>
                                New Password
                              </label>
                              <input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                className={`w-full px-4 py-2 rounded-lg border ${
                                  theme.mode === 'light' 
                                    ? 'bg-white border-gray-300 text-gray-900' 
                                    : 'bg-gray-800 border-gray-600 text-white'
                                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                              />
                            </div>
                            <div>
                              <label className={`block text-sm font-medium mb-2 ${theme.text}`}>
                                Confirm New Password
                              </label>
                              <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                className={`w-full px-4 py-2 rounded-lg border ${
                                  theme.mode === 'light' 
                                    ? 'bg-white border-gray-300 text-gray-900' 
                                    : 'bg-gray-800 border-gray-600 text-white'
                                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                              />
                            </div>
                            {passwordError && (
                              <div className="text-red-500 text-sm">{passwordError}</div>
                            )}
                            {passwordSuccess && (
                              <div className="text-green-500 text-sm">{passwordSuccess}</div>
                            )}
                            <button
                              onClick={handleChangePassword}
                              className={`flex items-center space-x-2 ${theme.button} text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity`}
                            >
                              <Lock className="w-4 h-4" />
                              <span>Change Password</span>
                            </button>
                          </div>
                        </div>

                        {/* Account Deletion */}
                        <div className="border-t pt-6">
                          <h3 className={`text-lg font-semibold mb-4 ${theme.text}`}>Delete Account</h3>
                          <p className={getTextClasses()}>
                            Permanently delete your account and all associated data. This action cannot be undone.
                          </p>
                          
                          {!showDeleteConfirm ? (
                            <button
                              onClick={() => setShowDeleteConfirm(true)}
                              className="mt-4 flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete Account</span>
                            </button>
                          ) : (
                            <div className="mt-4 p-4 rounded-lg bg-red-500/20 border border-red-500">
                              <div className="flex items-start space-x-3">
                                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                <div>
                                  <h4 className="font-medium text-red-500">Confirm Account Deletion</h4>
                                  <p className="text-sm mt-1 text-red-400">
                                    This will permanently delete all your thoughts, reminders, and account data. 
                                    Enter your password to confirm.
                                  </p>
                                  <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={deletePassword}
                                    onChange={(e) => setDeletePassword(e.target.value)}
                                    className="mt-3 w-full px-4 py-2 rounded-lg border border-red-500 bg-red-500/10 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                  />
                                  {deleteError && (
                                    <p className="text-red-400 text-sm mt-2">{deleteError}</p>
                                  )}
                                  <div className="flex space-x-3 mt-3">
                                    <button
                                      onClick={handleDeleteAccount}
                                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                    >
                                      Confirm Deletion
                                    </button>
                                    <button
                                      onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setDeletePassword('');
                                        setDeleteError('');
                                      }}
                                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Activity Dashboard Tab */}
                {activeTab === 'activity' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className={getTitleClasses()}>Activity Dashboard</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
                      <div className={`p-4 rounded-xl ${theme.mode === 'light' ? 'bg-blue-50' : 'bg-blue-900/20'} border border-blue-200 dark:border-blue-800`}>
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${theme.mode === 'light' ? 'bg-blue-100' : 'bg-blue-800'}`}>
                            <FileText className={`w-5 h-5 ${theme.mode === 'light' ? 'text-blue-600' : 'text-blue-300'}`} />
                          </div>
                          <div>
                            <p className={`text-sm ${theme.mode === 'light' ? 'text-blue-600' : 'text-blue-300'}`}>Total Entries</p>
                            <p className={`text-2xl font-bold ${theme.text}`}>{activityStats.totalEntries}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`p-4 rounded-xl ${theme.mode === 'light' ? 'bg-orange-50' : 'bg-orange-900/20'} border border-orange-200 dark:border-orange-800`}>
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${theme.mode === 'light' ? 'bg-orange-100' : 'bg-orange-800'}`}>
                            <TrendingUp className={`w-5 h-5 ${theme.mode === 'light' ? 'text-orange-600' : 'text-orange-300'}`} />
                          </div>
                          <div>
                            <p className={`text-sm ${theme.mode === 'light' ? 'text-orange-600' : 'text-orange-300'}`}>Current Streak</p>
                            <p className={`text-2xl font-bold ${theme.text}`}>{activityStats.currentStreak} days</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`p-4 rounded-xl ${theme.mode === 'light' ? 'bg-purple-50' : 'bg-purple-900/20'} border border-purple-200 dark:border-purple-800`}>
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${theme.mode === 'light' ? 'bg-purple-100' : 'bg-purple-800'}`}>
                            <Award className={`w-5 h-5 ${theme.mode === 'light' ? 'text-purple-600' : 'text-purple-300'}`} />
                          </div>
                          <div>
                            <p className={`text-sm ${theme.mode === 'light' ? 'text-purple-600' : 'text-purple-300'}`}>Longest Streak</p>
                            <p className={`text-2xl font-bold ${theme.text}`}>{activityStats.longestStreak} days</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`p-4 rounded-xl ${theme.mode === 'light' ? 'bg-green-50' : 'bg-green-900/20'} border border-green-200 dark:border-green-800`}>
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${theme.mode === 'light' ? 'bg-green-100' : 'bg-green-800'}`}>
                            <Edit3 className={`w-5 h-5 ${theme.mode === 'light' ? 'text-green-600' : 'text-green-300'}`} />
                          </div>
                          <div>
                            <p className={`text-sm ${theme.mode === 'light' ? 'text-green-600' : 'text-green-300'}`}>Total Words</p>
                            <p className={`text-2xl font-bold ${theme.text}`}>{activityStats.totalWords}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`p-4 rounded-xl ${theme.mode === 'light' ? 'bg-cyan-50' : 'bg-cyan-900/20'} border border-cyan-200 dark:border-cyan-800`}>
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${theme.mode === 'light' ? 'bg-cyan-100' : 'bg-cyan-800'}`}>
                            <Bell className={`w-5 h-5 ${theme.mode === 'light' ? 'text-cyan-600' : 'text-cyan-300'}`} />
                          </div>
                          <div>
                            <p className={`text-sm ${theme.mode === 'light' ? 'text-cyan-600' : 'text-cyan-300'}`}>Reminder Completion</p>
                            <p className={`text-2xl font-bold ${theme.text}`}>{activityStats.reminderCompletionRate}%</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Custom Goals */}
                    <div className="mt-8">
                      <h3 className={`text-lg font-semibold mb-4 ${theme.text}`}>Custom Goals</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {customGoals.map((goal) => (
                          <div 
                            key={goal.id} 
                            className={`p-4 rounded-xl border ${
                              theme.mode === 'light' 
                                ? 'bg-white border-gray-200' 
                                : 'bg-gray-800 border-gray-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <h4 className={`font-medium ${theme.text}`}>{goal.title}</h4>
                              {goal.completed ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <Target className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className={theme.accent}>
                                  {goal.current} / {goal.target}
                                </span>
                                <span className={theme.accent}>
                                  {Math.round((goal.current / goal.target) * 100)}%
                                </span>
                              </div>
                              <div className={`w-full h-2 rounded-full ${
                                theme.mode === 'light' ? 'bg-gray-200' : 'bg-gray-700'
                              }`}>
                                <div 
                                  className={`h-2 rounded-full ${
                                    goal.completed ? 'bg-green-500' : theme.button
                                  }`}
                                  style={{ width: `${Math.min(100, (goal.current / goal.target) * 100)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className={getTitleClasses()}>Preferences</h2>
                    <div className="mt-6 space-y-6">
                      <div className={`p-4 rounded-xl ${theme.mode === 'light' ? 'bg-white border border-gray-200' : 'bg-gray-800 border border-gray-700'}`}>
                        <h3 className={`font-medium mb-4 ${theme.text}`}>Notification Settings</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <MailIcon className={`w-5 h-5 ${theme.text}`} />
                              <div>
                                <p className={theme.text}>Email Notifications</p>
                                <p className={`text-sm ${theme.accent}`}>
                                  Receive email updates about your journal and reminders
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => togglePreference('emailNotifications')}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                                preferences.emailNotifications ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                  preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <BellIcon className={`w-5 h-5 ${theme.text}`} />
                              <div>
                                <p className={theme.text}>Push Notifications</p>
                                <p className={`text-sm ${theme.accent}`}>
                                  Receive push notifications on your device
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => togglePreference('pushNotifications')}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                                preferences.pushNotifications ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                  preferences.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`p-4 rounded-xl ${theme.mode === 'light' ? 'bg-white border border-gray-200' : 'bg-gray-800 border border-gray-700'}`}>
                        <h3 className={`font-medium mb-4 ${theme.text}`}>Privacy Controls</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Eye className={`w-5 h-5 ${theme.text}`} />
                              <div>
                                <p className={theme.text}>Profile Visibility</p>
                                <p className={`text-sm ${theme.accent}`}>
                                  Make your profile visible to other users
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => togglePreference('profileVisibility')}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                                preferences.profileVisibility ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                  preferences.profileVisibility ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Achievements Tab */}
                {activeTab === 'achievements' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className={getTitleClasses()}>Achievements</h2>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {achievements.map((achievement) => (
                        <div 
                          key={achievement.id} 
                          className={`p-4 rounded-xl border ${
                            achievement.earned 
                              ? (theme.mode === 'light' ? 'bg-yellow-50 border-yellow-200' : 'bg-yellow-900/20 border-yellow-800') 
                              : (theme.mode === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-800 border-gray-700')
                          }`}
                        >
                          <div className="flex items-start space-x-4">
                            <div className={`text-2xl ${achievement.earned ? 'grayscale-0' : 'grayscale opacity-50'}`}>
                              {achievement.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className={`font-medium ${achievement.earned ? theme.text : (theme.mode === 'light' ? 'text-gray-500' : 'text-gray-400')}`}>
                                  {achievement.title}
                                </h3>
                                {achievement.earned && (
                                  <CheckCircle className="w-5 h-5 text-yellow-500" />
                                )}
                              </div>
                              <p className={`text-sm mt-1 ${achievement.earned ? theme.accent : (theme.mode === 'light' ? 'text-gray-500' : 'text-gray-400')}`}>
                                {achievement.description}
                              </p>
                              {achievement.earned && achievement.dateEarned && (
                                <p className={`text-xs mt-2 ${theme.mode === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                  Earned on {new Date(achievement.dateEarned).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}