/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import * as s from "./styles";
import instance from "../../configs/axios";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { HiOutlineLocationMarker, HiOutlineHeart } from "react-icons/hi";
import { MdOutlineGridView, MdOutlineLogout } from "react-icons/md";

function MyPageCategory() {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout, loading } = useAuth();
    const [nickname, setNickname] = useState('');
    const [isEditingNickname, setIsEditingNickname] = useState(false);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            alert('로그인이 필요한 서비스입니다.');
            navigate('/login');
            return;
        }
        if (user) {
            setNickname(user.nickname || user.name || '');
        }
    }, [user, isAuthenticated, loading, navigate]);

    const handleUpdateNickname = async () => {
        if (!nickname.trim()) {
            alert('닉네임을 입력해주세요.');
            return;
        }
        try {
            await instance.patch('/api/users/nickname', { nickname: nickname.trim() });
            alert('닉네임이 변경되었습니다.');
            setIsEditingNickname(false);
            window.location.reload();
        } catch (error) {
            alert('닉네임 변경에 실패했습니다.');
        }
    };

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
            {/* 상단 오렌지 프로필 헤더 */}
            <div css={s.hi}>
                <div css={s.profileWrapper}>
                    {isEditingNickname ? (
                        <div css={s.nicknameEdit}>
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                css={s.nicknameInput}
                            />
                            <button onClick={handleUpdateNickname} css={s.saveButton}>저장</button>
                            <button onClick={() => setIsEditingNickname(false)} css={s.cancelButton}>취소</button>
                        </div>
                    ) : (
                        <div css={s.nicknameDisplay}>
                            <h2>{user.nickname || user.name}님의 마이페이지</h2>
                            <button onClick={() => setIsEditingNickname(true)} css={s.editButton}>수정</button>
                        </div>
                    )}
                    <p css={s.userEmail}>{user.email}</p>
                </div>
            </div>

            {/* 하단 메뉴 리스트 */}
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