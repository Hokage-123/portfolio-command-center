import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { geminiService } from '../services/gemini';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  Calendar,
  Target,
  BookOpen
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isGeneratingUpdate, setIsGeneratingUpdate] = useState(false);
  const [generatedUpdate, setGeneratedUpdate] = useState<string>('');

  // Calculate dashboard metrics
  const totalProjects = state.projects.length;
  const completedProjects = state.projects.filter(p => p.status === 'completed').length;
  const inProgressProjects = state.projects.filter(p => p.status === 'in-progress').length;
  const recentJournalEntries = state.journalEntries.slice(-5);

  const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

  // Chart data
  const projectStatusData = {
    labels: ['Completed', 'In Progress', 'Planning', 'On Hold'],
    datasets: [
      {
        data: [
          completedProjects,
          inProgressProjects,
          state.projects.filter(p => p.status === 'planning').length,
          state.projects.filter(p => p.status === 'on-hold').length,
        ],
        backgroundColor: [
          '#10b981', // emerald-500
          '#3b82f6', // blue-500
          '#f59e0b', // amber-500
          '#ef4444', // red-500
        ],
        borderWidth: 0,
      },
    ],
  };

  const progressData = {
    labels: state.projects.map(p => p.title),
    datasets: [
      {
        label: 'Project Progress (%)',
        data: state.projects.map(p => p.progress),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#cbd5e1',
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: '#cbd5e1',
        },
        grid: {
          color: 'rgba(203, 213, 225, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#cbd5e1',
        },
        grid: {
          color: 'rgba(203, 213, 225, 0.1)',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#cbd5e1',
        },
        position: 'bottom' as const,
      },
    },
  };

  const handleGenerateStatusUpdate = async () => {
    setIsGeneratingUpdate(true);
    try {
      const projectSummary = {
        totalProjects,
        completedProjects,
        inProgressProjects,
        completionRate,
        recentActivity: recentJournalEntries.map(entry => ({
          date: entry.date,
          title: entry.title,
          mood: entry.mood
        }))
      };
      
      const update = await geminiService.generateStatusUpdate(projectSummary);
      setGeneratedUpdate(update);
    } catch (error) {
      console.error('Failed to generate status update:', error);
      setGeneratedUpdate('AI features are currently unavailable. Please configure your Gemini API key in the environment variables.');
    } finally {
      setIsGeneratingUpdate(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">Track your progress and get insights</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerateStatusUpdate}
            disabled={isGeneratingUpdate}
            className="bg-gradient-to-r from-blue-500 to-violet-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {isGeneratingUpdate ? 'Generating...' : 'Generate Status Update'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Projects</p>
              <p className="text-2xl font-bold text-white">{totalProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Completed</p>
              <p className="text-2xl font-bold text-white">{completedProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">In Progress</p>
              <p className="text-2xl font-bold text-white">{inProgressProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Completion Rate</p>
              <p className="text-2xl font-bold text-white">{completionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Project Status Chart */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-violet-400" />
            Project Status Distribution
          </h3>
          <div className="h-64">
            <Doughnut data={projectStatusData} options={doughnutOptions} />
          </div>
        </div>

        {/* Progress Chart */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-violet-400" />
            Project Progress
          </h3>
          <div className="h-64">
            <Bar data={progressData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* AI Generated Status Update */}
      {generatedUpdate && (
        <div className="bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-violet-500/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400" />
            AI Status Update
          </h3>
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300 whitespace-pre-line">{generatedUpdate}</p>
          </div>
        </div>
      )}

      {/* Recent Journal Entries */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-violet-400" />
          Recent Journal Entries
        </h3>
        {recentJournalEntries.length > 0 ? (
          <div className="space-y-3">
            {recentJournalEntries.map((entry) => (
              <div key={entry.id} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                <div className="flex-shrink-0">
                  <Calendar className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{entry.title}</p>
                  <p className="text-slate-400 text-sm">{new Date(entry.date).toLocaleDateString()}</p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  entry.mood === 'great' ? 'bg-emerald-500/20 text-emerald-400' :
                  entry.mood === 'good' ? 'bg-blue-500/20 text-blue-400' :
                  entry.mood === 'okay' ? 'bg-amber-500/20 text-amber-400' :
                  entry.mood === 'challenging' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {entry.mood}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No journal entries yet</p>
            <button
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'journal' })}
              className="text-violet-400 hover:text-violet-300 font-medium mt-2"
            >
              Start journaling →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
