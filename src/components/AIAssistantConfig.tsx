import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  MessageSquare, 
  Brain, 
  Loader2, 
  Info, 
  Globe, 
  Sliders, 
  Volume2, 
  Shield,
  BookOpen,
  Code,
  Zap,
  HelpCircle
} from 'lucide-react';
import CryptoJS from 'crypto-js';
import { createAssistant } from '../lib/assistant';
import { useNavigate } from 'react-router-dom';

// Use the creation API key
const CREATION_API_KEY = 'b23dd722-a84d-4bb5-8f8d-463625277d41';

interface AssistantConfig {
  name: string;
  firstMessage: string;
  systemPrompt: string;
  language: string;
  voiceId: string;
  temperature: number;
}

const VOICE_OPTIONS = [
  { id: 'jennifer', name: 'Jennifer (Female, Professional)' },
  { id: 'michael', name: 'Michael (Male, Friendly)' },
];

const LANGUAGE_OPTIONS = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
];

function AIAssistantConfig() {
  const navigate = useNavigate();
  const [config, setConfig] = useState<AssistantConfig>({
    name: '',
    firstMessage: '',
    systemPrompt: '',
    language: 'en-US',
    voiceId: 'jennifer',
    temperature: 0.7,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const requestBody = {
        name: config.name,
        firstMessage: config.firstMessage,
        model: {
          provider: "openai",
          model: "gpt-3.5-turbo",
          temperature: config.temperature,
          messages: [
            {
              role: "system",
              content: config.systemPrompt
            }
          ]
        },
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: config.language
        },
        voice: {
          provider: "playht",
          voiceId: config.voiceId
        }
      };

      // Generate signature using the creation API key
      const signature = CryptoJS.HmacSHA256(JSON.stringify(requestBody), CREATION_API_KEY).toString();

      const response = await fetch('https://api.vapi.ai/assistant', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CREATION_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'vapi-signature': signature
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || `API Error: ${response.status}`);
      }

      console.log('Created assistant with ID:', data.id);

      // Save to localStorage with the assistant_id
      createAssistant({
        name: config.name,
        first_message: config.firstMessage,
        system_prompt: config.systemPrompt,
        language: config.language,
        voice_id: config.voiceId,
        temperature: config.temperature,
        assistant_id: data.id // Store the assistant ID from the API response
      });

      setSuccess('AI Assistant created successfully!');
      
      // Reset form
      setConfig({
        name: '',
        firstMessage: '',
        systemPrompt: '',
        language: 'en-US',
        voiceId: 'jennifer',
        temperature: 0.7,
      });

      // Navigate to manage page after 2 seconds
      setTimeout(() => {
        navigate('/my-assistant/manage');
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to create AI Assistant. Please check your API key and try again.';
      setError(errorMessage);
      console.error('Error creating assistant:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8">
      {/* Configuration Tabs */}
      <div className="flex space-x-4 mb-8 border-b border-gray-700/50">
        <button
          onClick={() => setActiveTab('basic')}
          className={`pb-4 px-4 text-sm font-medium transition-all duration-300 ${
            activeTab === 'basic'
              ? 'text-green-400 border-b-2 border-green-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Basic Configuration
        </button>
        <button
          onClick={() => setActiveTab('advanced')}
          className={`pb-4 px-4 text-sm font-medium transition-all duration-300 ${
            activeTab === 'advanced'
              ? 'text-green-400 border-b-2 border-green-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Advanced Settings
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {activeTab === 'basic' ? (
          <>
            {/* Basic Configuration */}
            <div>
              <label className="flex items-center space-x-2 text-white mb-2">
                <Bot className="h-5 w-5 text-blue-400" />
                <span>Assistant Name</span>
              </label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300"
                placeholder="e.g., Customer Support AI"
                required
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-white mb-2">
                <MessageSquare className="h-5 w-5 text-green-400" />
                <span>First Message</span>
              </label>
              <textarea
                value={config.firstMessage}
                onChange={(e) => setConfig({ ...config, firstMessage: e.target.value })}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 min-h-[100px]"
                placeholder="Hello! How can I assist you today?"
                required
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-white mb-2">
                <Brain className="h-5 w-5 text-purple-400" />
                <span>System Prompt</span>
              </label>
              <textarea
                value={config.systemPrompt}
                onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 min-h-[200px]"
                placeholder="You are a helpful customer support assistant. You are knowledgeable about our products and services..."
                required
              />
            </div>
          </>
        ) : (
          <>
            {/* Advanced Settings */}
            <div>
              <label className="flex items-center space-x-2 text-white mb-2">
                <Globe className="h-5 w-5 text-blue-400" />
                <span>Language</span>
              </label>
              <select
                value={config.language}
                onChange={(e) => setConfig({ ...config, language: e.target.value })}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300"
              >
                {LANGUAGE_OPTIONS.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-white mb-2">
                <Volume2 className="h-5 w-5 text-green-400" />
                <span>Voice</span>
              </label>
              <select
                value={config.voiceId}
                onChange={(e) => setConfig({ ...config, voiceId: e.target.value })}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300"
              >
                {VOICE_OPTIONS.map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center justify-between text-white mb-2">
                <div className="flex items-center space-x-2">
                  <Sliders className="h-5 w-5 text-yellow-400" />
                  <span>Temperature (Creativity)</span>
                </div>
                <span className="text-sm text-gray-400">{config.temperature}</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.temperature}
                onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-1">
                <span>More Focused</span>
                <span>More Creative</span>
              </div>
            </div>
          </>
        )}

        {/* Status Messages */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-3 text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg px-4 py-3 text-green-400">
            {success}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-green-600 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Creating Assistant...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span>Create AI Assistant</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default AIAssistantConfig;