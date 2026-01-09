import React from 'react'
import ReactDOM from 'react-dom/client'
import MainPage from './pages/MainPage'
import { global } from './styles/global'
import { Global } from '@emotion/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './configs/queryClient'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Global styles={global} />
      <MainPage />
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  </React.StrictMode>
)