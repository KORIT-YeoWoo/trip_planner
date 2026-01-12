import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { global } from './styles/global';
import { Global } from '@emotion/react';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 0,
        }
    }
});
const root = document.getElementById('root');

createRoot(root).render(
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <Global styles={global}/>
            <App />
        </BrowserRouter>
    </QueryClientProvider>
)