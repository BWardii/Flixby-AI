import DOMPurify from 'dompurify';

export interface BusinessData {
  name?: string;
  description?: string;
  hours?: string[];
  address?: string;
  phone?: string;
  email?: string;
  rating?: string;
  reviews?: string[];
  services?: string[];
  products?: string[];
  website?: string;
  categories?: string[];
  yearEstablished?: string;
}

export interface BusinessSuggestion {
  id: string;
  name: string;
  location: string;
  rating?: string;
}

// Google Places API Configuration
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const hasGoogleApiKey = !!GOOGLE_API_KEY;

console.log('Google Places API integration status:', hasGoogleApiKey ? 'Available' : 'Not configured');

// Fetch and extract data from a website
export async function fetchWebsiteData(url: string): Promise<BusinessData> {
  try {
    // Normalize URL
    let normalizedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      normalizedUrl = `https://${url}`;
    }

    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(normalizedUrl)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.statusText}`);
    }
    
    const data = await response.json();
    const htmlContent = data.contents;
    
    // Create a temporary DOM to parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Extract business data
    const businessData: BusinessData = {};
    
    // Try to get business name from title
    const title = doc.querySelector('title')?.textContent;
    if (title) {
      businessData.name = title.split('|')[0].split('-')[0].trim();
    }
    
    // Try to get description from meta tags
    const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content');
    if (metaDescription) {
      businessData.description = metaDescription;
    }
    
    // Look for common business information patterns
    const bodyText = doc.body.textContent || '';
    
    // Try to find phone numbers - UK format
    const phoneRegex = /(\+44|0)( *\d{4}| *\d{3}| *\d{2}){2,3}/g;
    const phones = bodyText.match(phoneRegex);
    if (phones && phones.length > 0) {
      businessData.phone = phones[0];
    }
    
    // Try to find email addresses
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = bodyText.match(emailRegex);
    if (emails && emails.length > 0) {
      businessData.email = emails[0];
    }
    
    // Try to find sections with "about us", "our services", etc.
    const aboutSection = findSection(doc, ['about', 'about us', 'our company', 'who we are']);
    if (aboutSection) {
      businessData.description = aboutSection;
    }
    
    const servicesSection = findSection(doc, ['services', 'our services', 'what we do']);
    if (servicesSection) {
      businessData.services = servicesSection.split('\n').filter(s => s.trim().length > 0);
    }
    
    const hoursSection = findSection(doc, ['hours', 'business hours', 'opening hours', 'we are open']);
    if (hoursSection) {
      businessData.hours = parseHours(hoursSection);
    }

    // Website is the URL itself
    businessData.website = normalizedUrl;
    
    return businessData;
  } catch (error) {
    console.error('Error fetching website data:', error);
    throw new Error('Failed to extract data from website. Please check the URL and try again.');
  }
}

// Fetch business suggestions based on search term
export async function fetchBusinessSuggestions(searchTerm: string, location?: string): Promise<BusinessSuggestion[]> {
  if (!searchTerm || searchTerm.length < 2) {
    return [];
  }

  try {
    // If Google Places API key is available, use the real API
    if (hasGoogleApiKey) {
      return await fetchGooglePlacesSuggestions(searchTerm, location);
    }
    
    // Otherwise fall back to mock data
    // This is a simulation of Google Places API response
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    // Generate business types based on search term
    const businessTypes = getBusinessTypesBySearchTerm(searchTerm);
    
    // Generate 3-5 fake results based on the search term and location
    const numberOfResults = Math.floor(Math.random() * 3) + 3; // 3-5 results
    const suggestions: BusinessSuggestion[] = [];
    
    for (let i = 0; i < numberOfResults; i++) {
      const businessType = businessTypes[i % businessTypes.length];
      
      // Generate names with variations based on search term
      let name = '';
      if (i === 0) {
        // First result is the closest match
        name = searchTerm;
        if (businessType && !searchTerm.toLowerCase().includes(businessType.toLowerCase())) {
          name += ` ${businessType}`;
        }
      } else {
        // Add variations for other results
        const prefixes = ["The ", "Best ", "Premium ", "Elite ", "", ""];
        const suffixes = [" Group", " Ltd", " Limited", " Co", " & Sons", ""];
        name = `${prefixes[Math.floor(Math.random() * prefixes.length)]}${searchTerm}${i === 1 ? '' : ' ' + String.fromCharCode(65 + i - 2)}${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
      }
      
      // Generate rating between 3.5 and 5.0
      const rating = (Math.floor(Math.random() * 15) + 35) / 10;
      
      // Get a location suffix if no location was provided
      const locationSuffix = location || getRandomLocation();
      
      suggestions.push({
        id: `business_${Date.now()}_${i}`,
        name: name,
        location: locationSuffix,
        rating: rating.toString()
      });
    }
    
    return suggestions;
  } catch (error) {
    console.error('Error fetching business suggestions:', error);
    return [];
  }
}

