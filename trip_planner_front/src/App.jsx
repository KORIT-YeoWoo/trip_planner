import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/mainpage/MainPage";
import SpotListPage from "./pages/spotlistpage/SpotListPage";
import NotFoundPage from "./pages/notfoundpage/NotFoundPage";
import TravelInfoPage from "./pages/travelInfoPage/TravelInfoPage";
import LoadingPage from './pages/loadingpage/LoadingPage';
import ItineraryDetailPage from "./pages/itinerarydetailpage/ItineraryDetailPage";
import MainLayout from "./components/common/layouts/MainLayout";
import FullScreenLayout from "./components/common/layouts/FullScreenLayout";
import FavoritePage from "./pages/favoritepage/FavoritePage";
import AiChatPage from "./pages/aichatpage/AiChatPage";

import LoginPage from "./pages/loginpage/LoginPage";
import OAuth2CallbackPage from "./pages/OAuth2CallbackPage/OAuth2CallbackPage";
import MyPage from "./pages/mypage/MyPage";
import TosPage from "./pages/tospage/TosPage";
import MyStylePage from "./pages/mystylepage/MyStylePage";
import MyItinerariesPage from "./pages/myitinerariespage/MyItinerariesPage";

export default function App() {
  return <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/spots" element={<SpotListPage />} />
          <Route path="/travelinfo" element={<TravelInfoPage />} />
          <Route path="/favorites" element={<FavoritePage />} />
          <Route path="/ai/chat" element={<AiChatPage />} />
          <Route path="/my" element={<MyPage />} />
          <Route path="/my/itineraries" element={<MyItinerariesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/my/style" element={<MyStylePage />} />
          <Route path="/tos" element={<TosPage />} />
          <Route path="/auth/oauth2/callback" element={<OAuth2CallbackPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route element={<FullScreenLayout />}>
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/schedule" element={<ItineraryDetailPage/>}/>
        </Route>
      </Routes>
    </>
}