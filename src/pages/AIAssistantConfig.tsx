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
  { id: 'sarah', name: 'Sarah (Female, Casual)' },
  { id: 'james', name: 'James (Male, Authoritative)' },
];

const LANGUAGE_OPTIONS = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'fr-FR', name: 'French' },
  { code: 'de-DE', name: 'German' },
];

function AIAssistantConfig() {
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

    const apiKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;

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

      // Generate signature
      const signature = CryptoJS.HmacSHA256(JSON.stringify(requestBody), apiKey).toString();

      const response = await fetch('https://api.vapi.ai/assistant', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
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

      setSuccess('AI Assistant created successfully!');
      console.log('Created assistant:', data);
      
      // Reset form
      setConfig({
        name: '',
        firstMessage: '',
        systemPrompt: '',
        language: 'en-US',
        voiceId: 'jennifer',
        temperature: 0.7,
      });
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
    <div className="pt-24 min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block">
            <div className="flex items-center justify-center space-x-2 bg-gray-800/50 backdrop-blur-lg rounded-full px-4 py-2 mb-6 border border-gray-700/50">
              <Bot className="h-5 w-5 text-green-400" />
              <span className="text-sm text-gray-300">AI Assistant Creator</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Create Your AI Assistant
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Design a powerful AI assistant tailored to your specific needs
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <BookOpen className="h-5 w-5 text-blue-400 mr-2" />
                Documentation
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Quick Links</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white flex items-center">
                        <Code className="h-4 w-4 mr-2" />
                        API Reference
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white flex items-center">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Getting Started Guide
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white flex items-center">
                        <HelpCircle className="h-4 w-4 mr-2" />
                        FAQs
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Tips</h4>
                  <ul className="space-y-3 text-sm text-gray-400">
                    <li className="flex items-start">
                      <Zap className="h-4 w-4 text-yellow-400 mr-2 mt-1 flex-shrink-0" />
                      Use clear, specific system prompts to define your assistant's behavior
                    </li>
                    <li className="flex items-start">
                      <Zap className="h-4 w-4 text-yellow-400 mr-2 mt-1 flex-shrink-0" />
                      Test different voice options to find the perfect match
                    </li>
                    <li className="flex items-start">
                      <Zap className="h-4 w-4 text-yellow-400 mr-2 mt-1 flex-shrink-0" />
                      Adjust temperature to control response creativity
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <h4 className="text-sm font-medium text-blue-400 mb-2 flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    Need Help?
                  </h4>
                  <p className="text-sm text-gray-400 mb-3">
                    Our team is here to help you create the perfect AI assistant.
                  </p>
                  <button className="text-sm bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-all duration-300 w-full">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50">
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

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Enterprise Security</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Your assistant's data is protected with enterprise-grade security and encryption.
                </p>
              </div>

              <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Globe className="h-5 w-5 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Multi-Language</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Support for multiple languages and regional accents for global accessibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIAssistantConfig;