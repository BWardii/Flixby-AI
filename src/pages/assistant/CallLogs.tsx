import React, { useEffect, useState } from 'react';
import { PhoneCall, Calendar, Clock, User, Bot, AlertCircle, Loader2, Info, FileText, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getAssistant } from '../../lib/assistant';

interface CallLog {
  id: string;
  call_id: string;
  assistant_id: string;
  start_time: string;
  end_time: string;
  duration_seconds: number;
  status: 'completed' | 'failed' | 'interrupted';
  error_message?: string;
  transcript?: string;
  created_at: string;
}

function CallLogs() {
  const [logs, setLogs] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assistant, setAssistant] = useState<any>(null);

  useEffect(() => {
    loadCallLogs();
  }, []);

  const loadCallLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the current user's assistant
      const assistantData = await getAssistant();
      
      if (!assistantData?.assistant_id) {
        setError('No assistant found. Create an assistant to view call logs.');
        return;
      }

      setAssistant(assistantData);

      // Fetch call logs from Supabase
      const { data: callLogs, error: dbError } = await supabase
        .from('call_logs')
        .select('*')
        .eq('assistant_id', assistantData.assistant_id)
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;

      setLogs(callLogs || []);
    } catch (err) {
      console.error('Error loading call logs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load call logs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6 md:p-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
            <span className="text-gray-300">Loading call logs...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-10">
        <div className="bg-gray-800/60 backdrop-blur-xl rounded-xl border border-gray-700/50 p-8">
          <div className="flex items-center space-x-4 mb-6">
            <AlertCircle className="h-8 w-8 text-red-400" />
            <h2 className="text-xl font-medium text-white">Error Loading Call Logs</h2>
          </div>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      {/* Step Indicator for the page */}
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
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-600 text-white font-medium">
              ✓
            </div>
            <span className="ml-2 text-gray-300 font-medium">Talk to Flixby</span>
          </div>
          <div className="h-px w-8 bg-gray-700"></div>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-medium">
              3
            </div>
            <span className="ml-2 text-purple-300 font-medium">Launch</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/60 backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-md overflow-hidden">
        <div className="border-b border-gray-700/50 p-6 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-900/50 rounded-lg flex items-center justify-center mr-3">
              <PhoneCall className="h-5 w-5 text-purple-400" />
            </div>
            <h2 className="text-lg font-medium text-white">Call Logs</h2>
          </div>
          {assistant && (
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-700/50 rounded-lg">
              <Bot className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-gray-300">{assistant.name}</span>
            </div>
          )}
        </div>

        <div className="p-6">
          {logs.length === 0 ? (
            <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-gray-700/50">
              <PhoneCall className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-300 font-medium">No calls recorded yet</p>
              <p className="text-sm text-gray-400 mt-2">
                Test your AI assistant to see call logs appear here
              </p>
            </div>
          ) : (
            <div>
              <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50 mb-6">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-gray-300">
                    Below are the logs of all conversations with your AI assistant. These logs help you track usage and improve performance.
                  </p>
                </div>
              </div>
              
              <div className="overflow-hidden border border-gray-700/50 rounded-lg">
                <table className="min-w-full divide-y divide-gray-700/50">
                  <thead className="bg-gray-900/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date & Time</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Duration</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Details</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800/30 divide-y divide-gray-700/50">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-700/30">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{formatDate(log.start_time)}</div>
                          <div className="text-xs text-gray-400">{formatTime(log.start_time)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-400 mr-1.5" />
                            <span className="text-sm text-white">{formatDuration(log.duration_seconds)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            log.status === 'completed'
                              ? 'bg-green-900/30 text-green-400'
                              : log.status === 'failed'
                              ? 'bg-red-900/30 text-red-400'
                              : 'bg-yellow-900/30 text-yellow-400'
                          }`}>
                            {log.status === 'completed' ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : log.status === 'failed' ? (
                              <XCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <AlertCircle className="h-3 w-3 mr-1" />
                            )}
                            {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          <button className="text-purple-400 hover:text-purple-300 font-medium flex items-center">
                            <FileText className="h-4 w-4 mr-1" />
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CallLogs;