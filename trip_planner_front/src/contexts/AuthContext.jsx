import { createContext, useContext, useState, useEffect } from "react";
import instance from "../configs/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // 1. 모달 상태 추가
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // 2. 모달 제어 함수 추가
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("AccessToken");
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      const response = await instance.get("/api/auth/me");
      if (response && response.userId) {
        setUser(response);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("AccessToken");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("AccessToken");
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        logout,
        refreshUser: fetchUser,
        // 3. Provider에 값 전달
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};