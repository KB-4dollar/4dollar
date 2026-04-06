# 🛠️ apiClient.js 상세 가이드

`src/client/apiClient.js`는 애플리케이션 전체에서 사용하는 **공통 Axios 인스턴스**입니다. 서버와의 통신을 단순화하고, 인증 토큰 및 에러 처리를 중앙 집중화합니다.

## 1. 기본 설정
- **Base URL**: `import.meta.env.VITE_API_BASE_URL` (기본값: `http://localhost:3000`)
- **Timeout**: 5000ms (5초 초과 시 요청 취소)
- **Content-Type**: `application/json`

## 2. Interceptor (인터셉터) 동작 원리

### 요청(Request) 인터셉터 [F-00-2]
API 요청이 서버로 전송되기 직전에 가로채어, `localStorage`에 저장된 `auth_token`이 존재할 경우 헤더에 자동 주입합니다.
- **헤더 형식**: `Authorization: Bearer <token>`

### 응답(Response) 인터셉터 [F-04-1, F-00-2]
서버로부터 응답을 받은 직후 처리됩니다.
- **성공**: 정상적인 응답 객체 반환
- **에러**: 
  - 서버 다운(응답 없음): "서버 연결에 실패했습니다. 나중에 다시 시도해주세요." 예외 처리
  - 401(토큰 만료/권한 없음): 자동 로그아웃 및 로그인 페이지 리다이렉트 (필요 시 확장)

## 3. 사용 방법
직접 `apiClient`를 호출하기보다는, `authService`나 `transactionService`와 같은 서비스 레이어에서 임포트하여 사용하는 것을 권장합니다.

```javascript
import apiClient from '@/client/apiClient';

// 사용 예시
const fetchData = async () => {
  const response = await apiClient.get('/some-endpoint');
  return response.data;
};