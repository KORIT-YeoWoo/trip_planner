import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/mainpage/MainPage";
import SpotListPage from "./pages/spotlistpage/SpotListPage";
import NotFoundPage from "./pages/notfoundpage/NotFoundPage";
import TravelInfoPage from "./pages/travelInfoPage/TravelInfoPage";
import LoadingPage from './pages/loadingpage/LoadingPage'; // 주석 해제 (Route에서 사용 중)
import ItineraryDetailPage from "./pages/itinerarydetailpage/ItineraryDetailPage";
import MainLayout from "./components/common/layouts/MainLayout";
import FullScreenLayout from "./components/common/layouts/FullScreenLayout";
import FavoritePage from "./pages/favoritepage/FavoritePage";
import AiChatPage from "./pages/aichatpage/AiChatPage";

import OAuth2CallbackPage from "./pages/OAuth2CallbackPage/OAuth2CallbackPage";
import MyPage from "./pages/mypage/MyPage";
import TosPage from "./pages/tospage/TosPage";
import MyStylePage from "./pages/mystylepage/MyStylePage";
import MyItinerariesPage from "./pages/myitinerariespage/MyItinerariesPage";

// 로그인 모달 컴포넌트
import LoginModal from "./components/loginModal/LoginModal"; 

export default function App() {
  return (
    <>
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

      {/* 전역 로그인 모달: Routes 바깥에 두어 어디서든 팝업이 뜰 수 있게 함 */}
      <LoginModal />
    </>
  );
}