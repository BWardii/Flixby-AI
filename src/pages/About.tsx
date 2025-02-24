import React from 'react';
import { Bot, Users, Globe, Shield, Award, Code, Building2, Zap, Heart } from 'lucide-react';

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

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-green-500/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                Our Mission
              </span>
            </h1>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
              We're on a mission to revolutionize how businesses communicate with their customers
              through advanced AI technology that's both powerful and accessible.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-700/50 mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                Meet Our Team
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              The passionate individuals behind VoiceAI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent rounded-lg"></div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                    <p className="text-gray-300">{member.role}</p>
                  </div>
                </div>
                <p className="text-gray-400">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                Our Values
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900/50 rounded-xl p-8">
              <Shield className="h-10 w-10 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Trust & Security</h3>
              <p className="text-gray-400">
                We prioritize the security and privacy of our users' data above everything else.
              </p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-8">
              <Code className="h-10 w-10 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Innovation</h3>
              <p className="text-gray-400">
                We're constantly pushing the boundaries of what's possible with AI technology.
              </p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-8">
              <Heart className="h-10 w-10 text-red-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Customer Success</h3>
              <p className="text-gray-400">
                Your success is our success. We're committed to helping your business grow.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;