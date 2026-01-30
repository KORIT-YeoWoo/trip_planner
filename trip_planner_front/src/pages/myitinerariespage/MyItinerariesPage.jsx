/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoTrashOutline } from 'react-icons/io5';
import MyPageCategory from '../../components/mypage/MyPageCategory';
import * as s from './styles';

function MyItinerariesPage() {
    const navigate = useNavigate();
    const [itineraries, setItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_BASE = import.meta.env.VITE_API_BASE_URL;
    
    useEffect(() => {
        fetchMyItineraries();
    }, []);

    const fetchMyItineraries = async () => {
        try {
            const token = localStorage.getItem('AccessToken');
            
            const response = await axios.get(
                '${API_BASE}/api/itinerary/my',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            console.log('✅ 내 일정 조회:', response.data);
            setItineraries(response.data || []);
            
        } catch (error) {
            console.error('❌ 일정 조회 실패:', error);
            if (error.response?.status === 401) {
                alert('로그인이 필요합니다.');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleItemClick = (itineraryId) => {
        navigate('/schedule', {
            state: {
                itineraryData: { itineraryId }
            }
        });
    };

    // ✅ 삭제 핸들러
    const handleDelete = async (e, itineraryId) => {
        e.stopPropagation(); // 부모 클릭 이벤트 막기

        if (!confirm('정말 이 일정을 삭제하시겠습니까?')) {
            return;
        }

        try {
            const token = localStorage.getItem('AccessToken');
            
            await axios.delete(
                `${API_BASE}/api/itinerary/${itineraryId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            console.log('✅ 일정 삭제 완료:', itineraryId);
            
            // 화면에서 즉시 제거
            setItineraries(prev => prev.filter(item => item.itineraryId !== itineraryId));
            
        } catch (error) {
            console.error('❌ 일정 삭제 실패:', error);
            alert('일정 삭제에 실패했습니다.');
        }
    };

    return (
        <div css={s.layout}>
            <div css={s.bar}>
                <MyPageCategory />
            </div>

            <div css={s.content}>
                <div css={s.overlay}>
                    <div css={s.favoritContent}>
                        <h1>저장된 일정</h1>

                        {loading ? (
                            <div style={{ 
                                flex: 1, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                color: '#999'
                            }}>
                                로딩 중...
                            </div>
                        ) : itineraries.length === 0 ? (
                            <div css={s.empty}>
                                <div>아직 저장된 일정이 없어요!</div>
                                <button onClick={() => navigate('/spots')}>
                                    새 일정 만들기
                                </button>
                            </div>
                        ) : (
                            <div css={s.listScroll}>
                                {itineraries.map((itinerary) => (
                                    <div 
                                        key={itinerary.itineraryId}
                                        css={s.listItem}
                                        onClick={() => handleItemClick(itinerary.itineraryId)}
                                    >
                                        {/* 썸네일 */}
                                        <div css={s.thumbnail}>
                                            {itinerary.thumbnailUrl ? (
                                                <img src={itinerary.thumbnailUrl} alt="썸네일" />
                                            ) : (
                                                <div css={s.emptyThumbnail}>🦊</div>
                                            )}
                                        </div>

                                        {/* 정보 */}
                                        <div css={s.info}>
                                            <div css={s.infoHeader}>
                                                <h3>{itinerary.title}</h3>
                                                <span css={s.date}>
                                                    {itinerary.startDate} ~ {itinerary.endDate}
                                                </span>
                                            </div>

                                            <div css={s.details}>
                                                <span>📍 {itinerary.totalSpots}곳</span>
                                                <span>💰 {itinerary.budget?.toLocaleString()}원</span>
                                                <span css={s.tag}>{itinerary.transport}</span>
                                                <span css={s.tag}>{itinerary.partyType}</span>
                                            </div>
                                        </div>

                                        {/* ✅ 삭제 버튼 */}
                                        <button 
                                            css={s.deleteBtn}
                                            onClick={(e) => handleDelete(e, itinerary.itineraryId)}
                                            aria-label="삭제"
                                        >
                                            <IoTrashOutline size={24} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div css={s.bar} style={{ borderRight: 'none' }}></div>
        </div>
    );
}

export default MyItinerariesPage;