import React, { useState } from 'react';
import { 
  ExternalLink, 
  Github, 
  Code, 
  Briefcase, 
  Award, 
  Download,
  Mail,
  MapPin,
  Calendar,
  Star
} from 'lucide-react';

interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  category: 'web' | 'mobile' | 'desktop' | 'ai' | 'design';
  featured: boolean;
  completedDate: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
  achievements: string[];
}

interface Skill {
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'tools' | 'design';
}

const Portfolio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'experience' | 'skills'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Sample portfolio data - in a real app, this would come from a database or CMS
  const portfolioProjects: PortfolioProject[] = [
    {
      id: '1',
      title: 'Portfolio Command Center',
      description: 'A comprehensive project management and portfolio showcase platform with AI integration.',
      image: '/images/portfolio-command-center.png',
      technologies: ['React', 'TypeScript', 'Firebase', 'Tailwind CSS', 'Gemini AI'],
      liveUrl: 'https://portfolio-command-center.vercel.app',
      githubUrl: 'https://github.com/user/portfolio-command-center',
      category: 'web',
      featured: true,
      completedDate: '2024-06-24'
    },
    {
      id: '2',
      title: 'E-commerce Dashboard',
      description: 'Analytics dashboard for e-commerce platforms with real-time data visualization.',
      image: '/images/ecommerce-dashboard.png',
      technologies: ['Vue.js', 'Chart.js', 'Node.js', 'MongoDB'],
      liveUrl: 'https://ecommerce-dashboard.demo.com',
      githubUrl: 'https://github.com/user/ecommerce-dashboard',
      category: 'web',
      featured: true,
      completedDate: '2024-05-15'
    },
    {
      id: '3',
      title: 'Mobile Task Manager',
      description: 'Cross-platform mobile app for task management with offline synchronization.',
      image: '/images/mobile-task-manager.png',
      technologies: ['React Native', 'Redux', 'SQLite', 'Firebase'],
      githubUrl: 'https://github.com/user/mobile-task-manager',
      category: 'mobile',
      featured: false,
      completedDate: '2024-04-10'
    }
  ];

  const experience: Experience[] = [
    {
      id: '1',
      company: 'Tech Innovation Inc.',
      position: 'Senior Frontend Developer',
      duration: '2022 - Present',
      description: 'Leading frontend development for enterprise applications and client projects.',
      achievements: [
        'Reduced application load time by 40% through optimization',
        'Led a team of 5 developers on major client projects',
        'Implemented modern development practices and CI/CD pipelines'
      ]
    },
    {
      id: '2',
      company: 'StartupHub',
      position: 'Full Stack Developer',
      duration: '2020 - 2022',
      description: 'Developed multiple web applications from concept to deployment.',
      achievements: [
        'Built 3 successful web applications serving 10k+ users',
        'Integrated payment systems and third-party APIs',
        'Collaborated with design and product teams'
      ]
    }
  ];

  const skills: Skill[] = [
    { name: 'React', level: 95, category: 'frontend' },
    { name: 'TypeScript', level: 90, category: 'frontend' },
    { name: 'Vue.js', level: 85, category: 'frontend' },
    { name: 'Node.js', level: 80, category: 'backend' },
    { name: 'Python', level: 75, category: 'backend' },
    { name: 'PostgreSQL', level: 70, category: 'backend' },
    { name: 'Docker', level: 85, category: 'tools' },
    { name: 'AWS', level: 80, category: 'tools' },
    { name: 'Figma', level: 70, category: 'design' }
  ];

  const categories = ['all', 'web', 'mobile', 'desktop', 'ai', 'design'];

  const filteredProjects = selectedCategory === 'all' 
    ? portfolioProjects 
    : portfolioProjects.filter(project => project.category === selectedCategory);

  const featuredProjects = portfolioProjects.filter(project => project.featured);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'experience', label: 'Experience', icon: Award },
    { id: 'skills', label: 'Skills', icon: Star }
  ] as const;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 p-1">
            <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
              <Briefcase className="w-12 h-12 text-violet-400" />
            </div>
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">John Doe</h1>
          <p className="text-xl text-violet-400 mb-4">Full Stack Developer & UI/UX Designer</p>
          <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Passionate developer with 5+ years of experience creating modern web applications 
            and user experiences. Specialized in React, TypeScript, and cloud technologies.
          </p>
        </div>
        
        {/* Contact Info */}
        <div className="flex flex-wrap justify-center gap-6 text-slate-400">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>San Francisco, CA</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>john.doe@example.com</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Available for hire</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button className="bg-gradient-to-r from-blue-500 to-violet-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/25 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Resume
          </button>
          <button className="border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Contact Me
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-1">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Featured Projects */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Featured Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredProjects.map((project) => (
                  <div key={project.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden group hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300">
                    <div className="aspect-video bg-slate-700 relative overflow-hidden">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          // Fallback to icon if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-violet-500/20 flex items-center justify-center"><svg class="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg></div>';
                          }
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                      <p className="text-slate-400 mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span key={tech} className="bg-violet-500/20 text-violet-300 px-2 py-1 rounded text-sm">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="text-slate-400 text-sm">+{project.technologies.length - 3} more</span>
                        )}
                      </div>
                      <div className="flex gap-3">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Live Demo
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors"
                          >
                            <Github className="w-4 h-4" />
                            Code
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">{portfolioProjects.length}</div>
                <div className="text-slate-400">Projects Completed</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">5+</div>
                <div className="text-slate-400">Years Experience</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">50+</div>
                <div className="text-slate-400">Happy Clients</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-all duration-200 capitalize
                    ${selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white'
                      : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden group hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300">
                  <div className="aspect-video bg-slate-700 relative overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        // Fallback to icon if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-violet-500/20 flex items-center justify-center"><svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg></div>';
                        }
                      }}
                    />
                    {project.featured && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-violet-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
                    <p className="text-slate-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.technologies.slice(0, 2).map((tech) => (
                        <span key={tech} className="bg-violet-500/20 text-violet-300 px-2 py-1 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-slate-500">
                        {new Date(project.completedDate).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-violet-400 hover:text-violet-300 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-slate-300 transition-colors"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{exp.position}</h3>
                    <p className="text-violet-400 font-medium">{exp.company}</p>
                  </div>
                  <div className="text-slate-400 text-sm">{exp.duration}</div>
                </div>
                <p className="text-slate-300 mb-4">{exp.description}</p>
                <div>
                  <h4 className="text-white font-medium mb-2">Key Achievements:</h4>
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-400">
                        <div className="w-2 h-2 bg-violet-400 rounded-full mt-2 flex-shrink-0"></div>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-8">
            {['frontend', 'backend', 'tools', 'design'].map((category) => (
              <div key={category}>
                <h3 className="text-xl font-semibold text-white mb-4 capitalize">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skills.filter(skill => skill.category === category).map((skill) => (
                    <div key={skill.name} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium">{skill.name}</span>
                        <span className="text-violet-400 text-sm">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-violet-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
