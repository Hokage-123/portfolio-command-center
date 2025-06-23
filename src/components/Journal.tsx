import React, { useState } from 'react';
import { useApp, JournalEntry } from '../contexts/AppContext';
import { geminiService } from '../services/gemini';
import { 
  Plus, 
  Search, 
  Calendar, 
  BookOpen, 
  Edit,
  Trash2,
  Sparkles,
  TrendingUp,
  Heart,
  Smile,
  Meh,
  Frown,
  AlertTriangle
} from 'lucide-react';

const Journal: React.FC = () => {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState<'all' | 'great' | 'good' | 'okay' | 'challenging' | 'difficult'>('all');
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [insights, setInsights] = useState<string>('');

  const moodIcons = {
    great: { icon: Heart, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
    good: { icon: Smile, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    okay: { icon: Meh, color: 'text-amber-400', bg: 'bg-amber-500/20' },
    challenging: { icon: Frown, color: 'text-orange-400', bg: 'bg-orange-500/20' },
    difficult: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/20' }
  };

  const filteredEntries = state.journalEntries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = selectedMood === 'all' || entry.mood === selectedMood;
    return matchesSearch && matchesMood;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleCreateEntry = (entryData: Partial<JournalEntry>) => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      title: entryData.title || '',
      content: entryData.content || '',
      mood: entryData.mood || 'okay',
      tags: entryData.tags || [],
      ...entryData
    };

    dispatch({ type: 'ADD_JOURNAL_ENTRY', payload: newEntry });
    setShowNewEntryForm(false);
  };

  const handleGenerateInsights = async () => {
    setIsGeneratingInsights(true);
    try {
      const response = await geminiService.generateInsights(state.journalEntries);
      setInsights(response);
    } catch (error) {
      console.error('Failed to generate insights:', error);
      setInsights('AI insights are currently unavailable. Please configure your Gemini API key to enable this feature.');
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const getMoodStats = () => {
    const moodCounts = state.journalEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(moodCounts).map(([mood, count]) => ({
      mood: mood as keyof typeof moodIcons,
      count,
      percentage: Math.round((count / state.journalEntries.length) * 100)
    }));
  };

  const getRecentTrend = () => {
    const recentEntries = state.journalEntries
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 7);

    const moodValues = {
      great: 5,
      good: 4,
      okay: 3,
      challenging: 2,
      difficult: 1
    };

    const average = recentEntries.reduce((sum, entry) => sum + moodValues[entry.mood], 0) / recentEntries.length;
    return {
      average: Math.round(average * 10) / 10,
      trend: average > 3.5 ? 'positive' : average > 2.5 ? 'neutral' : 'needs attention'
    };
  };

  const moodStats = getMoodStats();
  const recentTrend = getRecentTrend();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Journal</h1>
          <p className="text-slate-400">Track your thoughts and progress</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerateInsights}
            disabled={isGeneratingInsights || state.journalEntries.length === 0}
            className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {isGeneratingInsights ? 'Analyzing...' : 'Get Insights'}
          </button>
          <button
            onClick={() => setShowNewEntryForm(true)}
            className="bg-gradient-to-r from-blue-500 to-violet-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/25 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Entry
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {state.journalEntries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Entries</p>
                <p className="text-2xl font-bold text-white">{state.journalEntries.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${
                recentTrend.trend === 'positive' ? 'bg-emerald-500/20' :
                recentTrend.trend === 'neutral' ? 'bg-amber-500/20' : 'bg-red-500/20'
              }`}>
                <TrendingUp className={`w-6 h-6 ${
                  recentTrend.trend === 'positive' ? 'text-emerald-400' :
                  recentTrend.trend === 'neutral' ? 'text-amber-400' : 'text-red-400'
                }`} />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Recent Trend</p>
                <p className="text-2xl font-bold text-white">{recentTrend.average}/5</p>
              </div>
            </div>
            <p className={`text-sm ${
              recentTrend.trend === 'positive' ? 'text-emerald-400' :
              recentTrend.trend === 'neutral' ? 'text-amber-400' : 'text-red-400'
            }`}>
              {recentTrend.trend === 'positive' ? 'Looking good!' :
               recentTrend.trend === 'neutral' ? 'Steady progress' : 'Needs attention'}
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-violet-500/20 rounded-lg">
                <Calendar className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">This Month</p>
                <p className="text-2xl font-bold text-white">
                  {state.journalEntries.filter(entry => 
                    new Date(entry.date).getMonth() === new Date().getMonth()
                  ).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mood Distribution */}
      {moodStats.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Mood Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {moodStats.map(({ mood, count, percentage }) => {
              const MoodIcon = moodIcons[mood].icon;
              return (
                <div key={mood} className="text-center">
                  <div className={`w-16 h-16 rounded-full ${moodIcons[mood].bg} flex items-center justify-center mx-auto mb-2`}>
                    <MoodIcon className={`w-8 h-8 ${moodIcons[mood].color}`} />
                  </div>
                  <p className="text-white font-medium capitalize">{mood}</p>
                  <p className="text-slate-400 text-sm">{count} entries ({percentage}%)</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Insights */}
      {insights && (
        <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400" />
            AI Insights
          </h3>
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300 whitespace-pre-line">{insights}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedMood}
            onChange={(e) => setSelectedMood(e.target.value as any)}
            className="bg-slate-800/50 border border-slate-700/50 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          >
            <option value="all">All Moods</option>
            <option value="great">Great</option>
            <option value="good">Good</option>
            <option value="okay">Okay</option>
            <option value="challenging">Challenging</option>
            <option value="difficult">Difficult</option>
          </select>
        </div>
      </div>

      {/* Journal Entries */}
      {filteredEntries.length > 0 ? (
        <div className="space-y-4">
          {filteredEntries.map((entry) => {
            const MoodIcon = moodIcons[entry.mood].icon;
            return (
              <div
                key={entry.id}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedEntry(entry)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${moodIcons[entry.mood].bg}`}>
                      <MoodIcon className={`w-5 h-5 ${moodIcons[entry.mood].color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{entry.title}</h3>
                      <p className="text-slate-400 text-sm">{new Date(entry.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${moodIcons[entry.mood].bg} ${moodIcons[entry.mood].color}`}>
                    {entry.mood}
                  </span>
                </div>
                
                <p className="text-slate-300 line-clamp-3 mb-4">{entry.content}</p>
                
                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag) => (
                      <span key={tag} className="bg-violet-500/20 text-violet-300 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-400 mb-2">No journal entries found</h3>
          <p className="text-slate-500 mb-6">
            {searchTerm || selectedMood !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Start your journaling journey today'
            }
          </p>
          <button
            onClick={() => setShowNewEntryForm(true)}
            className="bg-gradient-to-r from-blue-500 to-violet-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/25"
          >
            Write First Entry
          </button>
        </div>
      )}

      {/* New Entry Form Modal */}
      {showNewEntryForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-white mb-4">New Journal Entry</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const tags = (formData.get('tags') as string)?.split(',').map(tag => tag.trim()).filter(Boolean) || [];
              
              handleCreateEntry({
                title: formData.get('title') as string,
                content: formData.get('content') as string,
                mood: formData.get('mood') as any,
                tags
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="What's on your mind?"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Content</label>
                  <textarea
                    name="content"
                    rows={6}
                    required
                    placeholder="Write about your day, thoughts, or progress..."
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Mood</label>
                  <div className="grid grid-cols-5 gap-2">
                    {Object.entries(moodIcons).map(([mood, { icon: Icon, color, bg }]) => (
                      <label key={mood} className="cursor-pointer">
                        <input
                          type="radio"
                          name="mood"
                          value={mood}
                          defaultChecked={mood === 'okay'}
                          className="sr-only peer"
                        />
                        <div className={`p-3 rounded-lg border-2 border-transparent peer-checked:border-violet-500 ${bg} hover:bg-opacity-80 transition-all duration-200`}>
                          <Icon className={`w-6 h-6 ${color} mx-auto`} />
                          <p className="text-xs text-center mt-1 capitalize text-slate-300">{mood}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    name="tags"
                    placeholder="work, personal, goals"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewEntryForm(false)}
                  className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:text-white hover:border-slate-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-200"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Entry Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${moodIcons[selectedEntry.mood].bg}`}>
                  {React.createElement(moodIcons[selectedEntry.mood].icon, {
                    className: `w-6 h-6 ${moodIcons[selectedEntry.mood].color}`
                  })}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white">{selectedEntry.title}</h2>
                  <p className="text-slate-400">{new Date(selectedEntry.date).toLocaleDateString()}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 whitespace-pre-line">{selectedEntry.content}</p>
              </div>
              
              {selectedEntry.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedEntry.tags.map((tag) => (
                      <span key={tag} className="bg-violet-500/20 text-violet-300 px-3 py-1 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Journal;
