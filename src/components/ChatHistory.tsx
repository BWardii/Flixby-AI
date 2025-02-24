import React, { useEffect, useState } from 'react';
import { MessageSquare, Trash2, Clock } from 'lucide-react';
import { ChatSession, getChatSessions, deleteChatSession } from '../lib/chat';

interface ChatHistoryProps {
  onSelectSession: (sessionId: string) => void;
}

export default function ChatHistory({ onSelectSession }: ChatHistoryProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    try {
      const data = await getChatSessions();
      setSessions(data);
    } catch (err) {
      setError('Failed to load chat history');
      console.error('Error loading sessions:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteSession(sessionId: string, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await deleteChatSession(sessionId);
      setSessions(sessions.filter(session => session.id !== sessionId));
    } catch (err) {
      console.error('Error deleting session:', err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 p-4 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <MessageSquare className="w-5 h-5 mr-2 text-green-400" />
        Chat History
      </h2>
      
      <div className="space-y-2">
        {sessions.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No chat history yet</p>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 cursor-pointer transition-colors"
            >
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-4 h-4 text-green-400" />
                <div>
                  <h3 className="font-medium">{session.title}</h3>
                  <p className="text-sm text-gray-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(session.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => handleDeleteSession(session.id, e)}
                className="p-2 hover:bg-red-500/20 rounded-full transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}