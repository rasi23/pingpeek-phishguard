
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add preload link for Google Fonts (Inter and JetBrains Mono)
const fontPreloadLink = document.createElement('link');
fontPreloadLink.rel = 'stylesheet';
fontPreloadLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=JetBrains+Mono:wght@400;500;600;700&display=swap';
document.head.appendChild(fontPreloadLink);

createRoot(document.getElementById("root")!).render(<App />);
