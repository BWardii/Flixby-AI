import React from 'react';
import {
  Mic,
  Brain,
  Zap,
  Shield,
  Globe,
  BarChart,
  Cpu,
  Cloud,
  MessageSquare,
} from 'lucide-react';

function Features() {
  const features = [
    {
      icon: <Mic className="h-8 w-8 text-blue-400" />,
      title: 'Natural Voice Interaction',
      description:
        'Advanced speech recognition for natural, human-like conversations with your customers.',
    },
    {
      icon: <Brain className="h-8 w-8 text-green-400" />,
      title: 'AI-Powered Understanding',
      description:
        'Contextual understanding and intelligent responses powered by state-of-the-art language models.',
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-400" />,
      title: 'Real-Time Processing',
      description:
        'Lightning-fast response times with minimal latency for smooth conversations.',
    },
    {
      icon: <Shield className="h-8 w-8 text-red-400" />,
      title: 'Enterprise Security',
      description:
        'Bank-grade encryption and security measures to protect sensitive conversations.',
    },
    {
      icon: <Globe className="h-8 w-8 text-purple-400" />,
      title: 'Multi-Language Support',
      description:
        'Support for multiple languages and dialects to serve a global customer base.',
    },
    {
      icon: <BarChart className="h-8 w-8 text-pink-400" />,
      title: 'Analytics Dashboard',
      description:
        'Comprehensive analytics and insights to monitor and improve performance.',
    },
    {
      icon: <Cpu className="h-8 w-8 text-indigo-400" />,
      title: 'Custom AI Training',
      description:
        'Train the AI with your specific data and use cases for better results.',
    },
    {
      icon: <Cloud className="h-8 w-8 text-cyan-400" />,
      title: 'Cloud Integration',
      description:
        'Seamless integration with your existing cloud infrastructure and services.',
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-orange-400" />,
      title: 'Omnichannel Support',
      description:
        'Deploy your AI assistant across multiple channels and platforms.',
    },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-green-500/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                Powerful Features
              </span>
              <br />
              for Modern Businesses
            </h1>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Discover the comprehensive suite of features that make our AI voice assistant
              the perfect solution for your business needs.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 transform hover:scale-105 transition-all duration-300"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Features;