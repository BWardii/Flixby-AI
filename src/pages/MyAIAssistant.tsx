import React, { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FileText, Phone, Settings, Wallet, Share2, Globe, ChevronRight } from 'lucide-react';
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
    { to: 'create', icon: <FileText className="w-5 h-5" />, label: 'Guided Setup' },
    { to: 'calls', icon: <Phone className="w-5 h-5" />, label: 'Calls' },
    { to: 'manage', icon: <Settings className="w-5 h-5" />, label: 'Agent Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Left Sidebar */}
        <div className="w-full md:w-64 bg-gray-800/60 backdrop-blur-xl border-r border-gray-700/50 md:min-h-screen">
          {/* Logo & Brand */}
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white">
                <span className="font-bold">F</span>
              </div>
              <div>
                <span className="font-semibold text-white">Flixby</span>
                <span className="ml-1 text-xs text-purple-200 bg-purple-700/50 px-1.5 py-0.5 rounded-full">
                  Beta
                </span>
              </div>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <nav className="p-4">
            <div className="space-y-1">
              {navLinks.map(({ to, icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition-all duration-300 ${
                      isActive
                        ? 'bg-purple-700/30 text-purple-300 font-medium'
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    }`
                  }
                >
                  {icon}
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </nav>
          
          {/* Bottom Action Buttons */}
          <div className="mt-auto p-4 border-t border-gray-700/50 absolute bottom-0 left-0 w-full md:w-64 bg-gray-800/60">
            <div className="mb-4">
              <button className="flex items-center justify-center w-full px-4 py-2 border border-gray-700/50 rounded-lg text-sm text-gray-300 hover:bg-gray-700/50 transition-colors">
                <Share2 className="w-4 h-4 mr-2" />
                <span>Share Flixby</span>
              </button>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>(617) 555-0123</span>
              </div>
              <div className="text-xs bg-gray-700/50 px-2 py-1 rounded text-gray-300">
                30 min left
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto bg-gray-900">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MyAIAssistant;
