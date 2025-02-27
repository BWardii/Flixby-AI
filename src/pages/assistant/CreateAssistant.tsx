import React, { useState, useEffect, useRef } from 'react';
import { Bot, Sparkles, Globe, Edit, Info, ArrowRight, CheckCircle, AlertCircle, Trash2, Loader2, Search, X, MapPin } from 'lucide-react';
import AIAssistantConfig from '../../components/AIAssistantConfig';
import { fetchWebsiteData, fetchGoogleBusinessData, generateSystemPrompt, BusinessData, fetchBusinessSuggestions, BusinessSuggestion } from '../../lib/trainingData';

function CreateAssistant() {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessLocation, setBusinessLocation] = useState('');
  const [websiteData, setWebsiteData] = useState<BusinessData | null>(null);
  const [googleData, setGoogleData] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState<{website: boolean, google: boolean}>({ website: false, google: false });
  const [error, setError] = useState<{website: string | null, google: string | null}>({ website: null, google: null });
  const [systemPrompt, setSystemPrompt] = useState('');
  const [configKey, setConfigKey] = useState(0); // Used to force reload the config component
  const [businessSuggestions, setBusinessSuggestions] = useState<BusinessSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const suggestionsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Generate system prompt when data changes
  useEffect(() => {
    const combinedData: BusinessData = {
      ...websiteData,
      ...googleData,
      // If both sources have the same fields, prefer Google data as it's likely more structured
      name: googleData?.name || websiteData?.name,
      description: googleData?.description || websiteData?.description,
      hours: googleData?.hours || websiteData?.hours,
      address: googleData?.address || websiteData?.address,
      phone: googleData?.phone || websiteData?.phone,
    };
    
    if (Object.keys(combinedData).length > 0) {
      const prompt = generateSystemPrompt(combinedData);
      setSystemPrompt(prompt);
      // Force reload the AIAssistantConfig component to update with new prompt
      setConfigKey(prev => prev + 1);
    }
  }, [websiteData, googleData]);

  // Handle business name search for auto-suggestions
  useEffect(() => {
    // Clear any existing timeout
    if (suggestionsTimeoutRef.current) {
      clearTimeout(suggestionsTimeoutRef.current);
    }

    // Don't search if name is too short
    if (!businessName || businessName.length < 2) {
      setBusinessSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Set a delay to avoid too many API calls while typing
    setSuggestionsLoading(true);
    suggestionsTimeoutRef.current = setTimeout(async () => {
      try {
        const suggestions = await fetchBusinessSuggestions(businessName, businessLocation);
        setBusinessSuggestions(suggestions);
        setShowSuggestions(suggestions.length > 0);
      } catch (error) {
        console.error('Error fetching business suggestions:', error);
      } finally {
        setSuggestionsLoading(false);
      }
    }, 500);

    // Cleanup function
    return () => {
      if (suggestionsTimeoutRef.current) {
        clearTimeout(suggestionsTimeoutRef.current);
      }
    };
  }, [businessName, businessLocation]);

  const handleFetchWebsiteData = async () => {
    if (!websiteUrl) {
      setError(prev => ({ ...prev, website: 'Please enter a website URL' }));
      return;
    }
    
    setLoading(prev => ({ ...prev, website: true }));
    setError(prev => ({ ...prev, website: null }));
    
    try {
      const data = await fetchWebsiteData(websiteUrl);
      setWebsiteData(data);
    } catch (err) {
      setError(prev => ({ ...prev, website: err instanceof Error ? err.message : 'Failed to fetch website data' }));
    } finally {
      setLoading(prev => ({ ...prev, website: false }));
    }
  };

  const handleFetchGoogleData = async (placeId: string = '') => {
    if (!placeId && !businessName) {
      setError(prev => ({ ...prev, google: 'Please enter a business name or select a business from the suggestions' }));
      return;
    }
    
    setLoading(prev => ({ ...prev, google: true }));
    setError(prev => ({ ...prev, google: null }));
    
    try {
      const data = await fetchGoogleBusinessData(placeId);
      setGoogleData(data);
    } catch (err) {
      setError(prev => ({ ...prev, google: err instanceof Error ? err.message : 'Failed to fetch Google Business data' }));
    } finally {
      setLoading(prev => ({ ...prev, google: false }));
    }
  };

  const handleRemoveSource = (source: 'website' | 'google') => {
    if (source === 'website') {
      setWebsiteData(null);
      setWebsiteUrl('');
    } else {
      setGoogleData(null);
      setBusinessName('');
      setBusinessLocation('');
    }
  };

  const handleSelectBusinessSuggestion = (suggestion: BusinessSuggestion) => {
    setBusinessName(suggestion.name);
    setBusinessLocation(suggestion.location);
    setShowSuggestions(false);
    
    // Fetch the business data automatically when a suggestion is selected
    setTimeout(() => {
      handleFetchGoogleData(suggestion.id);
    }, 100);
  };

  const clearBusinessSearch = () => {
    setBusinessName('');
    setBusinessSuggestions([]);
    setShowSuggestions(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

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

      {/* Welcome Card */}
      <div className="bg-gray-800/60 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6 md:p-8 mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center">
            <Bot className="h-6 w-6 text-purple-400" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-white mb-2">Welcome to Flixby!</h1>
        <p className="text-center text-gray-300 mb-6 max-w-lg mx-auto">
          Train and customize your AI assistant to handle your customers' experiences. 
          Provide business details below to help Flixby learn about your business.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="bg-gray-700/40 p-4 rounded-lg border border-gray-600/50 text-center">
            <p className="text-purple-300 font-medium mb-2">Train and customize Flixby</p>
            <p className="text-gray-300 text-sm">on your business information</p>
          </div>
          <div className="bg-gray-700/40 p-4 rounded-lg border border-gray-600/50 text-center">
            <p className="text-purple-300 font-medium mb-2">Talk to Flixby</p>
            <p className="text-gray-300 text-sm">to hear your customers' experience</p>
          </div>
          <div className="bg-gray-700/40 p-4 rounded-lg border border-gray-600/50 text-center">
            <p className="text-purple-300 font-medium mb-2">Forward calls to Flixby</p>
            <p className="text-gray-300 text-sm">from your existing business number</p>
          </div>
        </div>
      </div>

      {/* Assistant Configuration */}
      <div className="bg-gray-800/60 backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-md overflow-hidden mb-8">
        <div className="border-b border-gray-700/50 p-4 md:p-6 flex items-center">
          <div className="w-10 h-10 bg-purple-900/50 rounded-lg flex items-center justify-center mr-3">
            <Bot className="h-5 w-5 text-purple-400" />
          </div>
          <h2 className="text-lg font-medium text-white">Training Sources</h2>
        </div>
        
        <div className="p-4 md:p-6">
          <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50 mb-6">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-gray-300">
                Flixby uses these sources to learn about your business, which helps it answer 
                customer inquiries effectively. While entering both sources is ideal, just one is 
                enough to get started.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Website URL Input */}
            {!websiteData ? (
              <div className="p-4 border border-gray-700/50 bg-gray-700/20 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-900/50 rounded-lg flex items-center justify-center mr-3">
                    <Globe className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Business Website</h3>
                    <p className="text-sm text-gray-400">Enter your website URL to extract business information</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1">
                      <input
                        type="url"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        placeholder="https://yourbusiness.com"
                        className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
                      />
                      {error.website && (
                        <p className="mt-1 text-xs text-red-400">{error.website}</p>
                      )}
                    </div>
                    <button
                      onClick={handleFetchWebsiteData}
                      disabled={loading.website}
                      className="whitespace-nowrap bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2.5 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {loading.website ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4" />
                          <span>Extract Data</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 border border-gray-700/50 bg-gray-700/20 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-900/50 rounded-lg flex items-center justify-center mr-3">
                    <Globe className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Business Website</h3>
                    <p className="text-sm text-gray-400">{websiteUrl}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <button 
                    onClick={() => handleRemoveSource('website')}
                    className="text-red-400 hover:text-red-300 ml-4"
                    aria-label="Remove website data"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Google Business Profile Input */}
            {!googleData ? (
              <div className="p-4 border border-gray-700/50 bg-gray-700/20 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-red-900/50 rounded-lg flex items-center justify-center mr-3">
                    <Globe className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Google Business Profile</h3>
                    <p className="text-sm text-gray-400">Connect your Google Business listing</p>
                  </div>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div className="relative">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Enter business name (e.g., Nando's Enfield)"
                        className="w-full bg-white pl-10 pr-10 py- 
3 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border-none shadow-md"
                        onFocus={() => businessSuggestions.length > 0 && setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      />
                      {businessName && (
                        <button 
                          onClick={clearBusinessSearch}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    
                    {suggestionsLoading && (
                      <div className="absolute right-14 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                      </div>
                    )}
                    
                    {/* Business suggestions dropdown */}
                    {showSuggestions && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                        <ul className="py-2 max-h-60 overflow-auto">
                          {businessSuggestions.map((suggestion) => (
                            <li 
                              key={suggestion.id}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onMouseDown={() => handleSelectBusinessSuggestion(suggestion)}
                            >
                              <div className="flex items-start">
                                <MapPin className="h-5 w-5 text-gray-400 mt-1 mr-2 flex-shrink-0" />
                                <div>
                                  <div className="text-black font-medium">{suggestion.name}</div>
                                  <div className="text-xs text-gray-500">
                                    {suggestion.location}
                                    {suggestion.rating && (
                                      <div className="flex items-center mt-1">
                                        <div className="flex">
                                          {[...Array(5)].map((_, i) => (
                                            <svg 
                                              key={i}
                                              xmlns="http://www.w3.org/2000/svg" 
                                              width="12" 
                                              height="12" 
                                              viewBox="0 0 24 24" 
                                              fill={i < Math.floor(parseFloat(suggestion.rating)) ? "#FBBF24" : "#E5E7EB"}
                                              className="mr-0.5"
                                            >
                                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                            </svg>
                                          ))}
                                        </div>
                                        <span className="ml-1 text-gray-600">{suggestion.rating}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                        <div className="p-2 border-t border-gray-200 flex justify-end">
                          <div className="text-xs text-gray-500 flex items-center">
                            powered by 
                            <svg viewBox="0 0 72 24" width="44" height="15" className="ml-1">
                              <path fill="#4285F4" d="M32.04 8.96h-.86v-3.4h-1.8V4.7h4.47v.86h-1.8z"></path>
                              <path fill="#EA4335" d="M35.27 8.96v-8.4h.87v8.4z"></path>
                              <path fill="#FBBC05" d="M40.66 8.1c-.7.59-1.55.88-2.52.88-1.24 0-2.29-.42-3.15-1.28a4.36 4.36 0 0 1-1.3-3.16A4.3 4.3 0 0 1 35 1.4 4.34 4.34 0 0 1 38.14.1c.67 0 1.31.14 1.93.45.6.3 1.06.69 1.37 1.18l-.75.56c-.5-.69-1.25-1.05-2.25-1.05-.87 0-1.63.32-2.26.94-.63.62-.94 1.39-.94 2.3a3.2 3.2 0 0 0 .94 2.35c.63.64 1.4.95 2.26.95.88 0 1.6-.26 2.19-.8.38-.35.62-.82.72-1.44h-2.91v-.85h3.83v.48c0 .76-.23 1.48-.7 2.14l.09-.06z"></path>
                              <path fill="#4285F4" d="M45.73 8.96v-7.7h3.77v.86h-2.9v2.57h2.62V5.55h-2.62v2.56h2.9v.86h-3.77z"></path>
                              <path fill="#34A853" d="M54.19 8.96h-.87V5.55h-3.05v3.41h-.87v-8.4h.87v4.13h3.05V.56h.87z"></path>
                              <path fill="#EA4335" d="M56.93 8.96V.56h.87v8.4z"></path>
                              <path fill="#FBBC05" d="M63.56 8.96h-.88V1.56h-1.93v-.87h4.74v.87H63.56z"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => setShowSuggestions(true)}
                      disabled={!businessName || businessName.length < 2 || loading.google}
                      className="text-sm text-purple-400 hover:text-purple-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                      Show suggestions
                    </button>
                    
                    <button
                      onClick={() => handleFetchGoogleData('')}
                      disabled={!businessName || loading.google}
                      className="bg-gradient-to-r from-red-500 to-purple-500 text-white px-4 py-2.5 rounded-lg font-medium hover:from-red-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {loading.google ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4" />
                          <span>Search Business</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  {error.google && (
                    <p className="text-xs text-red-400 mt-2">{error.google}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 border border-gray-700/50 bg-gray-700/20 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-red-900/50 rounded-lg flex items-center justify-center mr-3">
                    <Globe className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Google Business Profile</h3>
                    <p className="text-sm text-gray-400">{googleData.name} - {googleData.address}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <button 
                    onClick={() => handleRemoveSource('google')}
                    className="text-red-400 hover:text-red-300 ml-4"
                    aria-label="Remove Google Business data"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {(websiteData || googleData) && (
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-green-300">
                  Successfully extracted business information! The AI assistant will be configured with this data.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Business Information */}
      <div className="bg-gray-800/60 backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-md mb-8">
        <div className="border-b border-gray-700/50 p-4 md:p-6 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-900/50 rounded-lg flex items-center justify-center mr-3">
              <Sparkles className="h-5 w-5 text-purple-400" />
            </div>
            <h2 className="text-lg font-medium text-white">Business Information</h2>
          </div>
          <button className="text-purple-400 hover:text-purple-300 flex items-center text-sm font-medium">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </button>
        </div>
        
        <div className="p-6">
          <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50 mb-6">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-gray-300">
                This business information is used by Flixby to handle your brand details. 
                Provide or update them for a more consistent experience.
              </p>
            </div>
          </div>
          
          <AIAssistantConfig key={configKey} initialSystemPrompt={systemPrompt} />
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg flex items-center font-medium hover:from-purple-600 hover:to-blue-600 transition-colors">
          Continue
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export default CreateAssistant;