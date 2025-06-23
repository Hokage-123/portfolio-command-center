import { Project, JournalEntry } from '../contexts/AppContext';

export const sampleProjects: Project[] = [
  {
    id: '1',
    title: 'Portfolio Command Center',
    description: 'A comprehensive project management and portfolio showcase platform with AI integration, built with modern React and TypeScript.',
    status: 'in-progress',
    progress: 75,
    startDate: '2024-06-01',
    endDate: '2024-06-30',
    priority: 'high',
    tags: ['React', 'TypeScript', 'Firebase', 'Tailwind CSS', 'AI'],
    milestones: [
      {
        id: '1-1',
        title: 'Project Setup and Architecture',
        description: 'Initialize React project with TypeScript, set up Firebase, and create basic structure',
        completed: true,
        dueDate: '2024-06-05',
        subtasks: [
          { id: '1-1-1', title: 'Create React project with Vite', completed: true },
          { id: '1-1-2', title: 'Configure TypeScript', completed: true },
          { id: '1-1-3', title: 'Set up Firebase configuration', completed: true }
        ]
      },
      {
        id: '1-2',
        title: 'Core Components Development',
        description: 'Build main navigation, dashboard, and project management components',
        completed: true,
        dueDate: '2024-06-15',
        subtasks: [
          { id: '1-2-1', title: 'Navigation component', completed: true },
          { id: '1-2-2', title: 'Dashboard with charts', completed: true },
          { id: '1-2-3', title: 'Project management interface', completed: true }
        ]
      },
      {
        id: '1-3',
        title: 'AI Integration',
        description: 'Integrate Gemini AI for insights and recommendations',
        completed: false,
        dueDate: '2024-06-22',
        subtasks: [
          { id: '1-3-1', title: 'AI service setup', completed: true },
          { id: '1-3-2', title: 'Status update generation', completed: false },
          { id: '1-3-3', title: 'Project idea generation', completed: false }
        ]
      },
      {
        id: '1-4',
        title: 'Testing and Deployment',
        description: 'Comprehensive testing and production deployment',
        completed: false,
        dueDate: '2024-06-30',
        subtasks: [
          { id: '1-4-1', title: 'Unit tests', completed: false },
          { id: '1-4-2', title: 'Integration tests', completed: false },
          { id: '1-4-3', title: 'Production deployment', completed: false }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'E-commerce Analytics Dashboard',
    description: 'Real-time analytics dashboard for e-commerce platforms with sales tracking, customer insights, and performance metrics.',
    status: 'completed',
    progress: 100,
    startDate: '2024-04-01',
    endDate: '2024-05-15',
    priority: 'medium',
    tags: ['Vue.js', 'Chart.js', 'Node.js', 'MongoDB', 'API'],
    milestones: [
      {
        id: '2-1',
        title: 'Data Architecture',
        description: 'Design and implement data collection and storage system',
        completed: true,
        dueDate: '2024-04-10',
        subtasks: [
          { id: '2-1-1', title: 'Database schema design', completed: true },
          { id: '2-1-2', title: 'API endpoints', completed: true }
        ]
      },
      {
        id: '2-2',
        title: 'Dashboard UI',
        description: 'Create responsive dashboard with interactive charts',
        completed: true,
        dueDate: '2024-04-25',
        subtasks: [
          { id: '2-2-1', title: 'Chart components', completed: true },
          { id: '2-2-2', title: 'Responsive layout', completed: true }
        ]
      },
      {
        id: '2-3',
        title: 'Real-time Features',
        description: 'Implement real-time data updates and notifications',
        completed: true,
        dueDate: '2024-05-15',
        subtasks: [
          { id: '2-3-1', title: 'WebSocket integration', completed: true },
          { id: '2-3-2', title: 'Push notifications', completed: true }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'Mobile Task Manager',
    description: 'Cross-platform mobile application for task management with offline capabilities and team collaboration features.',
    status: 'planning',
    progress: 15,
    startDate: '2024-06-20',
    endDate: '2024-08-30',
    priority: 'medium',
    tags: ['React Native', 'Redux', 'SQLite', 'Firebase', 'Mobile'],
    milestones: [
      {
        id: '3-1',
        title: 'Project Planning',
        description: 'Define requirements, create wireframes, and plan architecture',
        completed: true,
        dueDate: '2024-06-25',
        subtasks: [
          { id: '3-1-1', title: 'Requirements gathering', completed: true },
          { id: '3-1-2', title: 'Wireframe design', completed: false }
        ]
      },
      {
        id: '3-2',
        title: 'Core Development',
        description: 'Build main features and user interface',
        completed: false,
        dueDate: '2024-07-30',
        subtasks: [
          { id: '3-2-1', title: 'Task CRUD operations', completed: false },
          { id: '3-2-2', title: 'User authentication', completed: false }
        ]
      }
    ]
  }
];

export const sampleJournalEntries: JournalEntry[] = [
  {
    id: '1',
    date: '2024-06-24',
    title: 'Great Progress on Portfolio Command Center',
    content: `Today was incredibly productive! I made significant progress on the Portfolio Command Center rebuild. The new React architecture is coming together beautifully, and I'm really happy with how the component structure is shaping up.

Key accomplishments:
- Completed the navigation component with smooth animations
- Implemented the dashboard with Chart.js integration
- Set up the AI service for Gemini integration
- Created a comprehensive onboarding flow

The modular approach is paying off - each component is clean, reusable, and well-typed with TypeScript. The user experience feels much more polished compared to the original monolithic version.

Tomorrow I plan to focus on testing and deployment preparation. The end goal is getting closer!`,
    mood: 'great',
    tags: ['development', 'react', 'portfolio', 'ai', 'progress']
  },
  {
    id: '2',
    date: '2024-06-23',
    title: 'Architecture Planning Session',
    content: `Spent most of today planning the new architecture for the portfolio rebuild. After analyzing the comprehensive analysis report, it's clear that the monolithic approach was the main issue.

Planning decisions:
- React with TypeScript for better maintainability
- Modular component structure
- Context API for state management
- Environment variables for API keys (finally!)
- Chart.js for data visualization

The security improvements alone make this rebuild worthwhile. No more hardcoded API keys!`,
    mood: 'good',
    tags: ['planning', 'architecture', 'security', 'react']
  },
  {
    id: '3',
    date: '2024-06-22',
    title: 'Analysis Report Review',
    content: `Reviewed the comprehensive analysis report for the existing portfolio. The findings were eye-opening:

Critical issues identified:
- Hardcoded API keys (major security vulnerability)
- 1130-line monolithic HTML file
- Poor user navigation flow
- Inconsistent UI implementation

The report provides a clear roadmap for improvement. Time to rebuild this properly with modern best practices.`,
    mood: 'okay',
    tags: ['analysis', 'planning', 'security', 'improvement']
  },
  {
    id: '4',
    date: '2024-06-21',
    title: 'Learning TypeScript Patterns',
    content: `Dedicated time to learning advanced TypeScript patterns for better React development. Focused on:

- Generic types for reusable components
- Union types for better state management
- Interface composition for complex data structures
- Type guards for runtime safety

These patterns will be crucial for the portfolio rebuild. The initial learning curve is steep, but the benefits for maintainability are worth it.`,
    mood: 'good',
    tags: ['learning', 'typescript', 'development', 'patterns']
  },
  {
    id: '5',
    date: '2024-06-20',
    title: 'Firebase Security Configuration',
    content: `Worked on properly configuring Firebase security rules and environment variables. This is a critical part of the portfolio rebuild.

Security improvements:
- Environment variable configuration
- Proper Firebase rules
- API key management
- Access control implementation

Security should never be an afterthought. Getting this right from the start is essential for any production application.`,
    mood: 'good',
    tags: ['firebase', 'security', 'configuration', 'best-practices']
  }
];

export const initializeSampleData = () => {
  // This would typically check if data exists and only add sample data if needed
  return {
    projects: sampleProjects,
    journalEntries: sampleJournalEntries
  };
};
