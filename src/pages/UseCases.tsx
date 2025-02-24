import React from 'react';
import { Phone, Bot, MessageSquare, Building2, Briefcase, ShoppingBag, Calendar, Utensils, Hotel, Plane, Car, Headphones } from 'lucide-react';

function UseCases() {
  const industries = [
    {
      icon: <Utensils className="h-8 w-8 text-orange-400" />,
      title: "Restaurants",
      scenarios: [
        {
          question: "What are your hours today?",
          response: "We're open from 11 AM to 10 PM today. Would you like to make a reservation?",
          benefit: "Handle booking inquiries 24/7"
        },
        {
          question: "Do you have any vegan options?",
          response: "Yes, we have several vegan dishes including our popular mushroom risotto and quinoa bowl. Would you like to hear our full vegan menu?",
          benefit: "Answer menu questions instantly"
        }
      ]
    },
    {
      icon: <Building2 className="h-8 w-8 text-blue-400" />,
      title: "Real Estate",
      scenarios: [
        {
          question: "Is the 2-bedroom apartment still available?",
          response: "Yes, the 2-bedroom apartment at 123 Main St is available. It's $2,200/month with utilities included. Would you like to schedule a viewing?",
          benefit: "Never miss a potential tenant"
        },
        {
          question: "What's included in the rent?",
          response: "The rent includes water, heating, and parking. You'd be responsible for electricity and internet. Would you like to know more about the amenities?",
          benefit: "Provide detailed property information"
        }
      ]
    },
    {
      icon: <Hotel className="h-8 w-8 text-purple-400" />,
      title: "Hotels",
      scenarios: [
        {
          question: "Do you have any rooms available for next weekend?",
          response: "Yes, we have several rooms available for next weekend. Our deluxe king room is $199/night. Would you like me to check specific dates for you?",
          benefit: "Streamline booking process"
        },
        {
          question: "What time is check-in?",
          response: "Check-in time is 3 PM, and check-out is at 11 AM. We can store your luggage if you arrive early. Would you like me to note an early arrival?",
          benefit: "Handle common inquiries efficiently"
        }
      ]
    }
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
                Real-World Applications
              </span>
            </h1>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
              Discover how businesses across different industries are using VoiceAI to transform
              their customer interactions and streamline operations.
            </p>
          </div>
        </div>
      </section>

      {/* Industry Scenarios */}
      <section className="py-24 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16">
            {industries.map((industry, index) => (
              <div key={index} className="relative">
                {/* Industry Header */}
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700/50 mb-4">
                    {industry.icon}
                  </div>
                  <h2 className="text-3xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                      {industry.title}
                    </span>
                  </h2>
                </div>

                {/* Scenarios */}
                <div className="space-y-8">
                  {industry.scenarios.map((scenario, scenarioIndex) => (
                    <div key={scenarioIndex} className="bg-gray-900/50 rounded-xl p-8">
                      {/* Phone Conversation */}
                      <div className="max-w-2xl mx-auto space-y-6">
                        {/* User Message */}
                        <div className="flex justify-end">
                          <div className="relative max-w-sm">
                            <div className="absolute right-0 -top-6 text-xs text-gray-400 flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              <span>Customer</span>
                            </div>
                            <div className="bg-blue-500/20 text-blue-100 px-6 py-3 rounded-2xl rounded-tr-sm">
                              {scenario.question}
                            </div>
                          </div>
                        </div>

                        {/* AI Response */}
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-400 mb-1">AI Assistant</div>
                            <div className="bg-gray-800/50 text-gray-100 px-6 py-3 rounded-2xl rounded-tl-sm">
                              {scenario.response}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Benefit */}
                      <div className="mt-6 text-center">
                        <span className="inline-flex items-center bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm">
                          <span className="mr-2">✓</span>
                          {scenario.benefit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default UseCases;