// Function to fetch actual suggestions from Google Places API
async function fetchGooglePlacesSuggestions(searchTerm: string, location?: string): Promise<BusinessSuggestion[]> {
  try {
    const searchQuery = `${searchTerm}${location ? ` ${location}` : ''}`;
    
    // Use our backend proxy to avoid exposing API key
    const serverPort = 3001; // The port our server is running on
    const serverUrl = `http://localhost:${serverPort}`;
    const url = `${serverUrl}/api/places/search?query=${encodeURIComponent(searchQuery)}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Places search error: ${response.statusText}`);
    }
    
    const places = await response.json();
    
    return places.map((place: any) => ({
      id: place.id,
      name: place.name,
      location: place.location,
      rating: place.rating
    }));
  } catch (error) {
    console.error('Error fetching from Places API:', error);
    console.log('Falling back to mock data');
    
    // Fall back to mock data
    return [
      {
        id: `google_mock_${Date.now()}_1`,
        name: searchTerm,
        location: location || 'London, UK',
        rating: '4.5'
      },
      {
        id: `google_mock_${Date.now()}_2`,
        name: `${searchTerm} UK`,
        location: location || 'Manchester, UK',
        rating: '4.2'
      }
    ];
  }
}

// Fetch data from Google Business Profile
export async function fetchGoogleBusinessData(businessId: string): Promise<BusinessData> {
  try {
    // Use our backend endpoint to get place details
    const serverPort = 3001; // The port our server is running on
    const serverUrl = `http://localhost:${serverPort}`;
    const url = `${serverUrl}/api/places/details?placeId=${encodeURIComponent(businessId)}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch business details: ${response.statusText}`);
    }
    
    const businessData = await response.json();
    
    // Generate a description since Google doesn't always provide one
    if (!businessData.description) {
      businessData.description = generateBusinessDescription(
        businessData.name || '',
        businessData.categories?.join(', ') || 'business',
        businessData.yearEstablished || (new Date().getFullYear() - 10).toString(),
        businessData.address?.split(',').slice(-2, -1)[0]?.trim() || 'the area'
      );
    }
    
    return businessData;
  } catch (error) {
    console.error('Error fetching Google Business data:', error);
    throw new Error('Failed to retrieve Google Business data. Please try again later.');
  }
}

// Generate a system prompt based on the business data
export function generateSystemPrompt(businessData: BusinessData): string {
  if (!businessData || Object.keys(businessData).length === 0) {
    return '';
  }
  
  let prompt = `You are an AI assistant for ${businessData.name || 'the business'}. `;
  
  if (businessData.description) {
    prompt += `${businessData.description} `;
  }
  
  if (businessData.categories && businessData.categories.length > 0) {
    prompt += `\n\nBusiness categories: ${businessData.categories.join(', ')}. `;
  }

  if (businessData.yearEstablished) {
    prompt += `\n\nEstablished in ${businessData.yearEstablished}. `;
  }
  
  if (businessData.services && businessData.services.length > 0) {
    prompt += `\n\nThe business offers the following services: ${businessData.services.join(', ')}. `;
  }
  
  if (businessData.products && businessData.products.length > 0) {
    prompt += `\n\nProducts offered: ${businessData.products.join(', ')}. `;
  }
  
  if (businessData.hours && businessData.hours.length > 0) {
    prompt += `\n\nBusiness hours:\n${businessData.hours.join('\n')}. `;
  }
  
  if (businessData.address) {
    prompt += `\n\nThe business is located at: ${businessData.address}. `;
  }
  
  if (businessData.phone) {
    prompt += `\n\nPhone number: ${businessData.phone}. `;
  }
  
  if (businessData.email) {
    prompt += `\n\nEmail: ${businessData.email}. `;
  }
  
  if (businessData.website) {
    prompt += `\n\nWebsite: ${businessData.website}. `;
  }
  
  if (businessData.rating) {
    prompt += `\n\nThe business has a rating of ${businessData.rating} out of 5. `;
    
    if (businessData.reviews && businessData.reviews.length > 0) {
      prompt += `\n\nCustomer reviews:\n`;
      businessData.reviews.forEach((review, index) => {
        prompt += `"${review}"\n`;
      });
    }
  }
  
  prompt += `\n\nPlease be friendly, helpful, and professional when responding to customer inquiries. `;
  prompt += `Always provide accurate information about the business and its services. `;
  prompt += `When you don't know something specific, acknowledge it and offer to take a message or direct them to contact the business directly.`;
  
  return prompt;
}

