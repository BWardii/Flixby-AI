import Vapi from '@vapi-ai/web';

// Singleton instance
let vapiInstance: Vapi | null = null;

// Use the webcall API key for initialization
const WEBCALL_API_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY || 'fb554eaf-b79c-45df-be1c-7f766e322f87';

export function initializeVapi(): Vapi {
  if (vapiInstance) {
    return vapiInstance;
  }

  try {
    vapiInstance = new Vapi(WEBCALL_API_KEY);
    console.log('Vapi initialized for webcalls');
    return vapiInstance;
  } catch (error) {
    console.error('Error initializing Vapi:', error);
    throw new Error('Failed to initialize Vapi. Please check your API key.');
  }
}

export function getVapiInstance(): Vapi {
  if (!vapiInstance) {
    return initializeVapi();
  }
  return vapiInstance;
}

export function resetVapiInstance(): void {
  vapiInstance = null;
}

export async function validateVapiKey(apiKey: string): Promise<boolean> {
  try {
    const tempVapi = new Vapi(apiKey);
    // Test a simple API call
    await tempVapi.validateKey();
    return true;
  } catch (error) {
    console.error('Vapi key validation failed:', error);
    return false;
  }
}