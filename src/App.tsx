import { SpeedInsights } from '@vercel/speed-insights/react';
import { AppProviders } from './app/providers';
import { AppRoutes } from './app/router';

export default function App() {
  return (
    <AppProviders>
      <AppRoutes />
      <SpeedInsights />
    </AppProviders>
  );
}
