import { useEffect } from 'react';
import { getCSRFToken } from './services/auth';

function App() {
  useEffect(() => {
    // Fetch CSRF token on initial load
    getCSRFToken();
  }, []);

  // ... rest of your app
}