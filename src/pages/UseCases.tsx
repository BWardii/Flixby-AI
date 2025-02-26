import React, { useState } from 'react';
import { Phone, Bot, MessageSquare, Building2, Briefcase, ShoppingBag, Calendar, Utensils, Hotel, Plane, Car, Headphones, ArrowRight, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

function UseCases() {
  const [activeIndustry, setActiveIndustry] = useState<string>("Restaurants");
  const [expandedScenario, setExpandedScenario] = useState<number | null>(null);

  const industries = [
    {
      id: "Restaurants",
      icon: <Utensils className="h-6 w-6 text-orange-400" />,
      title: "Restaurants",
      description: "Handle reservations, answer menu questions, and provide information about your restaurant 24/7.",
      scenarios: [
        {
          question: "What are your hours today?",
          response: "We're open from 11 AM to 10 PM today. Would you like to make a reservation?",
          benefit: "Handle booking inquiries 24/7",
          details: "Never miss a potential reservation, even during peak hours or when your staff is busy. Our AI can handle multiple inquiries simultaneously."
        },
        {
          question: "Do you have any vegan options?",
          response: "Yes, we have several vegan dishes including our popular mushroom risotto and quinoa bowl. Would you like to hear our full vegan menu?",
          benefit: "Answer menu questions instantly",
          details: "Provide detailed information about your menu, dietary options, ingredients, and specials without keeping customers waiting."
        },
        {
          question: "Can I make a reservation for 6 people this Saturday?",
          response: "Let me check availability for Saturday. We have openings at 6:30 PM and 8:15 PM for a party of 6. Would either of those times work for you?",
          benefit: "Streamline the reservation process",
          details: "Integrate with your reservation system to check real-time availability and book tables without human intervention."
        }
      ]
    },
    {
      id: "RealEstate",
      icon: <Building2 className="h-6 w-6 text-blue-400" />,
      title: "Real Estate",
      description: "Qualify leads, answer property questions, and schedule viewings automatically.",
      scenarios: [
        {
          question: "Is the 2-bedroom apartment still available?",
          response: "Yes, the 2-bedroom apartment at 123 Main St is available. It's $2,200/month with utilities included. Would you like to schedule a viewing?",
          benefit: "Never miss a potential tenant",
          details: "Respond to inquiries 24/7, even during weekends and holidays when potential clients are most actively searching."
        },
        {
          question: "What's included in the rent?",
          response: "The rent includes water, heating, and parking. You'd be responsible for electricity and internet. Would you like to know more about the amenities?",
          benefit: "Provide detailed property information",
          details: "Answer specific questions about properties, amenities, lease terms, and neighborhood information without delay."
        },
        {
          question: "Do you allow pets in your properties?",
          response: "Yes, we do allow pets in this property with a $500 pet deposit and $50 monthly pet rent. We accept cats and dogs under 50 pounds. Would you like to know more about our pet policy?",
          benefit: "Qualify leads efficiently",
          details: "Screen potential tenants by answering policy questions and collecting preliminary information before scheduling viewings."
        }
      ]
    },
    {
      id: "Hotels",
      icon: <Hotel className="h-6 w-6 text-purple-400" />,
      title: "Hotels",
      description: "Manage bookings, answer guest questions, and provide concierge services automatically.",
      scenarios: [
        {
          question: "Do you have any rooms available for next weekend?",
          response: "Yes, we have several rooms available for next weekend. Our deluxe king room is $199/night. Would you like me to check specific dates for you?",
          benefit: "Streamline booking process",
          details: "Check availability, quote rates, and process reservations automatically, reducing the workload on your front desk staff."
        },
        {
          question: "What time is check-in?",
          response: "Check-in time is 3 PM, and check-out is at 11 AM. We can store your luggage if you arrive early. Would you like me to note an early arrival?",
          benefit: "Handle common inquiries efficiently",
          details: "Answer frequently asked questions about policies, amenities, and services, freeing up your staff to focus on in-person guest experiences."
        },
        {
          question: "Can you recommend restaurants near the hotel?",
          response: "Absolutely! Within walking distance, we have 'La Trattoria' for Italian cuisine, 'Sakura' for Japanese, and 'The Grill' for steaks. Would you like me to make a reservation at any of these for you?",
          benefit: "Provide concierge-level service",
          details: "Offer local recommendations, directions, and even make reservations for guests, enhancing their stay experience."
        }
      ]
    }
  ];

  const toggleScenario = (index: number) => {
    if (expandedScenario === index) {
      setExpandedScenario(null);
    } else {
      setExpandedScenario(index);
    }
  };

  const activeIndustryData = industries.find(ind => ind.id === activeIndustry) || industries[0];

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
      <div className="flex-1 relative z-10 pt-16 sm:pt-20 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-16">
            <div className="inline-block">
              <div className="flex items-center justify-center space-x-2 bg-gray-800/50 backdrop-blur-lg rounded-full px-4 py-2 mb-4 sm:mb-6 border border-gray-700/50">
                <Phone className="h-5 w-5 text-purple-400" />
                <span className="text-sm text-gray-300">Real-World Applications</span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                Transform Your Business
              </span>
            </h1>
            <p className="text-gray-400 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed">
              Discover how businesses across different industries are using Flixby to revolutionize
              their customer interactions and streamline operations.
            </p>
          </div>

          {/* Industry Selector */}
          <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl p-4 sm:p-6 mb-6 sm:mb-12 overflow-x-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 min-w-max sm:min-w-0">
              {industries.map((industry) => (
                <button
                  key={industry.id}
                  onClick={() => setActiveIndustry(industry.id)}
                  className={`flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl transition-all duration-300 ${
                    activeIndustry === industry.id
                      ? 'bg-gradient-to-r from-purple-900/60 to-blue-900/60 border border-purple-500/30'
                      : 'bg-gray-800/30 hover:bg-gray-800/60 border border-gray-700/30'
                  }`}
                >
                  <div className={`p-2 sm:p-3 rounded-lg ${
                    activeIndustry === industry.id
                      ? 'bg-purple-500/20'
                      : 'bg-gray-700/50'
                  }`}>
                    {industry.icon}
                  </div>
                  <div className="text-left">
                    <h3 className={`text-sm sm:font-semibold ${
                      activeIndustry === industry.id
                        ? 'text-white'
                        : 'text-gray-300'
                    }`}>
                      {industry.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5 sm:mt-1 line-clamp-1 max-w-[180px] sm:max-w-none">
                      {industry.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Industry Details */}
          <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl p-4 sm:p-8 mb-8 sm:mb-16">
            <div className="flex items-center space-x-3 sm:space-x-4 mb-6 sm:mb-8">
              <div className="p-3 sm:p-4 bg-gray-700/50 rounded-xl border border-gray-600/50">
                {activeIndustryData.icon}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {activeIndustryData.title}
                </h2>
                <p className="text-sm sm:text-base text-gray-400 mt-0.5 sm:mt-1">
                  {activeIndustryData.description}
                </p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {activeIndustryData.scenarios.map((scenario, index) => (
                <div 
                  key={index} 
                  className="bg-gray-900/50 rounded-xl border border-gray-800/50 overflow-hidden"
                >
                  <div className="p-4 sm:p-6">
                    {/* Conversation */}
                    <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                      {/* User Message */}
                      <div className="flex justify-end">
                        <div className="relative max-w-[240px] sm:max-w-sm">
                          <div className="absolute right-0 -top-5 sm:-top-6 text-xs text-gray-400 flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            <span>Customer</span>
                          </div>
                          <div className="bg-purple-500/20 text-purple-100 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl rounded-tr-sm text-sm">
                            {scenario.question}
                          </div>
                        </div>
                      </div>

                      {/* AI Response */}
                      <div className="flex items-start space-x-2 sm:space-x-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 mb-0.5 sm:mb-1">AI Assistant</div>
                          <div className="bg-gray-800/50 text-gray-100 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl rounded-tl-sm text-sm">
                            {scenario.response}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Benefit */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <div className="flex items-center space-x-2 bg-green-500/20 text-green-400 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm w-fit">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{scenario.benefit}</span>
                      </div>
                      <button 
                        onClick={() => toggleScenario(index)}
                        className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors text-xs sm:text-sm w-fit"
                      >
                        <span>Details</span>
                        {expandedScenario === index ? (
                          <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
                        ) : (
                          <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedScenario === index && (
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-1 sm:pt-2 border-t border-gray-800/50 mt-2 sm:mt-4">
                      <div className="bg-gray-800/30 rounded-lg p-3 sm:p-4">
                        <h4 className="text-xs sm:text-sm font-medium text-purple-300 mb-1 sm:mb-2">How This Helps Your Business:</h4>
                        <p className="text-xs sm:text-sm text-gray-400">{scenario.details}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-2xl border border-gray-700/50 p-6 sm:p-12 backdrop-blur-sm">
              <h2 className="text-xl sm:text-3xl font-bold mb-3 sm:mb-4">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                  Ready to Transform Your Business?
                </span>
              </h2>
              <p className="text-gray-300 text-sm sm:text-lg max-w-2xl mx-auto mb-6 sm:mb-8">
                Join thousands of businesses using Flixby to provide exceptional customer service 24/7
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="w-full sm:w-auto group bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center sm:justify-start transform hover:scale-105">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="w-full sm:w-auto text-gray-300 hover:text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium border border-gray-700 hover:border-gray-500 transition-all duration-300">
                  Schedule a Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UseCases;