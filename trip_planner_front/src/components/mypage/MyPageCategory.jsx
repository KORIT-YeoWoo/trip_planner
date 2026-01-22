/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import * as s from "./styles";
import instance from "../../configs/axios";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

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
            await instance.patch('/api/users/nickname', {
                nickname: nickname.trim()
            });

            alert('닉네임이 변경되었습니다.');
            setIsEditingNickname(false);
            window.location.reload(); // 사용자 정보 새로고침
        } catch (error) {
            console.error('닉네임 변경 실패:', error);
            alert('닉네임 변경에 실패했습니다.');
        }
    };

    const handleLogout = () => {
        if (window.confirm('로그아웃 하시겠습니까?')) {
            logout();
            navigate('/');
        }
    };

    if (loading) {
        return <div css={s.container}>로딩 중...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div css={s.container}>
            <div css={s.profileSection}>
                <div css={s.profileImage}>
                    {user.profileImg ? (
                        <img src={user.profileImg} alt="프로필" />
                    ) : (
                        <div css={s.defaultAvatar}>
                            {user.name?.charAt(0) || '?'}
                        </div>
                    )}
                </div>

                <div css={s.profileInfo}>
                    {isEditingNickname ? (
                        <div css={s.nicknameEdit}>
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="닉네임 입력"
                                css={s.nicknameInput}
                            />
                            <button onClick={handleUpdateNickname} css={s.saveButton}>
                                저장
                            </button>
                            <button 
                                onClick={() => {
                                    setNickname(user.nickname || user.name || '');
                                    setIsEditingNickname(false);
                                }}
                                css={s.cancelButton}
                            >
                                취소
                            </button>
                        </div>
                    ) : (
                        <div css={s.nicknameDisplay}>
                            <h2>{user.nickname || user.name}</h2>
                            <button 
                                onClick={() => setIsEditingNickname(true)}
                                css={s.editButton}
                            >
                                수정
                            </button>
                        </div>
                    )}
                    <p css={s.email}>{user.email}</p>
                    <p css={s.provider}>
                        {user.provider === 'google' && '🔵 Google'}
                        {user.provider === 'naver' && '🟢 Naver'}
                        {user.provider === 'kakao' && '🟡 Kakao'}
                    </p>
                </div>
            </div>

            <div css={s.menuSection}>
                <button css={s.menuItem} onClick={() => navigate('/my/itineraries')}>
                    저장된 일정
                </button>
                <button css={s.menuItem} onClick={() => navigate('/favorites')}>
                    관심 여행지
                </button>
                <button css={s.menuItem} onClick={() => navigate('/my/style')}>
                    내 여행 스타일
                </button>
                <button css={[s.menuItem, s.logoutMenuItem]} onClick={handleLogout}>
                    로그아웃
                </button>
            </div>
        </div>
    );
}

export default MyPageCategory;