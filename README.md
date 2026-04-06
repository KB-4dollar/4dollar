# KB 스켈레톤 프로젝트 - 가계부

# 목차

- [1. 프로젝트 소개](#1-프로젝트-소개)
- [2. 팀원 구성](#2-팀원-구성)
- [3. 기술 스택](#3-기술-스택)
- [4. 주요 기능](#4-주요-기능)
- [5. 화면 설계](#5-화면-설계)
- [6. 컴포넌트 설계](#6-컴포넌트-설계)
- [7. 구현 결과 화면](#7-구현-결과-화면)
- [8. 프로젝트 후기](#8-프로젝트-후기)
- [프로젝트 셋팅](#프로젝트-셋팅)
- [실행방법](#실행방법)

## 1. 프로젝트 소개

> 수입과 지출을 기록하고 월별 재정을 한눈에 확인할 수 있는 가계부 서비스

- **기간:** 2026.04.07 ~ 2026.04.13 (5일)
- **배포 링크:** <!-- TODO: GitHub Pages 링크 -->

<!-- TODO: 아키텍쳐(프로젝트 구조, CI/CD) 내용 추가-->

## 2. 팀원 구성

<!-- TODO: 팀원 정보 채우기 -->

| 이름  | 역할 | 담당 기능 |
| ----- | ---- | --------- |
| 이름1 | 팀장 | -         |
| 이름2 | 팀원 | -         |
| 이름3 | 팀원 | -         |
| 이름4 | 팀원 | -         |

## 3. 기술 스택

![Vue.js](https://img.shields.io/badge/Vue_3-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Vue Router](https://img.shields.io/badge/Vue_Router-35495E?style=for-the-badge&logo=vuedotjs&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-FFD859?style=for-the-badge&logoColor=black)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![shadcn-vue](https://img.shields.io/badge/shadcn--vue-000000?style=for-the-badge&logoColor=white)
![json-server](https://img.shields.io/badge/json--server-gray?style=for-the-badge&logo=json&logoColor=white)

## 4. 주요 기능

<!-- TODO: 구현한 기능 목록 채우기 -->

| 기능           | 설명                                    |
| -------------- | --------------------------------------- |
| 수입/지출 등록 | 날짜, 금액, 카테고리, 메모 입력 후 저장 |
| 거래 내역 조회 | 전체 내역 목록 확인                     |
| 필터링         | 날짜, 카테고리, 수입/지출 유형별 필터   |
| 월별 요약      | 총 수입, 총 지출, 순이익 요약 표시      |

## 5. 화면 설계

<!-- TODO: 와이어프레임 또는 스토리보드 이미지 삽입 -->

## 6. 컴포넌트 설계

<!-- TODO: 컴포넌트 트리 또는 다이어그램 삽입 -->

## 7. 구현 결과 화면

<!-- TODO: 완성된 화면 스크린샷 삽입 -->
<!-- 예시: ![대시보드](./docs/attach/screenshot_dashboard.png) -->

## 8. 프로젝트 후기

<!-- TODO: 팀원별 후기 채우기 -->

| 이름  | 후기 |
| ----- | ---- |
| 이름1 | -    |
| 이름2 | -    |
| 이름3 | -    |
| 이름4 | -    |

---

---

## 프로젝트 셋팅

로컬 개발 환경 설정

1. 레포지토리 클론

```bash
git clone https://github.com/KB-4dollar/4dollar.git
cd 4dollar
git checkout dev
```

2. 패키지 설치

```bash
npm install
```

3. 환경변수 설정
   프로젝트 루트에 .env.dev 파일 생성 후 아래 내용 입력 (API URL은 따로 받기)
   `VITE_API_URL=여기에*받은*URL*입력`
4. 개발 서버 실행

```bash
   npm run dev
```

5. 배포
   - dev 브랜치에 push하면 자동으로 배포(dev: https://KB-4dollar.github.io/4dollar)

## 실행방법

프론트엔드와 json-server 동시 실행

```shell
npm run dev
```

프론트엔드만 실행

```shell
npm run dev:web
```

json-server만 실행

```shell
npm run db
```

배포 환경(Railway)에서는 아래 명령으로 json-server가 실행됩니다.

```shell
npm run start
```
