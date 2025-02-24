import React, { useEffect, useState } from 'react';
import { PhoneCall, Calendar, Clock, User, Bot, AlertCircle, Loader2 } from 'lucide-react';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 text-green-400 animate-spin" />
          <span className="text-gray-400">Loading call logs...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8">
        <div className="flex items-center space-x-4 mb-8">
          <AlertCircle className="h-8 w-8 text-red-400" />
          <h2 className="text-2xl font-bold">Error Loading Call Logs</h2>
        </div>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <PhoneCall className="h-8 w-8 text-green-400" />
          <h2 className="text-2xl font-bold">Call Logs</h2>
        </div>
        {assistant && (
          <div className="flex items-center space-x-2 px-4 py-2 bg-gray-900/50 rounded-lg">
            <Bot className="h-5 w-5 text-green-400" />
            <span className="text-gray-300">{assistant.name}</span>
          </div>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-12">
          <PhoneCall className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No calls recorded yet</p>
          <p className="text-sm text-gray-500 mt-2">
            Test your AI assistant to see call logs appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-gray-900/50 rounded-lg p-6 hover:bg-gray-900/70 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-6 text-sm text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(log.start_time).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(log.start_time).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <PhoneCall className="h-4 w-4" />
                      <span>{formatDuration(log.duration_seconds)}</span>
                    </div>
                  </div>

                  {log.error_message && (
                    <p className="text-red-400 text-sm mt-2">{log.error_message}</p>
                  )}

                  {log.transcript && (
                    <p className="text-gray-300 mt-2">{log.transcript}</p>
                  )}
                </div>

                <div className={`px-3 py-1 rounded-full text-sm ${
                  log.status === 'completed'
                    ? 'bg-green-500/20 text-green-400'
                    : log.status === 'failed'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CallLogs;