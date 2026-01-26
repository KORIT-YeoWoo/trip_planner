import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { global } from './styles/global';
import { Global } from '@emotion/react';
import { AuthProvider } from './contexts/AuthContext'; // ✅ 추가

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
            <AuthProvider>
                <Global styles={global}/>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </QueryClientProvider>
)