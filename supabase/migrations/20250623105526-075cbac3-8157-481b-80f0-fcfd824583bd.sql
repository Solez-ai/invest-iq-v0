
-- Create table for user watchlist/favorites
CREATE TABLE public.user_watchlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  company_name TEXT,
  asset_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, symbol)
);

-- Create table for user diary entries
CREATE TABLE public.user_diary_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  mood TEXT CHECK (mood IN ('bullish', 'bearish', 'neutral')),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for user settings
CREATE TABLE public.user_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  theme TEXT DEFAULT 'dark',
  currency TEXT DEFAULT 'USD',
  notifications BOOLEAN DEFAULT true,
  live_updates BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create table for AI chat history
CREATE TABLE public.user_ai_chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  chat_name TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ai_chats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_watchlist
CREATE POLICY "Users can view their own watchlist" 
  ON public.user_watchlist FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own watchlist" 
  ON public.user_watchlist FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own watchlist" 
  ON public.user_watchlist FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own watchlist" 
  ON public.user_watchlist FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for user_diary_entries
CREATE POLICY "Users can view their own diary entries" 
  ON public.user_diary_entries FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own diary entries" 
  ON public.user_diary_entries FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diary entries" 
  ON public.user_diary_entries FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diary entries" 
  ON public.user_diary_entries FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for user_settings
CREATE POLICY "Users can view their own settings" 
  ON public.user_settings FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own settings" 
  ON public.user_settings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" 
  ON public.user_settings FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for user_ai_chats
CREATE POLICY "Users can view their own AI chats" 
  ON public.user_ai_chats FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI chats" 
  ON public.user_ai_chats FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI chats" 
  ON public.user_ai_chats FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI chats" 
  ON public.user_ai_chats FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to automatically create default settings for new users
CREATE OR REPLACE FUNCTION public.handle_user_settings()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Create trigger to auto-create settings for new users
CREATE TRIGGER on_auth_user_created_settings
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_settings();
