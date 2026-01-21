import axios from "axios";

// Axios 인스턴스 생성
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000, // 10초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // CORS 쿠키 전송 허용
});

// 요청 인터셉터
instance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("AccessToken");
        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        console.log(`[API 요청] ${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('[요청 인터셉터 에러]',error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터
instance.interceptors.response.use(
    (response) => {
        console.log(`[API 응답] ${response.config.url}`, response.data);

        // ApiResponse<T> 형식 체크 후 data 추출
        if(response.data && response.data.success !== undefined){
            return response.data; // { success, data, message }
        }

        // 일반 응답은 그대로 반환
        return response.data;
    },
    (error) => {
        console.error('[응답 인터셉터 에러]',error);

        // 에러 응답 처리
        if(error.response){
            const { status, data } = error.response;

            // ApiResponse 에러 형식
            if(data && data.error) {
                const { code, message } = error.data;
                
                console.error(`[${status}] ${code}: ${message}`);
            
                // 상태 코드별 처리
                switch (status) {
                    case 400:
                        alert(`입력 오류: ${message}`);
                        break;
                    case 401:
                        alert('로그인이 필요한 서비스입니다.');
                        // Week 3: 로그인 페이지로 리다이렉트
                        // window.location.href = '/login';
                        break;
                    case 403:
                        alert('접근 권한이 없습니다.');
                        break;
                    case 404:
                        alert(`요청하신 리소스를 찾을 수 없습니다: ${message}`);
                        break;
                    case 500:
                        alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                        break;
                    default:
                        alert(`오류가 발생했습니다: ${message}`);
                }
                return Promise.reject({
                    status,
                    code,
                    message,
                });
            }

            // ApiResponse 형식이 아닌 일반 에러
            console.error(`[${status}] ${data}`);
            return Promise.reject(error);
        }

        // 네트워크 에러 (서버 응답 없음)
        if (error.request) {
            console.error('네트워크 에러: 서버 응답이 없습니다.');
            alert('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
        } else {
            console.error('요청 설정 에러:', error.message);
        }

        return Promise.reject(error);
    }
)

export default instance;