# Project Notes - Cluster LMS

## 프로젝트 정보
- **프로젝트명**: Cluster LMS (Enuma Admin 기능 추가 개발)
- **스펙 버전**: v2.1 (2026.04.02 작성, 양세진)
- **기반 문서**: [ES] 클러스터 LMS 개발_v2.0.pptx, ES_LMS_ClusterDashboard_Spec
- **데모 URL**: https://enuma-lms-demo.petarainsoft.com/
- **Figma**: https://www.figma.com/design/47inqKjqYR5z8OfZI4WVyP/Cluster-Dashboard

## 현재 구현 상태 (2026.04.03)

### 구현 완료
| 페이지 | URL | 상태 |
|--------|-----|------|
| Login | `/login` | ✅ 완료 |
| Cluster List | `/enuma-admin/clusters` | ✅ 완료 |
| Account Management | `/enuma-admin/accounts` | ✅ 완료 |
| Downloads | `/enuma-admin/downloads` | ⬜ Placeholder만 |

### 미구현 (향후 개발)
| 페이지 | URL | 비고 |
|--------|-----|------|
| 기관용 Student Dashboard | `/institutions/:id/student-dashboard` | 기존 Cluster Dashboard 재사용 + 클러스터 드롭다운 추가 |
| 기관용 School Dashboard | `/institutions/:id/school-dashboard` | 기관 소속 전체 클러스터 통합 표시 |
| 기관용 Digital Assessment | `/institutions/:id/digital-assessment` | Cluster Name 칼럼 추가 |
| 클러스터용 대시보드 | `/clusters/:id/*` | 기존 Cluster Admin 화면 재사용 |
| Global Downloads | `/enuma-admin/downloads` | Source 칼럼 추가, 전체 다운로드 내역 |
| Data Request 모달 | 각 대시보드 페이지 | Set Data Period 모달 |

## 권한 체계
| 권한 | 대상 | 접근 범위 | 상반기 구현 |
|------|------|-----------|------------|
| Enuma Admin | 에누마 내부 인원 | 전체 기관/클러스터 통합 조회 | ✅ |
| Super Admin | 기관 관리자 | 소속 기관 내 전체 클러스터 조회 | ❌ (하반기) |
| Cluster Admin | 클러스터 관리자 | 소속 클러스터만 조회 | 기존 유지 |

## 주요 기술 결정 사항

### 1. Mock API vs 실제 백엔드
현재 `mock/server.js`로 동작. 실제 백엔드 연동 시:
- `src/api/client.ts`의 baseURL 변경
- Vite proxy 설정 업데이트 (`vite.config.ts`)
- JWT 토큰 검증 로직은 백엔드에서 처리

### 2. 클라이언트 사이드 vs 서버 사이드 정렬/필터
현재: 클라이언트 사이드 (전체 데이터 한 번에 fetch 후 프론트에서 처리)
- 데이터 규모: 기관 42개, 클러스터 97개, 학교 수백 개 수준
- 데이터 양이 크게 늘면 서버 사이드 페이지네이션으로 전환 필요

### 3. 비밀번호 정책
- Q1 임시: 4자리 대문자+숫자 자동 생성 (예: DJ3S)
- Mock 서버에서는 평문 저장, 실제 백엔드에서는 bcrypt 해시 저장 필요
- 하반기 Admin Console 이관 시 비밀번호 리셋, 변경 기능 보완

### 4. i18n
- 4개 언어: English, Bahasa Melayu, Bahasa Indonesia, Español
- 언어 선택은 localStorage에 저장 (`cluster-lms-lang`)
- 다음 로그인 시에도 유지

## 데이터 업데이트 규칙
- 모든 데이터는 매일 **UTC 00:00**에 업데이트
- 학생이 Device를 Sync하지 않으면 데이터 미표시
- 기간별 상세 데이터는 Data Request → 다운로드로만 확인

## 인프라
- **Q2까지**: PetaRain 서버 사용
- **에누마 live 서버**: 별도 논의 필요

## 테스트 현황
- ❌ 테스트 프레임워크 미설치 (Vitest, Jest 등 없음)
- ❌ 단위 테스트 없음
- ❌ TDD 아님
- 수동 테스트로 검증 완료 (Login, Cluster List 필터/정렬/페이지네이션, Account CRUD)

### 테스트 도입 시 권장 사항
1. **Vitest** 설치 (Vite 기반이라 호환성 최적)
2. 우선 테스트 대상:
   - `useSort` hook (정렬 로직)
   - `usePagination` hook (페이지네이션 로직)
   - `AuthContext` (로그인/로그아웃 상태 관리)
   - Mock API 응답 기반 컴포넌트 테스트
3. React Testing Library로 컴포넌트 테스트
4. Playwright/Cypress로 E2E 테스트 (로그인 → Cluster List → Account 전체 플로우)
