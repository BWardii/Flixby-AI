import React, { useEffect, useState } from 'react';
import { LogIn, LogOut, Loader2, User as UserIcon, AlertCircle } from 'lucide-react';
import { signInWithGoogle, signOut, getCurrentUser, initializeAuth } from '../lib/auth';
import { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

export default function AuthButton() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize auth and get initial user state
        const initialUser = await initializeAuth();
        setUser(initialUser);
        setError(null);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const handleSignIn = () => {
    navigate('/sign-in');
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await signOut();
      setUser(null);
      setShowDropdown(false);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-10 h-10">
        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm">{error}</span>
      </div>
    );
  }

  if (!user) {
    return (
      <button
        onClick={handleSignIn}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white transition-all duration-300 border border-gray-700/50 hover:border-green-500/50"
      >
        <LogIn className="w-4 h-4" />
        <span>Sign In</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white transition-all duration-300 border border-gray-700/50 hover:border-green-500/50"
      >
        {user.user_metadata.avatar_url ? (
          <img
            src={user.user_metadata.avatar_url}
            alt={user.user_metadata.full_name || 'User'}
            className="w-6 h-6 rounded-full"
          />
        ) : (
          <UserIcon className="w-4 h-4" />
        )}
        <span className="max-w-[120px] truncate">
          {user.user_metadata.full_name || user.email}
        </span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg bg-gray-800/90 backdrop-blur-lg shadow-lg py-1 border border-gray-700/50">
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}