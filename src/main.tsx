import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/500.css';
import '@fontsource/open-sans/600.css';
import '@fontsource/open-sans/700.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/variables.css';
import './index.css';
import App from './App.tsx';
import { RepositoryProvider } from './repositories';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RepositoryProvider>
        <App />
      </RepositoryProvider>
    </QueryClientProvider>
  </StrictMode>
);
