import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import SpotListPage from './pages/SpotListPage';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/jeju" element={<SpotListPage />} />
    </Routes>
  </BrowserRouter>
);
