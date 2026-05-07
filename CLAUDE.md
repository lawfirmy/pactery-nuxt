# Pactery - 전자서명 서비스

- **도메인**: pactery.com | **포트**: 4540 | **DB**: PostgreSQL 16 `pactery`
- **스택**: Nuxt 4 (Vue 3 + Nitro) + Prisma + PostgreSQL + pdf-lib + node-forge
- **패키지매니저**: pnpm (또는 npm)
- **레포**: github.com/lawfirmy/pactery

## 컨셉

변호사/법률사무소 특화 전자서명 서비스. eformsign 대체.
- **완전 독립 프로젝트** — 기존 lawfirmy 인프라에 의존하지 않는 단일 Nuxt 4 풀스택 앱
- 2가지 핵심 뷰: 서명자 포털(`/my`), 회사 문서함(`/org`)
- Organization(회사) 중심 구조 — 회사가 결제, 팀원이 사용

## 프로젝트 구조

```
app/pages/org/          # 회사 문서함 (대시보드, 문서, 사건, 의뢰인, 템플릿, 멤버, 설정)
app/pages/my/           # 서명자 포털
app/pages/sign/[token]  # 서명 수행 (비회원)
app/pages/auth/         # 로그인/회원가입
app/components/         # PDF 뷰어, 서명패드 등
app/composables/        # useAuth, useOrganization, usePdf
app/layouts/            # default, auth, sign
server/api/auth/        # 인증 (JWT, Google/Kakao OAuth)
server/api/organizations/  # 조직 CRUD, 멤버, RBAC
server/api/signatures/  # 서명 수행 (비회원 public 접근)
server/api/my/          # 서명자 포털 API
server/utils/           # db, jwt, crypto, rbac, audit, storage, pdf
```

## 코딩 규칙

1. TypeScript strict
2. Zod로 API 입력 검증
3. RBAC: requireOrgRole()로 역할 기반 접근 제어
4. 감사추적: 문서 관련 모든 액션에 createAuditLog()
5. 모바일 퍼스트 (Tailwind responsive)

## 배포

- CI/CD: `.github/workflows/deploy.yml` → GHCR → EC2
- 이미지: `ghcr.io/lawfirmy/pactery:latest`
- EC2 env-file: `/home/ec2-user/servers/pactery/.env`

## 환경변수 주의사항

**NUXT_ 접두사 필수 (프로덕션)**: `nuxt.config.ts`의 `runtimeConfig`는 빌드타임에 `process.env.*`를 평가.
Docker 빌드 시 없는 변수는 빈값으로 bake됨. 런타임에서 오버라이드하려면 반드시 `NUXT_` 접두사 사용.
- `resendApiKey` → `NUXT_RESEND_API_KEY`
- `s3Bucket` → `NUXT_S3_BUCKET`
- `public.appUrl` → `NUXT_PUBLIC_APP_URL`
- 로컬 개발에서는 접두사 없이도 작동 (`nuxt dev`가 실시간 평가)
