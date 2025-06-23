import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { geminiService } from '../services/gemini';
import { 
  Sparkles, 
  User, 
  Target, 
  Rocket, 
  CheckCircle, 
  ArrowRight,
  ArrowLeft,
  Star,
  Briefcase,
  Code,
  Palette,
  TrendingUp
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const Onboarding: React.FC = () => {
  const { state, dispatch } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [isGeneratingGuide, setIsGeneratingGuide] = useState(false);
  const [customGuide, setCustomGuide] = useState<string>('');
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    role: '',
    experience: '',
    goals: '',
    interests: [] as string[]
  });

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Portfolio Command Center',
      description: 'Your personal project management and portfolio showcase platform',
      icon: Sparkles
    },
    {
      id: 'profile',
      title: 'Tell us about yourself',
      description: 'Help us personalize your experience',
      icon: User
    },
    {
      id: 'goals',
      title: 'What are your goals?',
      description: 'Define what you want to achieve',
      icon: Target
    },
    {
      id: 'ai-guide',
      title: 'Get your AI-powered guide',
      description: 'Receive personalized recommendations',
      icon: Sparkles
    },
    {
      id: 'ready',
      title: 'You\'re all set!',
      description: 'Start building your digital command center',
      icon: Rocket
    }
  ];

  const roleOptions = [
    { id: 'developer', label: 'Developer', icon: Code },
    { id: 'designer', label: 'Designer', icon: Palette },
    { id: 'product-manager', label: 'Product Manager', icon: TrendingUp },
    { id: 'freelancer', label: 'Freelancer', icon: Briefcase },
    { id: 'student', label: 'Student', icon: Star },
    { id: 'other', label: 'Other', icon: User }
  ];

  const experienceOptions = [
    { id: 'beginner', label: '0-1 years', description: 'Just starting out' },
    { id: 'intermediate', label: '1-3 years', description: 'Building experience' },
    { id: 'experienced', label: '3-5 years', description: 'Solid foundation' },
    { id: 'senior', label: '5+ years', description: 'Seasoned professional' }
  ];

  const goalOptions = [
    'Build a professional portfolio',
    'Manage personal projects',
    'Track learning progress',
    'Showcase work to clients',
    'Improve productivity',
    'Document achievements',
    'Network with professionals',
    'Find new opportunities'
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerateGuide = async () => {
    setIsGeneratingGuide(true);
    try {
      const userGoals = `Role: ${userProfile.role}, Experience: ${userProfile.experience}, Goals: ${userProfile.goals}, Interests: ${userProfile.interests.join(', ')}`;
      const guide = await geminiService.generateOnboardingGuide(userGoals);
      setCustomGuide(guide);
    } catch (error) {
      console.error('Failed to generate guide:', error);
      setCustomGuide('Welcome to Portfolio Command Center! Here are some general recommendations to get you started:\n\n1. Start by creating your first project in the Projects section\n2. Document your progress in the Journal\n3. Showcase your best work in the Portfolio section\n4. Use the Dashboard to track your overall progress\n\nAI features are currently unavailable. Please configure your Gemini API key to get personalized recommendations.');
    } finally {
      setIsGeneratingGuide(false);
    }
  };

  const handleComplete = () => {
    // Create user profile
    dispatch({
      type: 'SET_USER',
      payload: {
        name: userProfile.name,
        email: userProfile.email,
        isAuthenticated: true
      }
    });

    // Navigate to dashboard
    dispatch({ type: 'SET_VIEW', payload: 'dashboard' });
  };

  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">Getting Started</h1>
            <span className="text-slate-400">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-violet-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
          {/* Step Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <StepIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">{currentStepData.title}</h2>
            <p className="text-slate-400 text-lg">{currentStepData.description}</p>
          </div>

          {/* Step Content */}
          <div className="min-h-96">
            {currentStep === 0 && (
              <div className="text-center space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-slate-700/30 rounded-xl p-6">
                    <Briefcase className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Portfolio Showcase</h3>
                    <p className="text-slate-400">Display your best work professionally</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-xl p-6">
                    <Target className="w-12 h-12 text-violet-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Project Management</h3>
                    <p className="text-slate-400">Track progress and manage tasks</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-xl p-6">
                    <Sparkles className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">AI Assistance</h3>
                    <p className="text-slate-400">Get smart insights and suggestions</p>
                  </div>
                </div>
                <p className="text-slate-300 text-lg">
                  Let's set up your personalized experience in just a few steps.
                </p>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                    <input
                      type="text"
                      value={userProfile.name}
                      onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">What best describes your role?</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {roleOptions.map((role) => {
                      const RoleIcon = role.icon;
                      return (
                        <button
                          key={role.id}
                          onClick={() => setUserProfile({ ...userProfile, role: role.label })}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                            userProfile.role === role.label
                              ? 'border-violet-500 bg-violet-500/10'
                              : 'border-slate-600 hover:border-slate-500'
                          }`}
                        >
                          <RoleIcon className="w-8 h-8 text-violet-400 mx-auto mb-2" />
                          <p className="text-white font-medium">{role.label}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Experience level</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {experienceOptions.map((exp) => (
                      <button
                        key={exp.id}
                        onClick={() => setUserProfile({ ...userProfile, experience: exp.label })}
                        className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                          userProfile.experience === exp.label
                            ? 'border-violet-500 bg-violet-500/10'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <p className="text-white font-medium">{exp.label}</p>
                        <p className="text-slate-400 text-sm">{exp.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    What do you want to achieve? (Select all that apply)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {goalOptions.map((goal) => (
                      <button
                        key={goal}
                        onClick={() => {
                          const newInterests = userProfile.interests.includes(goal)
                            ? userProfile.interests.filter(i => i !== goal)
                            : [...userProfile.interests, goal];
                          setUserProfile({ ...userProfile, interests: newInterests });
                        }}
                        className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                          userProfile.interests.includes(goal)
                            ? 'border-violet-500 bg-violet-500/10'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            userProfile.interests.includes(goal)
                              ? 'border-violet-500 bg-violet-500'
                              : 'border-slate-500'
                          }`}>
                            {userProfile.interests.includes(goal) && (
                              <CheckCircle className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <p className="text-white">{goal}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tell us more about your specific goals (optional)
                  </label>
                  <textarea
                    value={userProfile.goals}
                    onChange={(e) => setUserProfile({ ...userProfile, goals: e.target.value })}
                    placeholder="Describe your specific objectives, timeline, or any particular areas you'd like to focus on..."
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-slate-300 mb-6">
                    Based on your profile, we'll generate a personalized guide to help you get the most out of 
                    Portfolio Command Center.
                  </p>
                  <button
                    onClick={handleGenerateGuide}
                    disabled={isGeneratingGuide}
                    className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                  >
                    <Sparkles className="w-5 h-5" />
                    {isGeneratingGuide ? 'Generating Your Guide...' : 'Generate My Personalized Guide'}
                  </button>
                </div>

                {customGuide && (
                  <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/30 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-violet-400" />
                      Your Personalized Guide
                    </h3>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-slate-300 whitespace-pre-line">{customGuide}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep === 4 && (
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Welcome aboard, {userProfile.name}!</h3>
                  <p className="text-slate-400 text-lg mb-6">
                    Your Portfolio Command Center is ready. Start exploring and building something amazing!
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Create your first project</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <User className="w-8 h-8 text-violet-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Build your portfolio</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <Sparkles className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Get AI insights</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                currentStep === 0
                  ? 'text-slate-500 cursor-not-allowed'
                  : 'text-slate-300 hover:text-white border border-slate-600 hover:border-slate-500'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && (!userProfile.name || !userProfile.email || !userProfile.role || !userProfile.experience)) ||
                  (currentStep === 2 && userProfile.interests.length === 0) ||
                  (currentStep === 3 && !customGuide)
                }
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25"
              >
                Get Started
                <Rocket className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
