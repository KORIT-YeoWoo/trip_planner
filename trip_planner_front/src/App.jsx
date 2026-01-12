import { Routes, Route } from 'react-router-dom';
import Header from './components/common/header/Header';
import Footer from './components/common/footer/Footer';
import MainPage from './pages/mainpage/MainPage';
import SpotListPage from './pages/spotlistpage/SpotListPage';
import NotFoundPage from './pages/notfoundpage/NotFoundPage';

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/spots" element={<SpotListPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
}