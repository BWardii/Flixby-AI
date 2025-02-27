import React, { useState, useEffect } from 'react';
import { ArrowRight, Zap, Shield, Cpu, Bot, X, Phone, Clock, Users, CheckCircle, MessageSquare, Calendar, Building2, Utensils, Briefcase, Plane, MicOff, Mic, Mail, Building, Info } from 'lucide-react';
import AIAssistant from '../components/AIAssistant';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface DemoFormData {
  name: string;
  email: string;
  company: string;
  message: string;
  newsletter: boolean;
  demoDate: string;
}

function Home() {
  const navigate = useNavigate();
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [formData, setFormData] = useState<DemoFormData>({
    name: '',
    email: '',
    company: '',
    message: '',
    newsletter: false,
    demoDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('https://hook.eu2.make.com/1lvukqh4rzbtl04x155vxtr36cr27ft1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          message: formData.message,
          email: formData.email,
          newsletter: formData.newsletter,
          demoDate: formData.demoDate,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send data to webhook');
      }

      setSuccess('Thank you for your interest! We will contact you shortly.');
      setFormData({
        name: '',
        email: '',
        company: '',
        message: '',
        newsletter: false,
        demoDate: '',
      });

      setTimeout(() => {
        setShowDemoModal(false);
        setSuccess(null);
      }, 2000);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to submit form. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const features = [
    {
      title: "Business Oriented",
      description: "Receives information from your systems and updates them with conversation outcomes.",
      image: "/image1.jpg",
      benefits: [
        "24/7 availability, no volume limit",
        "Quick setup & integration",
        "Low maintenance, continuous learning",
        "Consistent response quality",
        "Contact details validation"
      ]
    },
    {
      title: "Human Conversation",
      description: "Conduct human conversations to drive better customer experience, addressing the unique challenges of phone communication.",
      image: "/image2.jpg",
      benefits: [
        "Natural, engaging conversations",
        "State-of-the-art voice models",
        "Low latency",
        "Listens when interrupted and responds accordingly",
        "Ignores background conversations and noises"
      ]
    }
  ];

  const useCases = [
    {
      icon: <Building2 className="h-8 w-8 text-purple-400" />,
      title: "Enterprise Solutions",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80",
      conversation: {
        user: "How can Flixby help our enterprise?",
        ai: "Flixby's AI assistant can automate customer support, streamline operations, and provide 24/7 service across all departments. Would you like to learn more about our enterprise solutions?"
      },
      benefit: "Transform enterprise communication with AI"
    },
    {
      icon: <Users className="h-8 w-8 text-blue-400" />,
      title: "Customer Service",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      conversation: {
        user: "Can you help with my account settings?",
        ai: "Of course! I can guide you through your account settings. Would you like to update your preferences or security settings first?"
      },
      benefit: "Provide instant, personalized customer support"
    },
    {
      icon: <Zap className="h-8 w-8 text-green-400" />,
      title: "Smart Automation",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80",
      conversation: {
        user: "How does Flixby automate workflows?",
        ai: "Flixby integrates with your existing systems to automate repetitive tasks, schedule meetings, and manage projects. Would you like to see a demo of our workflow automation?"
      },
      benefit: "Streamline operations with intelligent automation"
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[600px] h-[600px] -left-48 -top-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute w-[600px] h-[600px] -right-48 -bottom-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute w-[900px] h-[900px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          backgroundPosition: 'center center',
        }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left space-y-8 animate-fade-in">
              <div className="inline-block">
                <div className="flex items-center justify-center lg:justify-start space-x-2 bg-gray-800/50 backdrop-blur-lg rounded-full px-4 py-2 mb-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
                  <Phone className="h-5 w-5 text-purple-400" />
                  <span className="text-sm text-gray-300">24/7 AI Assistant</span>
                </div>
              </div>

              <div className="flex flex-col items-center lg:items-start space-y-2">
                <img 
                  src="/flixby-logo.png" 
                  alt="Flixby Logo" 
                  className="w-[300px] max-w-full h-auto"
                />
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Your 24/7 AI Answering Service
                </h2>
              </div>

              <div className="space-y-4">
                <p className="text-gray-400 text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Never miss a business call again. Flixby's AI Answering Service handles customer calls 24/7 with human-like conversations
                  resolving inquiries, booking appointments.
                </p>
                
                <p className="text-lg text-purple-300 font-medium max-w-2xl mx-auto lg:mx-0 border-l-4 border-purple-500 pl-4 transform hover:translate-x-1 transition-transform">
                  Set up in minutes, customize it to your business, and let Flixby do the talking.
                </p>
              </div>

              <div className="flex items-center justify-center lg:justify-start space-x-4">
                <button 
                  onClick={() => navigate('/sign-up')}
                  className="group bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-3 rounded-full font-medium hover:from-green-600 hover:to-teal-600 transition-all duration-300 flex items-center transform hover:scale-105"
                >
                  Create an Agent in 30 seconds
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                  onClick={() => setShowDemoModal(true)}
                  className="group bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-full font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 flex items-center transform hover:scale-105"
                >
                  Book a Demo
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Column - Phone Mockup */}
            <div className="relative flex justify-center items-center">
              {/* Phone Frame */}
              <div 
                className="relative w-[320px] h-[650px] bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-500 cursor-pointer"
                onClick={() => setShowAIAssistant(true)}
              >
                {/* Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl z-20"></div>
                
                {/* Status Bar */}
                <div className="absolute top-8 left-0 right-0 px-6 flex justify-between items-center text-xs text-gray-400">
                  <span>9:41</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-green-400 animate-pulse"></div>
                    <span>Ready to Talk</span>
                  </div>
                </div>

                {/* Call Interface */}
                <div className="relative h-full w-full bg-gradient-to-b from-gray-900 to-gray-800 p-6">
                  {/* Contact Info */}
                  <div className="mt-12 text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
                      <img
                        src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                        alt="Sarah - AI Assistant"
                        className="absolute inset-0 w-full h-full object-cover rounded-full border-4 border-gray-800"
                      />
                      <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-400 rounded-full border-4 border-gray-800"></div>
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-1">Sarah</h3>
                    <p className="text-gray-400 text-sm">AI Assistant</p>
                  </div>

                  {/* Call to Action */}
                  <div className="mt-8 text-center">
                    <p className="text-gray-300 mb-6">Click to start a conversation</p>
                    <div className="w-16 h-16 mx-auto rounded-full bg-green-500 flex items-center justify-center animate-pulse">
                      <Phone className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>

                {/* Screen Reflections */}
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50 pointer-events-none"></div>
              </div>

              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Request Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl bg-gray-900 rounded-2xl shadow-2xl">
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute -top-4 -right-4 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left Side - Information */}
              <div className="p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-l-2xl">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
                  The phone doesn't sleep,<br />so why should your business?
                </h2>
                
                <div className="space-y-6">
                  <p className="text-xl text-gray-300">
                    Your phone calls, answered.
                  </p>
                  
                  <p className="text-gray-400 leading-relaxed">
                    Our digital phone concierge allows you to answer questions, take reservations, 
                    book appointments and satisfy callers.
                  </p>

                  <div className="space-y-4 mt-8">
                    <div className="flex items-center space-x-3 text-gray-300">
                      <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Phone className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <span className="block text-2xl font-bold text-white">100%</span>
                        <span className="text-sm text-gray-400">Calls Answered</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 text-gray-300">
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Bot className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <span className="block text-2xl font-bold text-white">80%</span>
                        <span className="text-sm text-gray-400">Handled Without Team Involvement</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 text-gray-300">
                      <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <span className="block text-2xl font-bold text-white">24/7</span>
                        <span className="text-sm text-gray-400">Availability</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <div className="flex items-start space-x-3">
                      <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                      <p className="text-sm text-gray-400">
                        Schedule a demo to see how Flixby can transform your business 
                        communications and provide round-the-clock customer service.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                    Request a Demo
                  </h3>
                  <p className="text-gray-400">
                    Experience the power of Flixby firsthand with a personalized demo
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Company
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        required
                        className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                        placeholder="Enter your company name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Preferred Demo Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        value={formData.demoDate}
                        onChange={(e) => setFormData({ ...formData, demoDate: e.target.value })}
                        min={minDate}
                        max={maxDateStr}
                        required
                        className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-400">
                      Select a date between tomorrow and 3 months from now
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="block w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                      placeholder="Tell us about your needs"
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="newsletter"
                      checked={formData.newsletter}
                      onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-700 bg-gray-800/50 text-purple-500 focus:ring-purple-500/50"
                    />
                    <label htmlFor="newsletter" className="ml-2 text-sm text-gray-300">
                      Keep me updated with news and offers
                    </label>
                  </div>

                  {error && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-3 text-red-400">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-500/20 border border-green-500/50 rounded-lg px-4 py-3 text-green-400">
                      {success}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="h-5 w-5" />
                        <span>Schedule Demo</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant Modal */}
      {showAIAssistant && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-gray-900 rounded-2xl shadow-2xl">
            <button
              onClick={() => setShowAIAssistant(false)}
              className="absolute -top-4 -right-4 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="p-6">
              <LazyAIAssistant />
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <section className="py-24 bg-gray-800/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Transforming Industries
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Experience the next generation of AI-powered phone communication
            </p>
          </div>

          <div className="space-y-24">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}
              >
                {/* Image Side */}
                <div className="w-full md:w-1/2">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                    <div className="relative">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="rounded-xl w-full h-[400px] object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent rounded-xl"></div>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="w-full md:w-1/2 space-y-6">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="space-y-3">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div 
                        key={benefitIndex}
                        className="flex items-center space-x-3 text-gray-300"
                      >
                        <div className="h-2 w-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400"></div>
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <button className="mt-8 bg-gray-700/50 hover:bg-gray-700 text-gray-300 px-6 py-3 rounded-lg transition-all duration-300 flex items-center space-x-2 group">
                    <span>Learn more</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 bg-gray-800/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Real-World Applications
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              See how businesses are revolutionizing their operations with Flixby
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="relative bg-gray-800/80 backdrop-blur-xl rounded-xl overflow-hidden transform hover:scale-105 transition-all duration-300 border border-gray-700/50 hover:border-purple-500/50"
              >
                {/* Image Section */}
                <div className="relative h-64">
                  <img
                    src={useCase.image}
                    alt={useCase.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                  
                  {/* Conversation Bubbles */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    {/* User Message */}
                    <div className="flex justify-end mb-2">
                      <div className="max-w-[200px] bg-purple-500/20 text-purple-100 px-4 py-2 rounded-2xl rounded-tr-sm text-sm backdrop-blur-sm">
                        {useCase.conversation.user}
                      </div>
                    </div>
                    
                    {/* AI Response */}
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="max-w-[200px] bg-gray-700/50 text-gray-100 px-4 py-2 rounded-2xl rounded-tl-sm text-sm backdrop-blur-sm">
                        {useCase.conversation.ai}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    {useCase.icon}
                    <h3 className="text-xl font-semibold">{useCase.title}</h3>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <p>{useCase.benefit}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant Demo Section */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Experience Flixby
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              Try our AI assistant and see the power of Flixby firsthand
            </p>
          </div>
          
          <div className="transform hover:scale-[1.02] transition-all duration-500">
            <LazyAIAssistant />
          </div>
        </div>
      </section>
    </div>
  );
}

// Lazy-loaded AIAssistant component that only initializes when rendered
const LazyAIAssistant = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return (
      <div className="relative bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-2">
            AI Assistant
          </h2>
          <p className="text-gray-300">Ready to start</p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="relative w-48 h-48 mx-auto">
            <div className="absolute inset-0 rounded-full bg-gray-800/50 flex items-center justify-center transition-all duration-300">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
                alt="AI Assistant"
                className="w-40 h-40 rounded-full object-cover"
              />
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              disabled={true}
              className="p-4 rounded-full bg-gray-800/50 text-gray-500 cursor-not-allowed"
            >
              <Mic size={24} />
            </button>

            <button
              className="p-4 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30"
            >
              <Phone size={24} />
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>Click the phone button to start a conversation with the AI Assistant</p>
        </div>
      </div>
    );
  }
  
  return <AIAssistant />;
};

export default Home;