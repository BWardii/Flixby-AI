import { supabase } from './supabase';

export interface Assistant {
  id: string;
  name: string;
  first_message: string;
  system_prompt: string;
  language: string;
  voice_id: string;
  temperature: number;
  assistant_id?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export async function createAssistant(assistant: Omit<Assistant, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to create an assistant');
    }

    // Delete any existing assistants for this user
    await supabase
      .from('assistants')
      .delete()
      .eq('user_id', user.id);

    // Create the new assistant
    const { data, error } = await supabase
      .from('assistants')
      .insert([{
        ...assistant,
        user_id: user.id
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating assistant:', error);
    throw error;
  }
}

export async function getAssistant(): Promise<Assistant | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('assistants')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No assistant found
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error getting assistant:', error);
    throw error;
  }
}

export async function updateAssistant(id: string, updates: Partial<Assistant>) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to update an assistant');
    }

    const { data, error } = await supabase
      .from('assistants')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating assistant:', error);
    throw error;
  }
}

export async function deleteAssistant(id: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to delete an assistant');
    }

    const { error } = await supabase
      .from('assistants')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting assistant:', error);
    throw error;
  }
}