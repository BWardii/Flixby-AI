import React from 'react';
import { Check } from 'lucide-react';

function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: '$49',
      description: 'Perfect for small businesses and startups',
      features: [
        'Up to 1,000 minutes/month',
        'Basic voice customization',
        'Email support',
        'Standard analytics',
        '2 AI models',
        'Basic security features',
      ],
      highlighted: false,
    },
    {
      name: 'Professional',
      price: '$149',
      description: 'Ideal for growing companies',
      features: [
        'Up to 5,000 minutes/month',
        'Advanced voice customization',
        'Priority support',
        'Advanced analytics',
        '5 AI models',
        'Enhanced security features',
        'Custom integrations',
        'API access',
      ],
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations with specific needs',
      features: [
        'Unlimited minutes',
        'Full voice customization',
        '24/7 dedicated support',
        'Enterprise analytics',
        'All AI models',
        'Enterprise security',
        'Priority API access',
        'Custom development',
        'SLA guarantee',
      ],
      highlighted: false,
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
                Simple Pricing
              </span>
              <br />
              for Every Business
            </h1>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Choose the perfect plan for your needs. All plans include our core features
              with flexible pricing options.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="py-24 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 transform hover:scale-105 transition-all duration-300 ${
                  plan.highlighted
                    ? 'border-2 border-green-400 shadow-lg shadow-green-400/20'
                    : ''
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-green-400 text-gray-900 px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold mb-2">
                    <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                    {plan.price !== 'Custom' && (
                      <span className="text-gray-400 text-base font-normal">/month</span>
                    )}
                  </div>
                  <p className="text-gray-400">{plan.description}</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-300">
                      <Check className="h-5 w-5 text-green-400 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 px-6 rounded-full font-medium transition-all duration-300 ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:from-blue-600 hover:to-green-600'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Pricing;