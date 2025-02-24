import React, { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Plus, Settings, PhoneCall } from 'lucide-react';
import { supabase } from '../lib/supabase';

function MyAIAssistant() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/sign-in');
      }
    };

    checkAuth();
  }, [navigate]);

  const navLinks = [
    { to: 'create', icon: <Plus className="w-5 h-5" />, label: 'Create Assistant' },
    { to: 'manage', icon: <Settings className="w-5 h-5" />, label: 'Manage Assistant' },
    { to: 'calls', icon: <PhoneCall className="w-5 h-5" />, label: 'Call Logs' },
  ];

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-4">
                <nav className="space-y-2">
                  {navLinks.map(({ to, icon, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                          isActive
                            ? 'bg-green-500/20 text-green-400'
                            : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                        }`
                      }
                    >
                      {icon}
                      <span>{label}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyAIAssistant;