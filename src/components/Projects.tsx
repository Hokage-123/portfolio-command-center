import React, { useState } from 'react';
import { useApp, Project, Milestone } from '../contexts/AppContext';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Target, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Sparkles
} from 'lucide-react';
import { geminiService } from '../services/gemini';

const Projects: React.FC = () => {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'planning' | 'in-progress' | 'completed' | 'on-hold'>('all');
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isGeneratingProject, setIsGeneratingProject] = useState(false);

  const filteredProjects = state.projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    planning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'in-progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'on-hold': 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const priorityColors = {
    low: 'bg-slate-500/20 text-slate-400',
    medium: 'bg-amber-500/20 text-amber-400',
    high: 'bg-red-500/20 text-red-400'
  };

  const handleCreateProject = async (projectData: Partial<Project>) => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: projectData.title || '',
      description: projectData.description || '',
      status: 'planning',
      progress: 0,
      startDate: new Date().toISOString().split('T')[0],
      milestones: [],
      tags: projectData.tags || [],
      priority: projectData.priority || 'medium',
      ...projectData
    };

    dispatch({ type: 'ADD_PROJECT', payload: newProject });
    setShowNewProjectForm(false);
  };

  const handleGenerateProjectIdeas = async () => {
    setIsGeneratingProject(true);
    try {
      const prompt = `Generate 3 creative project ideas for a developer/designer portfolio. 
                     Each should include: title, description, key features, and suggested technologies.
                     Focus on innovative, practical projects that showcase different skills.`;
      
      const response = await geminiService.generateContent(prompt);
      
      // For demonstration, we'll show the AI response in an alert
      // In a real app, you might parse this and create actual project suggestions
      alert(`AI Project Ideas:\n\n${response}`);
    } catch (error) {
      console.error('Failed to generate project ideas:', error);
      alert('AI project generation is currently unavailable. Please configure your Gemini API key.');
    } finally {
      setIsGeneratingProject(false);
    }
  };

  const updateProjectProgress = (projectId: string, milestones: Milestone[]) => {
    const completedMilestones = milestones.filter(m => m.completed).length;
    const progress = milestones.length > 0 ? Math.round((completedMilestones / milestones.length) * 100) : 0;
    
    const updatedProject = state.projects.find(p => p.id === projectId);
    if (updatedProject) {
      dispatch({ 
        type: 'UPDATE_PROJECT', 
        payload: { ...updatedProject, progress, milestones }
      });
    }
  };

  const toggleMilestone = (projectId: string, milestoneId: string) => {
    const project = state.projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedMilestones = project.milestones.map(milestone =>
      milestone.id === milestoneId
        ? { ...milestone, completed: !milestone.completed }
        : milestone
    );

    updateProjectProgress(projectId, updatedMilestones);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-slate-400">Manage your projects and track progress</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerateProjectIdeas}
            disabled={isGeneratingProject}
            className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {isGeneratingProject ? 'Generating...' : 'AI Ideas'}
          </button>
          <button
            onClick={() => setShowNewProjectForm(true)}
            className="bg-gradient-to-r from-blue-500 to-violet-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/25 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-800/50 border border-slate-700/50 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          >
            <option value="all">All Status</option>
            <option value="planning">Planning</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{project.title}</h3>
                  <p className="text-slate-400 text-sm line-clamp-2">{project.description}</p>
                </div>
                <button className="text-slate-400 hover:text-white transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Status and Priority */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[project.status]}`}>
                  {project.status.replace('-', ' ')}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[project.priority]}`}>
                  {project.priority} priority
                </span>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-400">Progress</span>
                  <span className="text-sm text-white font-medium">{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-violet-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Milestones */}
              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                  <Target className="w-4 h-4" />
                  <span>
                    {project.milestones.filter(m => m.completed).length} / {project.milestones.length} milestones
                  </span>
                </div>
                {project.milestones.slice(0, 3).map((milestone) => (
                  <div key={milestone.id} className="flex items-center gap-2 text-sm mb-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMilestone(project.id, milestone.id);
                      }}
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                        milestone.completed
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-600 hover:border-emerald-500'
                      }`}
                    >
                      {milestone.completed && <CheckCircle className="w-3 h-3" />}
                    </button>
                    <span className={`${milestone.completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                      {milestone.title}
                    </span>
                  </div>
                ))}
                {project.milestones.length > 3 && (
                  <div className="text-xs text-slate-500">
                    +{project.milestones.length - 3} more milestones
                  </div>
                )}
              </div>

              {/* Tags */}
              {project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="bg-violet-500/20 text-violet-300 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="text-slate-500 text-xs">+{project.tags.length - 3}</span>
                  )}
                </div>
              )}

              {/* Dates */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Started {new Date(project.startDate).toLocaleDateString()}</span>
                </div>
                {project.endDate && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Due {new Date(project.endDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-400 mb-2">No projects found</h3>
          <p className="text-slate-500 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Create your first project to get started'
            }
          </p>
          <button
            onClick={() => setShowNewProjectForm(true)}
            className="bg-gradient-to-r from-blue-500 to-violet-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/25"
          >
            Create Project
          </button>
        </div>
      )}

      {/* New Project Form Modal */}
      {showNewProjectForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold text-white mb-4">Create New Project</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const tags = (formData.get('tags') as string)?.split(',').map(tag => tag.trim()).filter(Boolean) || [];
              
              handleCreateProject({
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                priority: formData.get('priority') as 'low' | 'medium' | 'high',
                endDate: formData.get('endDate') as string || undefined,
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
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
                  <select
                    name="priority"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium" selected>Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Due Date (Optional)</label>
                  <input
                    type="date"
                    name="endDate"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    name="tags"
                    placeholder="react, typescript, web"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewProjectForm(false)}
                  className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:text-white hover:border-slate-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-200"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-2">{selectedProject.title}</h2>
                <p className="text-slate-400">{selectedProject.description}</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Project Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[selectedProject.status]}`}>
                  {selectedProject.status.replace('-', ' ')}
                </span>
                <span className={`px-3 py-1 rounded text-sm font-medium ${priorityColors[selectedProject.priority]}`}>
                  {selectedProject.priority} priority
                </span>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Progress</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-400">Overall completion</span>
                  <span className="text-white font-medium">{selectedProject.progress}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-violet-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${selectedProject.progress}%` }}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Milestones</h3>
                {selectedProject.milestones.length > 0 ? (
                  <div className="space-y-3">
                    {selectedProject.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                        <button
                          onClick={() => toggleMilestone(selectedProject.id, milestone.id)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors mt-0.5 ${
                            milestone.completed
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-600 hover:border-emerald-500'
                          }`}
                        >
                          {milestone.completed && <CheckCircle className="w-4 h-4" />}
                        </button>
                        <div className="flex-1">
                          <h4 className={`font-medium ${milestone.completed ? 'text-slate-500 line-through' : 'text-white'}`}>
                            {milestone.title}
                          </h4>
                          <p className="text-slate-400 text-sm">{milestone.description}</p>
                          <div className="text-xs text-slate-500 mt-1">
                            Due: {new Date(milestone.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400">No milestones defined yet</p>
                )}
              </div>

              {selectedProject.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag) => (
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

export default Projects;
