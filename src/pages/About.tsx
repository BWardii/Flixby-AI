import React from 'react';
import { Bot, Users, Globe, Shield, Award, Code, Building2, Zap, Heart, Star, CheckCircle, ArrowRight } from 'lucide-react';

function About() {
  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      description: "Former AI researcher at Stanford, passionate about making AI accessible to businesses."
    },
    {
      name: "Marcus Thompson",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      description: "15 years of experience in voice recognition technology and machine learning."
    },
    {
      name: "Lisa Wong",
      role: "Head of Product",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      description: "Product leader focused on creating intuitive AI experiences."
    }
  ];

  const stats = [
    { icon: <Users className="h-6 w-6 text-blue-400" />, value: "50,000+", label: "Active Users" },
    { icon: <Globe className="h-6 w-6 text-green-400" />, value: "100+", label: "Countries" },
    { icon: <Building2 className="h-6 w-6 text-purple-400" />, value: "1,000+", label: "Business Clients" },
    { icon: <Zap className="h-6 w-6 text-yellow-400" />, value: "99.9%", label: "Uptime" }
  ];

  const values = [
    {
      icon: <Shield className="h-10 w-10 text-blue-400" />,
      title: "Trust & Security",
      description: "We prioritize the security and privacy of our users' data above everything else."
    },
    {
      icon: <Code className="h-10 w-10 text-green-400" />,
      title: "Innovation",
      description: "We're constantly pushing the boundaries of what's possible with AI technology."
    },
    {
      icon: <Heart className="h-10 w-10 text-red-400" />,
      title: "Customer Success",
      description: "Your success is our success. We're committed to helping your business grow."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background elements */}
      <div className="fixed inset-0 bg-gray-900 z-0">
        <div className="absolute top-0 left-0 right-0 h-[40vh] bg-gradient-to-br from-purple-900/30 via-indigo-800/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-[40vw] h-[40vh] bg-gradient-to-tl from-teal-900/30 via-blue-800/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0',
        }}></div>
      </div>

      {/* Main content */}
      <div className="flex-1 relative z-10 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-16">
            <div className="inline-block">
              <div className="flex items-center justify-center space-x-2 bg-gray-800/50 backdrop-blur-lg rounded-full px-4 py-2 mb-4 sm:mb-6 border border-gray-700/50">
                <Bot className="h-5 w-5 text-purple-400" />
                <span className="text-sm text-gray-300">About Flixby</span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                Our Mission
              </span>
            </h1>
            <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
              We're on a mission to revolutionize how businesses communicate with their customers
              through advanced AI technology that's both powerful and accessible.
            </p>
          </div>

          {/* Stats Section */}
          <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl p-4 sm:p-8 mb-8 sm:mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center transform hover:scale-105 transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-700/50 mb-2 sm:mb-4 border border-gray-600/50">
                    {stat.icon}
                  </div>
                  <div className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1 sm:mb-2">{stat.value}</div>
                  <div className="text-sm sm:text-base text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-8 sm:mb-16">
            <div className="text-center mb-6 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                  Meet Our Team
                </span>
              </h2>
              <p className="text-gray-400 text-base sm:text-lg">
                The passionate individuals behind Flixby
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-gray-800/60 backdrop-blur-xl rounded-xl border border-gray-700/50 overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-xl">
                  <div className="relative h-48 sm:h-64">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        <span className="text-xs sm:text-sm text-gray-300">{member.role}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mt-1">{member.name}</h3>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <p className="text-sm sm:text-base text-gray-400">{member.description}</p>
                    <button className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-purple-400 hover:text-purple-300 transition-colors">
                      <span>View profile</span>
                      <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Values Section */}
          <div>
            <div className="text-center mb-6 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                  Our Values
                </span>
              </h2>
              <p className="text-gray-400 text-base sm:text-lg">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-gray-800/60 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6 sm:p-8 transform hover:scale-105 transition-all duration-300 shadow-xl">
                  <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                    <div className="p-2 sm:p-3 bg-gray-700/50 rounded-xl border border-gray-600/50">
                      {value.icon}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {value.title}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-400">
                    {value.description}
                  </p>
                  <div className="mt-4 sm:mt-6 flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                    <span className="text-sm sm:text-base text-gray-300">Core to our identity</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 sm:mt-20 text-center">
            <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-2xl border border-gray-700/50 p-6 sm:p-12 backdrop-blur-sm">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                  Join Our Journey
                </span>
              </h2>
              <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mb-6 sm:mb-8">
                Be part of the AI revolution that's transforming business communication
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="w-full sm:w-auto group bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 sm:px-8 py-3 rounded-full font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center sm:justify-start transform hover:scale-105">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="w-full sm:w-auto text-gray-300 hover:text-white px-6 sm:px-8 py-3 rounded-full font-medium border border-gray-700 hover:border-gray-500 transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;