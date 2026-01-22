import { useState, useEffect } from 'react';
import instance from '../configs/axios';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // 사용자 정보 가져오기
    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('AccessToken');
            
            if (!token) {
                setUser(null);
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            const response = await instance.get('/api/auth/me');
            
            if (response && response.userId) {
                setUser(response);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('사용자 정보 조회 실패:', error);
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('AccessToken');
        } finally {
            setLoading(false);
        }
    };

    // 로그아웃
    const logout = () => {
        localStorage.removeItem('AccessToken');
        setUser(null);
        setIsAuthenticated(false);
    };

    // 컴포넌트 마운트 시 사용자 정보 확인
    useEffect(() => {
        fetchUser();
    }, []);

    return {
        user,
        loading,
        isAuthenticated,
        logout,
        refreshUser: fetchUser
    };
};