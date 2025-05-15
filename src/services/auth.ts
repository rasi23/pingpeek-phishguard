export const getCSRFToken = async (): Promise<string> => {
  try {
    const response = await fetch('http://localhost:8000/csrf-token', {
      method: 'GET',
      credentials: 'include'  // Required for cookies
    });
    
    if (!response.ok) {
      throw new Error(`CSRF fetch failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.token;  // Return the token from response
  } catch (error) {
    console.error('CSRF token fetch error:', error);
    throw error;
  }
};