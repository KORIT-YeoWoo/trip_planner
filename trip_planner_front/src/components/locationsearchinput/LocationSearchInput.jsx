/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import * as s from "./styles";
import axios from "axios";

const LocationSearchInput = ({
    label,
    placeholder = '장소를 검색하세요',
    defaultValue = null,
    onSelect
}) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(defaultValue);
    const [showResults, setShowResults] = useState(false);

    // 카카오 API 키 (환경변수)
    const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;

    // 검색 함수
    const searchPlaces = async (searchQuery) => {
        if (!searchQuery || searchQuery.trim().length < 2) {
            setResults([]);
            return;
        }

        setIsSearching(true);

        try {
            const response = await axios.get(
                'https://dapi.kakao.com/v2/local/search/keyword.json',
                {
                    params: {
                        query: searchQuery,
                        size: 10
                    },
                    headers: {
                        Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`
                    }
                }
            );

            setResults(response.data.documents);
            setShowResults(true);
        } catch (error) {
            console.error('장소 검색 실패:', error);
            setResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    // Debounce 처리
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query) {
                searchPlaces(query);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // 장소 선택 핸들러
    const handleSelectPlace = (place) => {
        const selected = {
            name: place.place_name,
            address: place.address_name, 
            lat: parseFloat(place.y),
            lon: parseFloat(place.x)
        };

        setSelectedPlace(selected);
        setQuery('');
        setResults([]);
        setShowResults(false);

        if (onSelect) {
            onSelect(selected);
        }
    };

    // 선택 취소
    const handleClear = () => {
        setSelectedPlace(null);
        setQuery('');
        if (onSelect) {
            onSelect(null);
        }
    };

    return (
        <div css={s.locationSearchInput}>
            {label && <label css={s.locationLabel}>{label}</label>}

            {selectedPlace ? (
                <div css={s.selectedPlace}>
                    <div css={s.placeInfo}>
                        <div css={s.placeName}> {selectedPlace.name}</div>
                        <div css={s.placeAddress}>{selectedPlace.address}</div>
                    </div>
                    <button
                        css={s.clearButton}
                        onClick={handleClear}
                    >
                        ✏️ 변경
                    </button>
                </div>
            ) : (
                <>
                    {/* 검색 입력창 */}
                    <div css={s.searchInputWrapper}>
                        <input
                            type="text"
                            css={s.searchInput}
                            placeholder={placeholder}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => query && setShowResults(true)}
                        />
                        {isSearching && <span css={s.searchingIcon}>🔍</span>}
                    </div>

                    {/* 검색 결과 */}
                    {showResults && results.length > 0 && (
                        <div css={s.searchResults}>
                            {results.map((place, index) => (
                                <div
                                    key={index}
                                    css={s.resultItem}
                                    onClick={() => handleSelectPlace(place)}
                                >
                                    <div css={s.resultName}>{place.place_name}</div>
                                    <div css={s.resultAddress}>{place.address_name}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default LocationSearchInput;