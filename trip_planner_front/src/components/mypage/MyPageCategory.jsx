/** @jsxImportSource @emotion/react */
import { useEffect } from "react";
import * as s from "./styles";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { HiOutlineLocationMarker, HiOutlineHeart } from "react-icons/hi";
import { MdOutlineGridView, MdOutlineLogout } from "react-icons/md";

function MyPageCategory() {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout, loading } = useAuth();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            alert('로그인이 필요한 서비스입니다.');
            navigate('/login');
            return;
        }
    }, [isAuthenticated, loading, navigate]);

    const handleLogout = () => {
        if (window.confirm('로그아웃 하시겠습니까?')) {
            logout();
            navigate('/');
        }
    };

    if (loading) return <div css={s.container}>로딩 중...</div>;
    if (!user) return null;

    return (
        <div css={s.container}>
            <div css={s.hi}>
                <div css={s.profileWrapper}>
                    <div css={s.nameDisplay}>
                        <h2>{user.name} 님의 마이페이지</h2>
                    </div>
                    <p css={s.userEmail}>{user.email}</p>
                </div>
            </div>

            <div css={s.booking} onClick={() => navigate('/my/itineraries')}>
                <HiOutlineLocationMarker />저장된 일정
            </div>
            <div css={s.favorite} onClick={() => navigate("/favorites")}>
                <HiOutlineHeart />관심 여행지
            </div>
            <div css={s.myTripStyle} onClick={() => navigate('/my/style')}>
                <MdOutlineGridView />내 여행 스타일은?
            </div>
            <div css={s.logout} onClick={handleLogout}>
                <MdOutlineLogout />로그아웃
            </div>
        </div>
    );
}

export default MyPageCategory;