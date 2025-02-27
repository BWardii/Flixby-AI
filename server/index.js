import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Client } from '@googlemaps/google-maps-services-js';

const app = express();
const port = process.env.PORT || 3001;

// Middleware: Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// Instantiate the Google Maps client using your API key
const googleMapsClient = new Client({});
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;

// Log API key availability (without exposing the actual key)
console.log(`Google Maps API key ${GOOGLE_MAPS_API_KEY ? 'is available' : 'is missing'}`);

/**
 * Endpoint: GET /api/places/search
 * 
 * Searches for businesses based on query text
 * 
 * Query parameters:
 *   - query: Search text (business name + optional location)
 */
app.get('/api/places/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Missing required parameter: query' });
    }

    if (!GOOGLE_MAPS_API_KEY) {
      return res.status(500).json({ error: 'Google Maps API key not configured' });
    }

    console.log(`Processing search request for: "${query}"`);

    const response = await googleMapsClient.textSearch({
      params: {
        query,
        key: GOOGLE_MAPS_API_KEY,
      },
      timeout: 3000
    });

    // Format the response to only include what we need
    const places = response.data.results.map(place => ({
      id: place.place_id,
      name: place.name,
      location: place.formatted_address,
      rating: place.rating?.toString(),
      types: place.types
    }));

    console.log(`Found ${places.length} places for "${query}"`);
    res.json(places.slice(0, 5)); // Limit to 5 results
  } catch (error) {
    console.error('Error searching places:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to search places',
      message: error.message 
    });
  }
});

/**
 * Endpoint: GET /api/places/details
 *
 * Expects a query parameter:
 *   - placeId: The Google Place ID
 */
app.get('/api/places/details', async (req, res) => {
  try {
    const { placeId } = req.query;
    
    if (!placeId) {
      return res.status(400).json({ error: 'Missing required parameter: placeId' });
    }

    if (!GOOGLE_MAPS_API_KEY) {
      return res.status(500).json({ error: 'Google Maps API key not configured' });
    }

    console.log(`Fetching details for place ID: ${placeId}`);

    // Call the Place Details API from Google
    const response = await googleMapsClient.placeDetails({
      params: {
        place_id: placeId,
        key: GOOGLE_MAPS_API_KEY,
        // Specify the fields you need
        fields: [
          'name',
          'formatted_address',
          'formatted_phone_number',
          'opening_hours',
          'website',
          'rating',
          'reviews',
          'types',
          'business_status',
          'url',
        ]
      },
      timeout: 3000
    });

    // Format the response into a more usable structure
    const place = response.data.result;
    
    const businessData = {
      name: place.name,
      address: place.formatted_address,
      phone: place.formatted_phone_number,
      website: place.website,
      rating: place.rating?.toString(),
      url: place.url,
      status: place.business_status,
      categories: place.types?.map(type => 
        type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      ),
      hours: place.opening_hours?.weekday_text || [],
      reviews: place.reviews?.slice(0, 3).map(review => review.text) || []
    };
    
    console.log(`Successfully fetched details for: ${businessData.name}`);
    res.json(businessData);
  } catch (error) {
    console.error('Error fetching place details:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch place details',
      message: error.message 
    });
  }
});

/**
 * Endpoint: GET /api/places/autocomplete
 * 
 * Provides place suggestions based on input text
 * 
 * Query parameters:
 *   - input: The input text to get suggestions for
 *   - sessiontoken: Optional token to group related queries
 */
app.get('/api/places/autocomplete', async (req, res) => {
  try {
    const { input, sessiontoken } = req.query;
    
    if (!input) {
      return res.status(400).json({ error: 'Missing required parameter: input' });
    }

    if (!GOOGLE_MAPS_API_KEY) {
      return res.status(500).json({ error: 'Google Maps API key not configured' });
    }

    console.log(`Processing autocomplete request for: "${input}"`);

    const response = await googleMapsClient.placeAutocomplete({
      params: {
        input,
        sessiontoken,
        types: 'establishment', // Filter to businesses
        key: GOOGLE_MAPS_API_KEY,
      },
      timeout: 3000
    });

    // Format the response to only include what we need
    const suggestions = response.data.predictions.map(prediction => ({
      id: prediction.place_id,
      description: prediction.description,
      mainText: prediction.structured_formatting?.main_text || prediction.description.split(',')[0],
      secondaryText: prediction.structured_formatting?.secondary_text || prediction.description.split(',').slice(1).join(',').trim()
    }));

    console.log(`Found ${suggestions.length} suggestions for "${input}"`);
    res.json(suggestions.slice(0, 5)); // Limit to 5 results
  } catch (error) {
    console.error('Error fetching place autocomplete:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch place suggestions',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});