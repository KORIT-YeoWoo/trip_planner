import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import MainPage from "../pages/MainPage";
import SpotListPage from "../pages/SpotListPage";
import TravelInfoPage from "../pages/TravelInfoPage";
import LoadingPage from "../pages/LoadingPage";
import PlanPage from "../pages/PlanPage";
import MyPage from "../pages/MyPage";
import MyItinerariesPage from "../pages/MyItinerariesPage";
import MyFavoritesPage from "../pages/MyFavoritesPage";
import LoginPage from "../pages/loginpage/LoginPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: "spots",
        element: <SpotListPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "plan",
        children: [
          {
            path: "travel-info",
            element: <TravelInfoPage />,
          },
          {
            path: "loading",
            element: <LoadingPage />,
          },
          {
            path: ":id",
            element: <PlanPage />,
          },
        ],
      },
      {
        path: "my",
        element: <MyPage />,
        children: [
          {
            index: true,
            element: <MyItinerariesPage />,
          },
          {
            path: "favorites",
            element: <MyFavoritesPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
