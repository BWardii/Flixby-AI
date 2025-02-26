import React, { useCallback, useEffect, useState } from 'react';
import { Mic, MicOff, Phone, PhoneOff, AlertCircle, Loader2 } from 'lucide-react';
import { getVapiInstance, resetVapiInstance } from '../lib/vapi';
import { supabase } from '../lib/supabase';

interface AIAssistantProps {
  assistantId?: string;
}

const defaultAssistantOptions = {
  name: "AI Assistant",
  firstMessage: "Hello! I'm your AI assistant. How can I help you today?",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en-US"
  },
  model: {
    provider: "openai",
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful and friendly AI assistant."
      }
    ]
  },
  voice: {
    provider: "playht",
    voiceId: "jennifer"
  }
};

function AIAssistant({ assistantId }: AIAssistantProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [vapi, setVapi] = useState<any>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);
  const [currentCallId, setCurrentCallId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeVapi = async () => {
      try {
        setIsInitializing(true);
        
        // Reset and initialize Vapi
        resetVapiInstance();
        const vapiInstance = getVapiInstance();
        console.log('Vapi initialized successfully');

        // Generate a unique call ID
        const generateCallId = () => `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Set up event listeners
        vapiInstance.on("call-start", () => {
          console.log('Call started successfully');
          const newCallId = generateCallId();
          setStatus('Call started');
          setIsCallActive(true);
          setError('');
          setCallStartTime(new Date());
          setCurrentCallId(newCallId);
        });

        vapiInstance.on("call-end", async () => {
          console.log('Call ended');
          setStatus('Call ended');
          setIsCallActive(false);
          setError('');

          // Only log the call if we're authenticated and have an assistant ID
          try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session && callStartTime && currentCallId && assistantId) {
              const endTime = new Date();
              const durationSeconds = Math.round((endTime.getTime() - callStartTime.getTime()) / 1000);

              try {
                const { error: dbError } = await supabase
                  .from('call_logs')
                  .insert([
                    {
                      call_id: currentCallId,
                      assistant_id: assistantId,
                      start_time: callStartTime.toISOString(),
                      end_time: endTime.toISOString(),
                      duration_seconds: durationSeconds,
                      status: 'completed'
                    }
                  ]);

                if (dbError) {
                  console.error('Error storing call log:', dbError);
                }
              } catch (err) {
                console.error('Error storing call log:', err);
              }
            }
          } catch (err) {
            console.error('Error checking session:', err);
          }

          setCallStartTime(null);
          setCurrentCallId(null);
        });

        vapiInstance.on("error", async (error: any) => {
          console.error('Vapi error:', error);
          let errorMessage = 'An error occurred during the call';
          
          if (error.statusCode === 403) {
            errorMessage = 'An error occurred with the voice service. Please try again.';
          } else if (error.errorMsg) {
            errorMessage = error.errorMsg;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          setStatus('Error occurred');
          setError(errorMessage);
          setIsCallActive(false);

          // Only log the error if we're authenticated and have an assistant ID
          try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session && callStartTime && currentCallId && assistantId) {
              const endTime = new Date();
              const durationSeconds = Math.round((endTime.getTime() - callStartTime.getTime()) / 1000);

              try {
                const { error: dbError } = await supabase
                  .from('call_logs')
                  .insert([
                    {
                      call_id: currentCallId,
                      assistant_id: assistantId,
                      start_time: callStartTime.toISOString(),
                      end_time: endTime.toISOString(),
                      duration_seconds: durationSeconds,
                      status: 'failed',
                      error_message: errorMessage
                    }
                  ]);

                if (dbError) {
                  console.error('Error storing failed call log:', dbError);
                }
              } catch (err) {
                console.error('Error storing failed call log:', err);
              }
            }
          } catch (err) {
            console.error('Error checking session:', err);
          }

          setCallStartTime(null);
          setCurrentCallId(null);
        });

        setVapi(vapiInstance);

        // Check microphone permission
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(track => track.stop());
          setHasPermission(true);
        } catch (err) {
          console.log('No initial microphone permission');
          setHasPermission(false);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to initialize Vapi';
        console.error('Error initializing Vapi:', error);
        setError(errorMessage);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeVapi();

    return () => {
      if (vapi && isCallActive) {
        vapi.stop();
      }
    };
  }, [assistantId]);

  const startCall = useCallback(async () => {
    if (!vapi) {
      setError('Vapi client not initialized');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);

      setStatus('Initiating call...');
      setError('');
      
      if (assistantId) {
        console.log('Starting call with assistant ID:', assistantId);
        // Log the exact payload being used
        console.log('Using direct assistant ID for call');
        await vapi.start(assistantId);
      } else {
        console.log('Starting call with default options');
        console.log('Default assistant options payload:', defaultAssistantOptions);
        await vapi.start(defaultAssistantOptions);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'NotAllowedError') {
        setError('Microphone permission was denied. Please allow microphone access to use the AI Assistant.');
        setHasPermission(false);
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Error starting call';
        setStatus('Error starting call');
        setError(errorMessage);
      }
      console.error('Error starting call:', error);
    }
  }, [vapi, assistantId]);

  const endCall = useCallback(() => {
    if (vapi && isCallActive) {
      vapi.stop();
      setStatus('Ending call...');
      setError('');
    }
  }, [vapi, isCallActive]);

  const toggleMute = useCallback(() => {
    if (isCallActive && vapi) {
      vapi.toggleMute();
      setIsMuted(!isMuted);
    }
  }, [isCallActive, isMuted, vapi]);

  if (isInitializing) {
    return (
      <div className="relative bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md mx-auto">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 animate-spin" />
          <span className="text-sm sm:text-base text-gray-400">Initializing AI Assistant...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md mx-auto transform hover:scale-105 transition-all duration-300">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 to-green-500/10 animate-pulse"></div>
      <div className="relative z-10">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-2">
            AI Assistant
          </h2>
          <p className="text-sm sm:text-base text-gray-300">{status || 'Ready to start'}</p>
          {error && (
            <div className="mt-2 p-2 sm:p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-400 text-xs sm:text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="relative w-32 h-32 sm:w-48 sm:h-48 mx-auto">
            <div className={`absolute inset-0 rounded-full ${isCallActive ? 'bg-green-900/20' : 'bg-gray-800/50'} flex items-center justify-center transition-all duration-300`}>
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
                alt="AI Assistant"
                className="w-28 h-28 sm:w-40 sm:h-40 rounded-full object-cover"
              />
            </div>
            {isCallActive && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="flex items-center justify-center bg-green-500/20 text-green-400 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm backdrop-blur-sm">
                  Active Call
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={toggleMute}
              disabled={!isCallActive}
              className={`p-3 sm:p-4 rounded-full transition-all duration-300 ${
                isCallActive
                  ? isMuted
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700/70'
                  : 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
              }`}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <MicOff size={20} className="sm:w-6 sm:h-6" /> : <Mic size={20} className="sm:w-6 sm:h-6" />}
            </button>

            <button
              onClick={isCallActive ? endCall : startCall}
              className={`p-3 sm:p-4 rounded-full transition-all duration-300 ${
                isCallActive
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
              }`}
              aria-label={isCallActive ? "End Call" : "Start Call"}
            >
              {isCallActive ? <PhoneOff size={20} className="sm:w-6 sm:h-6" /> : <Phone size={20} className="sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-400">
          {!hasPermission ? (
            <p>Click the phone button to grant microphone permission</p>
          ) : isCallActive ? (
            <p>Click the microphone to mute/unmute or the phone to end the call</p>
          ) : (
            <p>Click the phone button to start a conversation with the AI Assistant</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AIAssistant;