// Helper function to find relevant sections in the document
function findSection(doc: Document, sectionNames: string[]): string | null {
  // Look for headings that might contain section names
  const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  
  for (const heading of headings) {
    const headingText = heading.textContent?.toLowerCase() || '';
    
    for (const sectionName of sectionNames) {
      if (headingText.includes(sectionName.toLowerCase())) {
        // Get the next sibling elements until the next heading
        let content = '';
        let currentElement = heading.nextElementSibling;
        
        while (currentElement && !currentElement.tagName.match(/^H[1-6]$/)) {
          content += currentElement.textContent + '\n';
          currentElement = currentElement.nextElementSibling;
        }
        
        return content.trim();
      }
    }
  }
  
  // If no section found by heading, try looking for sections by ID or class
  for (const sectionName of sectionNames) {
    const sectionElements = Array.from(doc.querySelectorAll(`[id*=${sectionName}], [class*=${sectionName}]`));
    
    if (sectionElements.length > 0) {
      return sectionElements[0].textContent?.trim() || null;
    }
  }
  
  return null;
}

// Helper function to parse hours text into structured format
function parseHours(hoursText: string): string[] {
  const lines = hoursText.split('\n').filter(line => line.trim().length > 0);
  const result: string[] = [];
  
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  for (const line of lines) {
    const lowercaseLine = line.toLowerCase();
    for (const day of days) {
      if (lowercaseLine.includes(day)) {
        result.push(line.trim());
        break;
      }
    }
  }
  
  return result.length > 0 ? result : [hoursText];
}

// Helper function to determine business type from name
function getBusinessType(name: string): string {
  const lowercaseName = name.toLowerCase();
  
  const typeMap: Record<string, string> = {
    'restaurant': 'restaurant',
    'café': 'cafe',
    'cafe': 'cafe',
    'coffee': 'cafe',
    'bakery': 'bakery',
    'salon': 'salon',
    'spa': 'spa',
    'gym': 'gym',
    'fitness': 'gym',
    'shop': 'retail',
    'store': 'retail',
    'market': 'retail',
    'tech': 'technology',
    'consulting': 'consulting',
    'agency': 'agency',
    'law': 'legal',
    'solicitor': 'legal',
    'legal': 'legal',
    'clinic': 'healthcare',
    'medical': 'healthcare',
    'doctor': 'healthcare',
    'dental': 'dental',
    'dentist': 'dental',
    'hotel': 'hotel',
    'motel': 'hotel',
    'inn': 'hotel',
    'auto': 'automotive',
    'car': 'automotive',
    'repair': 'repair',
    'plumb': 'plumbing',
    'electric': 'electrical',
    'pet': 'pet',
    'vet': 'veterinary',
    'clean': 'cleaning',
    'estate agent': 'real estate',
    'property': 'real estate',
    'school': 'education',
    'academy': 'education',
    'education': 'education',
    'construction': 'construction',
    'build': 'construction',
    'photo': 'photography',
    'design': 'design',
    'graphic': 'design',
    'art': 'art',
    'gallery': 'art'
  };
  
  for (const [keyword, type] of Object.entries(typeMap)) {
    if (lowercaseName.includes(keyword)) {
      return type;
    }
  }
  
  // Default business types if no match found
  const defaultTypes = [
    'retail', 'restaurant', 'consulting', 'services', 'technology'
  ];
  
  return defaultTypes[Math.floor(Math.random() * defaultTypes.length)];
}

// Helper function to get business types by search term
function getBusinessTypesBySearchTerm(term: string): string[] {
  const businessType = getBusinessType(term);
  
  const relatedTypes: Record<string, string[]> = {
    'restaurant': ['Restaurant', 'Café', 'Bistro', 'Eatery', 'Dining'],
    'cafe': ['Café', 'Coffee Shop', 'Bakery', 'Tea Room'],
    'bakery': ['Bakery', 'Pastry Shop', 'Cake Shop', 'Dessert Place'],
    'salon': ['Salon', 'Hair Studio', 'Beauty Parlor', 'Spa'],
    'spa': ['Spa', 'Wellness Centre', 'Massage Therapy', 'Day Spa'],
    'gym': ['Gym', 'Fitness Centre', 'Health Club', 'Training Studio'],
    'retail': ['Store', 'Shop', 'Boutique', 'Retailer', 'Market'],
    'technology': ['Tech Company', 'IT Services', 'Software Development'],
    'consulting': ['Consulting Firm', 'Advisory Services', 'Consultancy'],
    'agency': ['Agency', 'Creative Studio', 'Marketing Agency'],
    'legal': ['Law Firm', 'Legal Services', 'Solicitors'],
    'healthcare': ['Medical Centre', 'Clinic', 'Healthcare Provider'],
    'dental': ['Dental Practice', 'Dentist', 'Orthodontist'],
    'hotel': ['Hotel', 'Lodge', 'Inn', 'Accommodations'],
    'automotive': ['Auto Shop', 'Car Dealership', 'Mechanic'],
    'repair': ['Repair Shop', 'Fix-It Service', 'Maintenance'],
    'plumbing': ['Plumbing Service', 'Plumber', 'Water Systems'],
    'electrical': ['Electrical Service', 'Electrician', 'Electric Repairs'],
    'pet': ['Pet Store', 'Pet Supplies', 'Animal Care'],
    'veterinary': ['Veterinary Clinic', 'Animal Hospital', 'Pet Care'],
    'cleaning': ['Cleaning Service', 'Janitorial', 'Housekeeping'],
    'real estate': ['Estate Agent', 'Property Management', 'Property Consultants'],
    'education': ['School', 'Academy', 'Learning Centre', 'Education Centre'],
    'construction': ['Construction Company', 'Builders', 'Contractors'],
    'photography': ['Photography Studio', 'Photo Services', 'Photographer'],
    'design': ['Design Studio', 'Graphic Design', 'Creative Agency'],
    'art': ['Art Gallery', 'Art Studio', 'Craft Shop', 'Artist Workshop']
  };
  
  return relatedTypes[businessType] || ['Business', 'Company', 'Services'];
}

