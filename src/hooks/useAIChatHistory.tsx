
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatHistory {
  id: string;
  chat_name: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export const useAIChatHistory = () => {
  const { user } = useAuth();
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [loading, setLoading] = useState(false);

  // Load user's chat history from database
  const loadChatHistory = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_ai_chats')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setChatHistory(data || []);
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save a chat session
  const saveChatSession = async (chatName: string, messages: ChatMessage[]) => {
    if (!user) {
      toast.error('Please sign in to save chat history');
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_ai_chats')
        .insert({
          user_id: user.id,
          chat_name: chatName,
          messages: messages
        });

      if (error) throw error;
      
      toast.success('Chat session saved');
      loadChatHistory(); // Refresh the list
      return true;
    } catch (error) {
      toast.error('Failed to save chat session');
      console.error('Error saving chat session:', error);
      return false;
    }
  };

  // Update existing chat session
  const updateChatSession = async (chatId: string, messages: ChatMessage[]) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_ai_chats')
        .update({
          messages: messages,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('id', chatId);

      if (error) throw error;
      
      loadChatHistory(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error updating chat session:', error);
      return false;
    }
  };

  // Delete chat session
  const deleteChatSession = async (chatId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_ai_chats')
        .delete()
        .eq('user_id', user.id)
        .eq('id', chatId);

      if (error) throw error;
      
      toast.success('Chat session deleted');
      loadChatHistory(); // Refresh the list
      return true;
    } catch (error) {
      toast.error('Failed to delete chat session');
      console.error('Error deleting chat session:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      loadChatHistory();
    } else {
      setChatHistory([]);
    }
  }, [user]);

  return {
    chatHistory,
    loading,
    saveChatSession,
    updateChatSession,
    deleteChatSession,
    loadChatHistory
  };
};
