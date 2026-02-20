import { Link } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  const sections = [
    {
      title: 'Chat Components',
      description: 'Complete chat UI components including Chat, ChatPanel, ChatInput, MessageBubble, and more.',
      path: '/chat',
      features: [
        'Chat orchestrator with scroll management',
        'Collapsible sidebar panel',
        'Welcome screen with quick actions',
        'Auto-resizing input component',
        'Message bubbles with headers',
      ],
    },
    {
      title: 'Agent Components',
      description: 'Components for displaying and managing AI agents.',
      path: '/agents',
      features: [
        'AgentCard for agent display',
        'AgentAvatar for agent identification',
        'Status indicators',
      ],
    },
    {
      title: 'Evaluation Components',
      description: 'Components for displaying evaluation results and scores.',
      path: '/evaluation',
      features: [
        'EvaluationBadge for score display',
        'ScoreDisplay for multiple metrics',
        'Visual score indicators',
      ],
    },
  ];

  return (
    <div className="home-page">
      <div className="home-hero">
        <h1 className="home-title">Cortex UI Showcase</h1>
        <p className="home-subtitle">
          A comprehensive showcase of AI/agentic UI components from @cortex/core
        </p>
      </div>

      <div className="home-sections">
        {sections.map((section) => (
          <div key={section.path} className="home-section-card">
            <h2 className="home-section-title">{section.title}</h2>
            <p className="home-section-description">{section.description}</p>
            <ul className="home-section-features">
              {section.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
            <Link to={section.path} className="home-section-link">
              View Components →
            </Link>
          </div>
        ))}
      </div>

      <div className="home-info">
        <h2>About Cortex UI</h2>
        <p>
          Cortex UI is a monorepo containing design system and core UI components
          for building AI/agentic applications. This showcase demonstrates all
          available components with interactive examples.
        </p>
        <p>
          All components are MIT licensed and available in the{' '}
          <code>@cortex/core</code> and <code>@cortex/design-system</code> packages.
        </p>
      </div>
    </div>
  );
}
