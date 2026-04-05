# KB 스켈레톤 프로젝트 - 가계부

# 프로젝트 개요

- [프로젝트 개요 및 설명](./docs/Overview.md)

# 프로젝트 셋팅

```shell
1. git pull ${git repository 주소}
2. npm install 하여 패키지 설치
```

## 패키지 목록

- axios: API 비동기 호출
- pinia: 전역 상태관리
- tailwind
- json-server
- json-server-auth: 인증/인가 구현
- concurrently: front서버와 json서버를 동시에 실행가능

# 실행방법

프론트&json 서버 동시 실행

```shell
npm run dev

```

프론트 서버만 실행

```shell
vite

```

json 서버만 실행

```shell
json-server db.json --port 3000

```

# 협업 규칙

**< 브랜치 전략 >**

```
main
⌞ dev
⌞ feature-기능명/
⌞ hotfix-버그명/
```

**<커밋 규칙>**

- `feat`: 기능명
- `fix`: 버그수정
- `style`: UI수정
- `core`: 코어 기능
- `refactor`: 코드 리팩토링
- `docs`: 문서 관련 작업
