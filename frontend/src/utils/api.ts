const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'https://getxoned.onrender.com';

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error: any) {
    // Don't log AbortError - it's expected when requests are cancelled
    if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
      throw error;
    }
    
    console.error(`API Error (${endpoint}):`, error);
    
    // Check if it's a connection error
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error(`Cannot connect to API at ${API_BASE_URL}`);
      console.error('Possible causes:');
      console.error('1. Backend server is not running');
      console.error('2. VITE_API_URL is set incorrectly');
      console.error('3. CORS is not configured properly');
      
      throw new Error(`Cannot connect to server. Please check if the backend is running.`);
    }
    
    throw error;
  }
}

export { API_BASE_URL };
