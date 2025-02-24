import { supabase } from './supabase';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export async function createChatSession(title: string) {
  const { data: session, error } = await supabase
    .from('chat_sessions')
    .insert([{ title }])
    .select()
    .single();

  if (error) throw error;
  return session;
}

export async function saveChatMessage(sessionId: string, role: 'user' | 'assistant', content: string) {
  const { data: message, error } = await supabase
    .from('chat_messages')
    .insert([{ session_id: sessionId, role, content }])
    .select()
    .single();

  if (error) throw error;
  return message;
}

export async function getChatSessions() {
  const { data: sessions, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return sessions;
}

export async function getChatMessages(sessionId: string) {
  const { data: messages, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return messages;
}

export async function deleteChatSession(sessionId: string) {
  const { error } = await supabase
    .from('chat_sessions')
    .delete()
    .eq('id', sessionId);

  if (error) throw error;
}