import axios from 'axios';

/**
 * 기본 API 인스턴스 생성
 */
const apiClient = axios.create({
  // 환경변수로 관리하는 것을 권장하며, 기본값으로 json-server 주소 세팅
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});


apiClient.interceptors.request.use(
  (config) => {
    // TODO: [F-00-2] 토큰 주입 로직
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: [F-04-1, F-00-2] 에러 및 토큰 만료 처리
    return Promise.reject(error);
  }
);

export default apiClient;