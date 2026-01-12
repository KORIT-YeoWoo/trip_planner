import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Global } from '@emotion/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { global } from './styles/global'
import { queryClient } from './configs/queryClient'
import MainPage from './pages/mainpage/MainPage'
import SpotListPage from './pages/spotlistpage/SpotListPage'
import TravelInfoPage from './pages/travelInfoPage/TravelInfoPage'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Global styles={global} />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/jeju" element={<SpotListPage />} />
          <Route path='/travelinfo' element={<TravelInfoPage />} />
        </Routes>
      </BrowserRouter>

      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  </React.StrictMode>
)
