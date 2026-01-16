import { Routes, Route } from "react-router-dom";
import Header from "./components/common/header/Header";
import Footer from "./components/common/footer/Footer";
import MainPage from "./pages/mainpage/MainPage";
import SpotListPage from "./pages/spotlistpage/SpotListPage";
import NotFoundPage from "./pages/notfoundpage/NotFoundPage";
import TravelInfoPage from "./pages/travelInfoPage/TravelInfoPage";
import LoadingPage from './pages/loadingpage/LoadingPage';
import FavoritePage from "./pages/favoritepage/FavoritePage";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/spots" element={<SpotListPage />} />
        <Route path="/travelinfo" element={<TravelInfoPage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/favorites" element={<FavoritePage />} />
      </Routes>
      <Footer />
    </>
  );
}
