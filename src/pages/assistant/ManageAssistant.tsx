import React, { useEffect, useState } from 'react';
import { Bot, AlertCircle, Pencil, Trash2, Globe, Volume2, Sliders, Phone, Loader2, Info, CheckCircle, Edit } from 'lucide-react';
import { Assistant, getAssistant, deleteAssistant } from '../../lib/assistant';
import { useNavigate } from 'react-router-dom';
import AIAssistant from '../../components/AIAssistant';
import { supabase } from '../../lib/supabase';

function ManageAssistant() {
  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCallInterface, setShowCallInterface] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadAssistant();
  }, []);

  const loadAssistant = async () => {
    try {
      setLoading(true);
      const data = await getAssistant();
      console.log('Loaded assistant:', data);
      setAssistant(data);
      setError(null);
    } catch (err) {
      console.error('Error loading assistant:', err);
      setError('Failed to load assistant data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!assistant || !confirm('Are you sure you want to delete this assistant?')) return;

    try {
      setLoading(true);
      await deleteAssistant(assistant.id);
      navigate('/my-assistant/create');
    } catch (err) {
      console.error('Error deleting assistant:', err);
      setError('Failed to delete assistant');
    } finally {
      setLoading(false);
    }
  };

  const handleTestAssistant = async () => {
    if (!assistant?.assistant_id) return;

    try {
      // Log the test attempt
      const now = new Date();
      const { error: dbError } = await supabase
        .from('call_logs')
        .insert([
          {
            call_id: `test_${Date.now()}`,
            assistant_id: assistant.assistant_id,
            start_time: now.toISOString(),
            end_time: now.toISOString(),
            duration_seconds: 0,
            status: 'completed'
          }
        ]);

      if (dbError) throw dbError;
      setShowCallInterface(!showCallInterface);
    } catch (err) {
      console.error('Error logging test:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
          <span className="text-gray-300">Loading assistant...</span>
        </div>
      </div>
    );
  }

  if (!assistant) {
    return (
      <div className="p-6 md:p-10">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center md:justify-start space-x-4 md:space-x-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-medium">
                1
              </div>
              <span className="ml-2 text-purple-300 font-medium">Quick Set-up</span>
            </div>
            <div className="h-px w-8 bg-gray-700"></div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-gray-400 font-medium">
                2
              </div>
              <span className="ml-2 text-gray-400">Talk to Flixby</span>
            </div>
            <div className="h-px w-8 bg-gray-700"></div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-gray-400 font-medium">
                3
              </div>
              <span className="ml-2 text-gray-400">Launch</span>
            </div>
          </div>
        </div>
      
        <div className="bg-gray-800/60 backdrop-blur-xl rounded-xl border border-gray-700/50 p-8 text-center max-w-2xl mx-auto">
          <AlertCircle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-white">No Assistant Found</h2>
          <p className="text-gray-300 mb-6">
            You haven't created an AI assistant yet. Create one to get started.
          </p>
          <button
            onClick={() => navigate('/my-assistant/create')}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
          >
            Create Assistant
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center md:justify-start space-x-4 md:space-x-6">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-600 text-white font-medium">
              ✓
            </div>
            <span className="ml-2 text-gray-300 font-medium">Quick Set-up</span>
          </div>
          <div className="h-px w-8 bg-gray-700"></div>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-medium">
              2
            </div>
            <span className="ml-2 text-purple-300 font-medium">Talk to Flixby</span>
          </div>
          <div className="h-px w-8 bg-gray-700"></div>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-gray-400 font-medium">
              3
            </div>
            <span className="ml-2 text-gray-400">Launch</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-gray-800/60 backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-md overflow-hidden">
          <div className="border-b border-gray-700/50 p-6 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-900/50 rounded-lg flex items-center justify-center mr-3">
                <Bot className="h-5 w-5 text-purple-400" />
              </div>
              <h2 className="text-lg font-medium text-white">Your AI Assistant</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleTestAssistant}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors text-sm font-medium"
              >
                <Phone className="h-4 w-4" />
                <span>{showCallInterface ? 'Hide Call Interface' : 'Test Assistant'}</span>
              </button>
              <button
                onClick={() => navigate('/my-assistant/create')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-700/50 text-gray-300 hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                <Pencil className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="m-6 bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-3 text-red-400 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="p-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600/50">
                    <div className="flex items-center mb-2">
                      <Bot className="h-4 w-4 text-purple-400 mr-2" />
                      <label className="text-sm font-medium text-gray-300">Name</label>
                    </div>
                    <div className="text-white">{assistant.name}</div>
                  </div>
                  <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600/50">
                    <div className="flex items-center mb-2">
                      <div className="h-4 w-4 text-purple-400 mr-2 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </div>
                      <label className="text-sm font-medium text-gray-300">First Message</label>
                    </div>
                    <div className="text-white">{assistant.first_message}</div>
                  </div>
                </div>
              </div>

              {/* System Prompt */}
              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-4">System Prompt</h3>
                <div className="bg-gray-700/30 rounded-lg p-4 text-white border border-gray-600/50">
                  {assistant.system_prompt}
                </div>
              </div>

              {/* Advanced Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-4">Advanced Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3 bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
                    <Globe className="h-5 w-5 text-purple-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-300">Language</div>
                      <div className="text-white">{assistant.language}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
                    <Volume2 className="h-5 w-5 text-purple-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-300">Voice</div>
                      <div className="text-white">{assistant.voice_id}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
                    <Sliders className="h-5 w-5 text-purple-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-300">Temperature</div>
                      <div className="text-white">{assistant.temperature}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call Interface */}
        {showCallInterface && (
          <div className="bg-gray-800/60 backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-md overflow-hidden">
            <div className="border-b border-gray-700/50 p-6">
              <h3 className="text-lg font-medium text-white flex items-center">
                <Phone className="h-5 w-5 text-purple-400 mr-2" />
                Test Your AI Assistant
              </h3>
            </div>
            <div className="p-6">
              <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50 mb-6">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-gray-300">
                    Click the phone button below to start a conversation with your AI assistant.
                    This will help you test how it responds before launching it to your customers.
                  </p>
                </div>
              </div>
              <AIAssistant assistantId={assistant.assistant_id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageAssistant;
