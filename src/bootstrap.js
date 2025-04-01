import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Define the mount function
const mount = () => {
  const root = createRoot(document.getElementById('root'));
  root.render(<App />);
};

// Export it as the default export
export default mount;