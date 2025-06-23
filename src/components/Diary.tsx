
import { useState } from 'react';
import { Calendar, TrendingUp, TrendingDown, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUserDiary } from '@/hooks/useUserDiary';
import { useAuth } from '@/hooks/useAuth';

export const Diary = () => {
  const { user } = useAuth();
  const { entries, loading, addEntry, deleteEntry } = useUserDiary();
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 'neutral' as const,
    tags: '',
  });

  const handleAddEntry = async () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) return;

    const tags = newEntry.tags.split(',').map(tag => tag.trim()).filter(Boolean);
    const success = await addEntry(newEntry.title, newEntry.content, newEntry.mood, tags);
    
    if (success) {
      setNewEntry({ title: '', content: '', mood: 'neutral', tags: '' });
      setShowForm(false);
    }
  };

  const getMoodIcon = (mood: string | null) => {
    switch (mood) {
      case 'bullish':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'bearish':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <Calendar className="h-4 w-4 text-blue-400" />;
    }
  };

  const getMoodColor = (mood: string | null) => {
    switch (mood) {
      case 'bullish':
        return 'border-green-400/30 bg-green-400/5';
      case 'bearish':
        return 'border-red-400/30 bg-red-400/5';
      default:
        return 'border-blue-400/30 bg-blue-400/5';
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Calendar className="h-12 w-12 text-muted-foreground" />
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
          <p className="text-muted-foreground">Please sign in to access your investment diary.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Investment Diary</h1>
          <p className="text-muted-foreground">Track your thoughts, decisions, and market insights</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Entry
        </Button>
      </div>

      {/* New Entry Form */}
      {showForm && (
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">New Diary Entry</h2>
          <div className="space-y-4">
            <Input
              placeholder="Entry title..."
              value={newEntry.title}
              onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
              className="bg-background/50 border-border text-foreground placeholder-muted-foreground"
            />
            
            <Textarea
              placeholder="Share your thoughts, market observations, or investment decisions..."
              value={newEntry.content}
              onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
              className="bg-background/50 border-border text-foreground placeholder-muted-foreground min-h-[120px]"
            />
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-foreground mb-2">Mood</label>
                <select
                  value={newEntry.mood}
                  onChange={(e) => setNewEntry({ ...newEntry, mood: e.target.value as any })}
                  className="w-full p-2 bg-background/50 border border-border rounded-md text-foreground"
                >
                  <option value="bullish">Bullish 📈</option>
                  <option value="bearish">Bearish 📉</option>
                  <option value="neutral">Neutral ➡️</option>
                </select>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-foreground mb-2">Tags</label>
                <Input
                  placeholder="e.g., AAPL, earnings, tech"
                  value={newEntry.tags}
                  onChange={(e) => setNewEntry({ ...newEntry, tags: e.target.value })}
                  className="bg-background/50 border-border text-foreground placeholder-muted-foreground"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleAddEntry} className="bg-gradient-to-r from-green-400 to-blue-500">
                Save Entry
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="border-border text-foreground">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Entries List */}
      <div className="space-y-4">
        {loading ? (
          <div className="glass-card p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your diary entries...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No entries yet</h3>
            <p className="text-muted-foreground mb-4">Start documenting your investment journey</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-green-400 to-blue-500"
            >
              Create Your First Entry
            </Button>
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className={`glass-card p-6 border ${getMoodColor(entry.mood)}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getMoodIcon(entry.mood)}
                  <h3 className="text-lg font-semibold text-foreground">{entry.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {new Date(entry.created_at).toLocaleDateString()} at {new Date(entry.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteEntry(entry.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-foreground mb-4 whitespace-pre-wrap">{entry.content}</p>
              
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-accent rounded-full text-xs text-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      {entries.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Your Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{entries.length}</div>
              <div className="text-sm text-muted-foreground">Total Entries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {entries.filter(e => e.mood === 'bullish').length}
              </div>
              <div className="text-sm text-muted-foreground">Bullish Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {entries.filter(e => e.mood === 'bearish').length}
              </div>
              <div className="text-sm text-muted-foreground">Bearish Days</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
