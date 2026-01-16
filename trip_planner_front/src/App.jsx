import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/mainpage/MainPage";
import SpotListPage from "./pages/spotlistpage/SpotListPage";
import NotFoundPage from "./pages/notfoundpage/NotFoundPage";
import TravelInfoPage from "./pages/travelInfoPage/TravelInfoPage";
import LoadingPage from './pages/loadingpage/LoadingPage';
import ItineraryDetailPage from "./pages/itinerarydetailpage/ItineraryDetailPage";
import MainLayout from "./components/common/layouts/MainLayout";
import FullScreenLayout from "./components/common/layouts/FullScreenLayout";

export default function App() {
  return <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/spots" element={<SpotListPage />} />
          <Route path="/travelinfo" element={<TravelInfoPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route element={<FullScreenLayout />}>
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/schedule" element={<ItineraryDetailPage/>}/>
        </Route>
      </Routes>
    </>
}
