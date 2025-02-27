<<<<<<< HEAD
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bot, Sparkles, Globe, Edit, Info, ArrowRight, CheckCircle, AlertCircle, Trash2, Loader2, Search, X, MapPin } from 'lucide-react';
import AIAssistantConfig from '../../components/AIAssistantConfig';
import { fetchWebsiteData, fetchGoogleBusinessData, generateSystemPrompt, BusinessData, fetchBusinessSuggestions, BusinessSuggestion } from '../../lib/trainingData';
import debounce from 'lodash.debounce';

// Define types for the Place suggestions
interface PlaceSuggestion {
  id: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

function CreateAssistant() {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessLocation, setBusinessLocation] = useState('');
  const [websiteData, setWebsiteData] = useState<BusinessData | null>(null);
  const [googleData, setGoogleData] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState<{website: boolean, google: boolean, suggestions: boolean}>({ 
    website: false, 
    google: false,
    suggestions: false 
  });
  const [error, setError] = useState<{website: string | null, google: string | null, suggestions: string | null}>({ 
    website: null, 
    google: null,
    suggestions: null 
  });
  const [systemPrompt, setSystemPrompt] = useState('');
  const [configKey, setConfigKey] = useState(0); // Used to force reload the config component
  const [placeSuggestions, setPlaceSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsPanelRef = useRef<HTMLDivElement>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Generate session token for grouping autocomplete requests
  const [sessionToken] = useState(`${Date.now()}-${Math.random().toString(36).substring(2, 15)}`);

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

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsPanelRef.current && 
        !suggestionsPanelRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounced function to fetch place suggestions
  const debouncedFetchSuggestions = useCallback(
    debounce(async (input: string) => {
      if (!input || input.length < 3) {
        setPlaceSuggestions([]);
        setLoading(prev => ({ ...prev, suggestions: false }));
        return;
      }

      try {
        setError(prev => ({ ...prev, suggestions: null }));
        
        // Call our backend API through the Vite proxy
        const response = await fetch(`/api/places/search?query=${encodeURIComponent(input)}`);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform the response into the format we need
        const suggestions = data.map((place: any) => ({
          id: place.id,
          description: `${place.name}, ${place.location}`,
          mainText: place.name,
          secondaryText: place.location
        }));
        
        setPlaceSuggestions(suggestions);
        setShowSuggestions(suggestions.length > 0);
      } catch (error) {
        console.error('Error fetching place suggestions:', error);
        setError(prev => ({ ...prev, suggestions: "Couldn't fetch suggestions. Using local search instead." }));
        
        // Fall back to the original suggestion method
        try {
          const fallbackSuggestions = await fetchBusinessSuggestions(input, businessLocation);
          const mappedSuggestions = fallbackSuggestions.map(s => ({
            id: s.id,
            description: `${s.name}, ${s.location}`,
            mainText: s.name,
            secondaryText: s.location
          }));
          setPlaceSuggestions(mappedSuggestions);
          setShowSuggestions(mappedSuggestions.length > 0);
        } catch (fallbackError) {
          console.error('Fallback search also failed:', fallbackError);
        }
      } finally {
        setLoading(prev => ({ ...prev, suggestions: false }));
      }
    }, 300),
    [businessLocation]
  );

  // Effect to fetch place suggestions when businessName changes
  useEffect(() => {
    if (businessName.length >= 3) {
      setLoading(prev => ({ ...prev, suggestions: true }));
      debouncedFetchSuggestions(businessName);
    } else {
      setPlaceSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      debouncedFetchSuggestions.cancel();
    };
  }, [businessName, debouncedFetchSuggestions]);

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
      // Using proxy, so we don't need the base URL
      const url = `/api/places/details?placeId=${encodeURIComponent(placeId)}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch place details: ${response.statusText}`);
      }
      
      const data = await response.json();
      setGoogleData(data);
      
      // Clear search input and suggestions after successful fetch
      setBusinessName('');
      setBusinessLocation('');
      setPlaceSuggestions([]);
      setShowSuggestions(false);
    } catch (err) {
      console.error('Error fetching Google Business data:', err);
      setError(prev => ({ ...prev, google: err instanceof Error ? err.message : 'Failed to fetch Google Business data' }));
      
      // Fall back to mock data if API call fails
      try {
        const mockBusinessData = await fetchGoogleBusinessData(placeId || businessName);
        setGoogleData(mockBusinessData);
      } catch (mockErr) {
        console.error('Mock data fallback also failed:', mockErr);
      }
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

  const handleSelectPlaceSuggestion = (suggestion: PlaceSuggestion) => {
    setBusinessName(suggestion.mainText);
    setBusinessLocation(suggestion.secondaryText);
    setShowSuggestions(false);
    
    // Fetch the business data automatically when a suggestion is selected
    setTimeout(() => {
      handleFetchGoogleData(suggestion.id);
    }, 100);
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
                    <p className="text-sm text-gray-400">Search for your business to load information</p>
                  </div>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div className="relative">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      onFocus={() => {
                        setIsInputFocused(true);
                        if (placeSuggestions.length > 0) setShowSuggestions(true);
                      }}
                      onBlur={() => setIsInputFocused(false)}
                      placeholder="Business Name"
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
                    />
                    {loading.suggestions ? (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                      </div>
                    ) : businessName && (
                      <button 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        onClick={() => setBusinessName('')}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    
                    {/* Business suggestions dropdown */}
                    {showSuggestions && (
                      <div 
                        ref={suggestionsPanelRef}
                        className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg"
                      >
                        {error.suggestions && (
                          <div className="px-3 py-2 text-xs text-amber-400 bg-amber-900/20 border-b border-gray-700">
                            <AlertCircle className="h-3 w-3 inline-block mr-1" />
                            {error.suggestions}
                          </div>
                        )}
                        <ul className="py-1 max-h-60 overflow-auto">
                          {placeSuggestions.length === 0 ? (
                            <li className="px-4 py-2 text-gray-400 text-sm">
                              No results found
                            </li>
                          ) : (
                            placeSuggestions.map((suggestion) => (
                              <li 
                                key={suggestion.id}
                                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                                onMouseDown={() => handleSelectPlaceSuggestion(suggestion)}
                              >
                                <div className="flex items-center">
                                  <div>
                                    <div className="text-white font-medium">{suggestion.mainText}</div>
                                    <div className="flex items-center text-xs text-gray-400">
                                      <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                                      <span>{suggestion.secondaryText}</span>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      value={businessLocation}
                      onChange={(e) => setBusinessLocation(e.target.value)}
                      placeholder="Location (City, State)"
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  {error.google && (
                    <p className="text-xs text-red-400">{error.google}</p>
                  )}
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleFetchGoogleData('')}
                      disabled={loading.google || !businessName}
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
            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
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
=======
import React from 'react';
import AIAssistantConfig from '../../components/AIAssistantConfig';

function CreateAssistant() {
  return <AIAssistantConfig />;
>>>>>>> main
}

export default CreateAssistant;