import React, { useEffect, useState } from 'react';
import { Bot, AlertCircle, Pencil, Trash2, Globe, Volume2, Sliders, Phone, Loader2 } from 'lucide-react';
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
          <Loader2 className="w-6 h-6 text-green-400 animate-spin" />
          <span className="text-gray-400">Loading assistant...</span>
        </div>
      </div>
    );
  }

  if (!assistant) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 text-center">
        <AlertCircle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">No Assistant Found</h2>
        <p className="text-gray-400 mb-6">
          You haven't created an AI assistant yet. Create one to get started.
        </p>
        <button
          onClick={() => navigate('/my-assistant/create')}
          className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-green-600 transition-all duration-300"
        >
          Create Assistant
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Bot className="h-8 w-8 text-green-400" />
            <h2 className="text-2xl font-bold">Your AI Assistant</h2>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleTestAssistant}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>{showCallInterface ? 'Hide Call Interface' : 'Test Assistant'}</span>
            </button>
            <button
              onClick={() => navigate('/my-assistant/create')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-700/50 text-gray-300 hover:bg-gray-700 transition-colors"
            >
              <Pencil className="h-4 w-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-3 text-red-400 mb-6 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-300">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                <div className="text-white">{assistant.name}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">First Message</label>
                <div className="text-white">{assistant.first_message}</div>
              </div>
            </div>
          </div>

          {/* System Prompt */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-300">System Prompt</h3>
            <div className="bg-gray-900/50 rounded-lg p-4 text-white">
              {assistant.system_prompt}
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-300">Advanced Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3 bg-gray-900/50 rounded-lg p-4">
                <Globe className="h-5 w-5 text-blue-400" />
                <div>
                  <div className="text-sm font-medium text-gray-400">Language</div>
                  <div className="text-white">{assistant.language}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-gray-900/50 rounded-lg p-4">
                <Volume2 className="h-5 w-5 text-green-400" />
                <div>
                  <div className="text-sm font-medium text-gray-400">Voice</div>
                  <div className="text-white">{assistant.voice_id}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-gray-900/50 rounded-lg p-4">
                <Sliders className="h-5 w-5 text-yellow-400" />
                <div>
                  <div className="text-sm font-medium text-gray-400">Temperature</div>
                  <div className="text-white">{assistant.temperature}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call Interface */}
      {showCallInterface && (
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <Phone className="h-6 w-6 text-green-400 mr-2" />
            Test Your AI Assistant
          </h3>
          <AIAssistant assistantId={assistant.assistant_id} />
        </div>
      )}
    </div>
  );
}

export default ManageAssistant;