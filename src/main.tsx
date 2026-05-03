import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initStores } from './lib/initStores';
import App from './App.tsx';
import './index.css';

// Hydrate all Zustand stores with seed data before the React tree mounts
initStores();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
