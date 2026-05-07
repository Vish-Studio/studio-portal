import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initStores } from './lib/initStores';
import { registerServiceWorker } from './lib/registerServiceWorker';
import App from './App.tsx';
import './index.css';

// Hydrate all Zustand stores with seed data before the React tree mounts
initStores();
registerServiceWorker();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
