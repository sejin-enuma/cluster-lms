# Cluster LMS

## Project Overview
Enuma School Cluster LMS - 에누마 내부 관리자(Enuma Admin)가 전체 기관/클러스터/학교 데이터를 통합 조회하고 계정을 관리하는 웹 애플리케이션.

## Tech Stack
- **Frontend**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 (CSS-based `@theme` tokens, NOT `tailwind.config.ts`)
- **Routing**: React Router v7
- **HTTP**: Axios with auth interceptor
- **i18n**: react-i18next (4 languages: en, ms, id, es)
- **Mock API**: Custom Node.js HTTP server (`mock/server.js`, port 3001)

## Commands
```bash
npm run dev      # Start Vite dev server (port 5173)
npm run mock     # Start mock API server (port 3001)
npm run build    # TypeScript check + Vite build
npm run lint     # ESLint
```
**Both `dev` and `mock` must run simultaneously** for the app to work.

## Project Structure
```
src/
├── api/client.ts              # Axios instance, auth interceptor
├── contexts/AuthContext.tsx    # Auth state, login/logout, localStorage persistence
├── components/
│   ├── layout/                # AppLayout, GNB, LNB, Footer
│   └── ui/                    # DataTable, Pagination, SearchDropdown, Modal, RowPerPage
├── pages/                     # LoginPage, ClusterListPage, AccountManagementPage
├── hooks/                     # useSort, usePagination
├── i18n/                      # i18next config + locales/{en,ms,id,es}.json
├── types/index.ts             # Shared TypeScript types
└── index.css                  # Tailwind @theme design tokens
mock/
├── db.json                    # Mock data (users, institutions, clusters, schools, accounts)
└── server.js                  # Custom HTTP mock server
```

## Design Tokens (from Figma)
Colors are defined as Tailwind `@theme` variables in `src/index.css`:
- `primary-green` (#36A4B0) - GNB background
- `primary-red` (#BD4233) - Active menu, accent text
- `vivid-red` (#D52417) - Action buttons (Login, Create, Delete)
- `bg` (#E9ECEF) - Page background
- `list` (#FAFAFB) - Table header background
- `line` (#ECEEF0) - Table borders
- Font: Noto Sans (400, 500, 600)

## Architecture Decisions
- **Single codebase with URL-based context switching**: `/enuma-admin/*` for admin home, `/institutions/:id/*` and `/clusters/:id/*` for data views (future)
- **Client-side filtering/sorting**: All data fetched once, filtered and sorted in the browser (appropriate for current data volume: ~100 schools)
- **Auth**: Token stored in localStorage, JWT-like base64 token from mock server
- **Soft delete**: Account deletion marks `deleted: true` in DB, doesn't destroy data
- **Cascading dropdowns**: Institution → Cluster → School filters reset children when parent changes

## Routes
| Path | Page | Access |
|------|------|--------|
| `/login` | Login (standalone, no layout) | Public |
| `/enuma-admin/clusters` | Cluster List | Enuma Admin |
| `/enuma-admin/accounts` | Account Management | Enuma Admin |
| `/enuma-admin/downloads` | Downloads (placeholder) | Enuma Admin |

## Mock API Endpoints
- `POST /api/auth/login` - Login (credentials in `mock/db.json`)
- `GET /api/enuma-admin/clusters` - All schools data
- `GET /api/enuma-admin/institutions` - Institution list
- `GET /api/enuma-admin/clusters-list` - Cluster list for dropdowns
- `GET /api/enuma-admin/accounts` - Active accounts
- `POST /api/enuma-admin/accounts` - Create account (auto-generated password)
- `DELETE /api/enuma-admin/accounts/:id` - Soft delete account

## Spec Documents
- `ES_LMS_ClusterLMS_Spec.pdf` - Original v1.0 specification
- `ES_LMS_ClusterLMS_Spec_v2.1.docx` - Current integrated spec (2026.04.02)

## Conventions
- Component files use PascalCase: `ClusterListPage.tsx`
- All i18n keys are namespaced: `login.title`, `clusterList.allInstitutions`, etc.
- UI components are generic/reusable; page-specific logic stays in page files
- No test framework is configured yet (not TDD)
