# 🔐 authService.js 상세 가이드

`src/services/authService.js`는 회원가입, 로그인, 로그아웃 등 **사용자 인증 관련 로직(F-00 시리즈)**을 처리합니다.

## 1. 메서드 상세

### `register(userData)`
새로운 계정을 생성합니다.
- **기획 ID**: F-00
- **Parameters**:
  - `userData` (Object): `{ name, email, password }`
- **Returns**: Promise (생성된 유저 객체)

### `login(credentials)`
로그인을 수행하고 발급된 JWT 토큰을 브라우저에 저장하여 로그인 상태를 유지합니다.
- **기획 ID**: F-00-1, F-00-2
- **Parameters**:
  - `credentials` (Object): `{ email, password }`
- **Returns**: Promise (로그인 성공 시 유저 정보 및 토큰 저장, 실패 시 에러 throw)
- **예외 처리**: 필수값 미입력 또는 정보 불일치 시 적절한 에러 메시지 반환

### `logout()`
저장된 토큰을 파기하고 세션을 종료합니다.
- **기획 ID**: F-00-3
- **Parameters**: 없음
- **Returns**: `void`
- **동작**: `localStorage` 데이터 삭제 및 로그인 페이지로 이동(`window.location.href = '/login'`)

## 2. 사용 예제

```javascript
import { authService } from '@/services/authService';

// 회원가입 컴포넌트 내
const handleRegister = async () => {
  try {
    await authService.register({
      name: '홍길동',
      email: 'hong@kb.com',
      password: 'password123'
    });
    alert('회원가입 성공!');
  } catch (error) {
    console.error('회원가입 실패:', error);
  }
};

// 로그아웃 호출
const handleLogout = () => {
  authService.logout();
};