// Helper to generate random location
function getRandomLocation(): string {
  const cities = ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Glasgow', 'Edinburgh', 'Cardiff', 'Belfast', 'Leeds', 'Sheffield'];
  const counties = ['Greater London', 'Greater Manchester', 'West Midlands', 'Merseyside', 'Lanarkshire', 'Midlothian', 'South Glamorgan', 'County Antrim', 'West Yorkshire', 'South Yorkshire'];
  
  const index = Math.floor(Math.random() * cities.length);
  return `${cities[index]}, ${counties[index]}`;
}

// Helper to generate business description
function generateBusinessDescription(name: string, type: string, yearEstablished: string, location: string): string {
  const descriptions: Record<string, string[]> = {
    'restaurant': [
      `${name} is a beloved ${type} establishment serving delicious cuisine since ${yearEstablished}. Located in ${location}, we pride ourselves on using fresh, locally-sourced ingredients and providing an exceptional dining experience for our guests.`,
      `Established in ${yearEstablished}, ${name} offers a unique dining experience in the heart of ${location}. We specialise in crafting memorable meals in a welcoming atmosphere that keeps our customers coming back.`,
      `Welcome to ${name}, ${location}'s premier dining destination since ${yearEstablished}. Our passionate chefs create innovative dishes that celebrate local flavours and global culinary traditions.`
    ],
    'cafe': [
      `${name} is a cozy café in ${location} that has been serving premium coffee and delightful treats since ${yearEstablished}. We're committed to creating a warm, inviting space where our community can gather and connect.`,
      `Since ${yearEstablished}, ${name} has been ${location}'s favourite spot for specialty coffee, artisanal teas, and freshly baked goods. We source our beans ethically and roast them with care.`,
      `${name} is more than just a café—we're a local institution in ${location} since ${yearEstablished}. Our passion for quality coffee and exceptional service creates a unique experience for every customer.`
    ],
    'retail': [
      `${name} has been a trusted retailer in ${location} since ${yearEstablished}, offering a carefully curated selection of high-quality products. Our knowledgeable staff is dedicated to providing personalised service.`,
      `Established in ${yearEstablished}, ${name} is ${location}'s destination for premium shopping. We take pride in our product selection and commitment to customer satisfaction.`,
      `At ${name}, we've been serving the ${location} community since ${yearEstablished} with unique merchandise and exceptional customer service. Our mission is to provide products that enhance our customers' lives.`
    ],
    'healthcare': [
      `${name} has been providing compassionate healthcare services to the ${location} community since ${yearEstablished}. Our dedicated team of professionals is committed to your health and wellbeing.`,
      `Established in ${yearEstablished}, ${name} delivers patient-centered healthcare with a focus on excellence and innovation. We're proud to serve ${location} with comprehensive medical services.`,
      `${name} is a trusted healthcare provider in ${location} since ${yearEstablished}. Our experienced practitioners combine cutting-edge medical technology with personalised care.`
    ]
  };
  
  // Get descriptions specific to the business type or use generic descriptions
  const specificDescriptions = descriptions[type] || [
    `${name} is a leading ${type} business serving ${location} since ${yearEstablished}. We're committed to excellence and customer satisfaction in everything we do.`,
    `Established in ${yearEstablished}, ${name} provides top-quality ${type} services to clients throughout ${location}. Our experienced team delivers professional solutions tailored to your needs.`,
    `${name} has proudly served the ${location} area since ${yearEstablished}. As a trusted local ${type} business, we combine expertise with personalised service to exceed our customers' expectations.`
  ];
  
  return specificDescriptions[Math.floor(Math.random() * specificDescriptions.length)];
}