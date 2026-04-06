# 📚 API 및 공통 모듈 가이드 (v1.0)

본 문서는 **[KB] IT’s Your Life 가계부 서비스** 프로젝트의 프론트엔드 개발을 위한 API 통신 및 공통 상수 규격을 정의합니다. 

## 🔗 모듈별 상세 문서 링크

각 파일명을 클릭하면 해당 모듈의 상세 사용법, 파라미터 규격, 그리고 예제 코드를 확인할 수 있습니다.

1. **[apiClient (공통 통신 설정)](./client/apiClient.md)**
   - Axios 인스턴스 기본 설정, JWT 토큰 자동 주입, 전역 에러 핸들링 (F-04-1)
2. **[authService (인증 서비스)](./services/authService.md)**
   - 회원가입, 로그인, 로그아웃 등 인증 관련 기능 (F-00)
3. **[transactionService (거래 내역 서비스)](./services/transactionService.md)**
   - 수입/지출 내역 목록 조회, 필터링, 상세 조회, 등록, 수정, 삭제 (F-01, F-02, F-03)
4. **[enumConstants (공통 상수)](./constants/enumConstants.md)**
   - 카테고리, 수입/지출 구분, 필터 기간 등 하드코딩 방지를 위한 상수 집합
