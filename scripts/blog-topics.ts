/**
 * 블로그 자동 생성을 위한 토픽 풀
 * 매일 이 풀에서 아직 생성되지 않은 토픽을 선택하여 새 글을 생성합니다.
 *
 * 사용법:
 *   npx tsx scripts/generate-blog.ts        # 새 글 1개 생성
 *   npx tsx scripts/generate-blog.ts --count 3  # 새 글 3개 생성
 *   npx tsx scripts/enhance-blog.ts         # 기존 글 3개 고도화
 */

export interface TopicSeed {
  slug: string
  title: string
  description: string
  category: 'guide' | 'comparison' | 'legal' | 'tips'
  tags: string[]
  readTime: number
  outline: string[] // 섹션 h2 제목들
}

export const topicPool: TopicSeed[] = [
  // ─── 산업별 시리즈 ─────────────────────────
  {
    slug: 'logistics-esignature',
    title: '물류·운송업 전자서명 도입 가이드',
    description: '물류·운송업에서 전자서명을 활용하는 방법을 안내합니다. 운송계약, 화물인수증, 배송확인서 등 실무 문서 전자화 전략을 제시합니다.',
    category: 'tips',
    tags: ['물류', '운송', '전자서명', '운송계약'],
    readTime: 8,
    outline: ['물류업의 서류 문제', '전자서명이 필요한 문서 유형', '운송계약 전자서명 절차', '배송확인서 전자 수령', 'Pactery로 물류 문서 관리하기'],
  },
  {
    slug: 'manufacturing-esignature',
    title: '제조업 계약서 전자서명 활용법',
    description: '제조업에서 발생하는 공급계약, 품질보증서, 안전서약서 등을 전자서명으로 관리하는 방법을 설명합니다.',
    category: 'tips',
    tags: ['제조업', '전자서명', '공급계약', '품질보증'],
    readTime: 7,
    outline: ['제조업 계약서의 특수성', '품질보증서와 검수확인서', '하청/외주 계약 관리', '안전서약서 전자서명', 'Pactery 활용 사례'],
  },
  {
    slug: 'retail-esignature',
    title: '유통·리테일 전자서명 활용법',
    description: '유통업에서 납품계약, 판매대행계약, 입점계약 등을 전자서명으로 처리하는 방법과 대량전송 활용법을 안내합니다.',
    category: 'tips',
    tags: ['유통', '리테일', '전자서명', '납품계약'],
    readTime: 7,
    outline: ['유통업 계약의 특성', '납품계약 전자서명', '입점계약 관리', '대량전송으로 다수 거래처 관리', '시즌 계약 자동화'],
  },
  {
    slug: 'nonprofit-esignature',
    title: '비영리단체·협회 전자서명 도입 가이드',
    description: '비영리단체와 협회에서 서면결의, 회원동의서, 후원약정서 등을 전자서명으로 처리하는 방법을 안내합니다.',
    category: 'tips',
    tags: ['비영리', '협회', '전자서명', '서면결의'],
    readTime: 7,
    outline: ['비영리단체의 서명 업무', '서면결의 전자서명', '회원동의서 대량 발송', '후원약정서 관리', '무료 플랜 활용법'],
  },
  {
    slug: 'government-esignature',
    title: '공공기관 전자서명 도입 가이드',
    description: '공공기관에서 전자서명을 도입할 때 고려해야 할 보안 인증, 조달 절차, 클라우드 보안인증(CSAP) 요건을 정리합니다.',
    category: 'guide',
    tags: ['공공기관', '전자서명', 'CSAP', '조달'],
    readTime: 10,
    outline: ['공공기관 전자서명 현황', 'CSAP 인증 요건', '전자정부법과 전자서명', '도입 절차와 조달', '보안 요구사항'],
  },

  // ─── 문서 유형 시리즈 ─────────────────────────
  {
    slug: 'shareholder-agreement-esignature',
    title: '주주간계약서 전자서명 가이드',
    description: '주주간계약(SHA)의 전자서명 방법과 법적 요건을 안내합니다. 투자 라운드별 주의사항과 다자 서명 처리법을 설명합니다.',
    category: 'guide',
    tags: ['주주간계약', '전자서명', '투자', 'SHA'],
    readTime: 9,
    outline: ['주주간계약이란', '전자서명 가능 여부', '다자간 서명 순서 설정', '투자 라운드별 주의사항', 'Pactery로 주주간계약 관리'],
  },
  {
    slug: 'memorandum-of-understanding-esignature',
    title: 'MOU(양해각서) 전자서명 방법과 법적 효력',
    description: 'MOU의 법적 성격과 전자서명 방법을 안내합니다. 구속력 여부, 필수 조항, 전자서명 시 주의사항을 정리합니다.',
    category: 'guide',
    tags: ['MOU', '양해각서', '전자서명', '협약'],
    readTime: 7,
    outline: ['MOU란 무엇인가', '법적 구속력 여부', 'MOU 필수 조항', '전자서명 MOU의 효력', '실무 작성 팁'],
  },
  {
    slug: 'guarantee-letter-esignature',
    title: '보증서·각서 전자서명 가이드',
    description: '보증서와 각서를 전자서명으로 작성하는 방법을 안내합니다. 법적 효력 요건과 분쟁 예방 팁을 포함합니다.',
    category: 'guide',
    tags: ['보증서', '각서', '전자서명', '서약'],
    readTime: 7,
    outline: ['보증서와 각서의 차이', '전자서명 보증서의 법적 효력', '작성 시 필수 항목', '분쟁 예방을 위한 감사추적', '실무 활용 사례'],
  },

  // ─── 실무 심화 ─────────────────────────
  {
    slug: 'esignature-onboarding-checklist',
    title: '전자서명 서비스 온보딩 체크리스트',
    description: '전자서명 서비스를 처음 도입할 때 팀이 따라야 할 온보딩 체크리스트 15가지를 안내합니다.',
    category: 'tips',
    tags: ['온보딩', '전자서명', '도입', '체크리스트'],
    readTime: 8,
    outline: ['관리자 설정', '팀원 초대와 역할 부여', '템플릿 등록', '브랜딩 설정', '테스트 서명', '운영 모범사례'],
  },
  {
    slug: 'esignature-cost-reduction',
    title: '전자서명으로 연간 비용 절감하는 방법',
    description: '전자서명 도입 시 절감되는 직접비용과 간접비용을 항목별로 분석하고, 실제 비용 절감 사례를 제시합니다.',
    category: 'tips',
    tags: ['비용절감', '전자서명', 'ROI', '효율화'],
    readTime: 8,
    outline: ['직접 비용 절감 (인쇄, 우편, 보관)', '간접 비용 절감 (시간, 인건비)', '규모별 절감 예시', '비용 대비 전자서명 서비스 가격', 'Pactery 요금제 안내'],
  },
  {
    slug: 'esignature-compliance-checklist',
    title: '전자서명 컴플라이언스 체크리스트 2026',
    description: '2026년 기준으로 전자서명 서비스가 준수해야 할 법적 요건과 보안 기준을 체크리스트로 정리합니다.',
    category: 'legal',
    tags: ['컴플라이언스', '전자서명', '보안', '법적요건'],
    readTime: 9,
    outline: ['전자서명법 준수 체크', '개인정보보호법 체크', '보안 인증 체크', '감사추적 요건', '보관 기간 준수'],
  },
  {
    slug: 'esignature-migration-guide',
    title: '전자서명 서비스 마이그레이션 가이드',
    description: '기존 전자서명 서비스에서 Pactery로 전환하는 방법을 단계별로 안내합니다. 데이터 이전, 팀 온보딩, 병행 운영 전략을 설명합니다.',
    category: 'guide',
    tags: ['마이그레이션', '전자서명', '전환', '데이터이전'],
    readTime: 8,
    outline: ['마이그레이션 전 준비사항', '기존 문서 백업', '병행 운영 기간', '팀 온보딩', '완전 전환'],
  },

  // ─── 시즌/이벤트 시리즈 ─────────────────────────
  {
    slug: 'annual-salary-contract-esignature',
    title: '연봉계약서 전자서명 — 연초 대량발송 가이드',
    description: '연초 연봉계약 시즌에 수백 장의 연봉계약서를 전자서명으로 하루 만에 처리하는 방법을 안내합니다.',
    category: 'tips',
    tags: ['연봉계약', '전자서명', 'HR', '대량발송'],
    readTime: 7,
    outline: ['연봉계약 시즌의 고충', '대량발송으로 일괄 처리', '서명 현황 실시간 모니터링', '미서명자 리마인더', '완료 후 자동 보관'],
  },
  {
    slug: 'tax-season-esignature',
    title: '종합소득세 시즌 전자서명 활용법',
    description: '5월 종합소득세 시즌에 세무대리 수임계약서를 전자서명으로 효율적으로 관리하는 방법을 안내합니다.',
    category: 'tips',
    tags: ['종합소득세', '전자서명', '세무', '수임계약'],
    readTime: 7,
    outline: ['종합소득세 시즌 업무 폭증', '수임계약서 일괄 발송', '의뢰인별 서명 현황 관리', '완료 문서 자동 분류', '세무사무소 Pactery 활용 사례'],
  },
  {
    slug: 'corporate-tax-season-esignature',
    title: '법인세 신고 시즌 전자서명 가이드',
    description: '3월 법인세 신고 시즌에 감사계약, 세무조정계약 등을 전자서명으로 처리하는 방법을 안내합니다.',
    category: 'tips',
    tags: ['법인세', '전자서명', '감사계약', '세무조정'],
    readTime: 7,
    outline: ['법인세 시즌 주요 계약 문서', '감사계약서 전자서명', '세무조정계약서 관리', '대량 발송과 추적', '시즌 후 문서 보관'],
  },

  // ─── 기술 심화 ─────────────────────────
  {
    slug: 'pki-explained-simply',
    title: 'PKI 공개키 인프라 쉽게 이해하기',
    description: 'PKI(공개키 인프라)의 작동 원리를 비전공자도 이해할 수 있도록 쉽게 설명합니다. 전자서명과의 관계도 정리합니다.',
    category: 'guide',
    tags: ['PKI', '공개키', '전자서명', '암호화'],
    readTime: 10,
    outline: ['PKI란?', '공개키와 개인키', '인증기관(CA)의 역할', '디지털 인증서', 'PKI와 전자서명의 관계'],
  },
  {
    slug: 'timestamp-authority-esignature',
    title: '타임스탬프 인증과 전자서명',
    description: '전자서명에서 타임스탬프의 역할과 중요성을 설명합니다. 서명 시점 증명, 문서 무결성 보장, 장기 보존 방법을 안내합니다.',
    category: 'guide',
    tags: ['타임스탬프', '전자서명', 'TSA', '시점인증'],
    readTime: 8,
    outline: ['타임스탬프란', '왜 시점 증명이 중요한가', 'TSA의 역할', '장기 보존과 타임스탬프', 'Pactery의 타임스탬프 지원'],
  },
  {
    slug: 'hash-algorithm-esignature',
    title: 'SHA-256과 전자서명 — 해시 알고리즘의 역할',
    description: '전자서명에서 사용되는 SHA-256 해시 알고리즘의 역할을 쉽게 설명합니다. 문서 위변조 방지 원리를 이해합니다.',
    category: 'guide',
    tags: ['SHA-256', '해시', '전자서명', '보안'],
    readTime: 9,
    outline: ['해시 알고리즘이란', 'SHA-256의 특성', '전자서명에서 해시의 역할', '위변조 탐지 원리', '실무에서 확인하는 방법'],
  },

  // ─── 고객 관점 ─────────────────────────
  {
    slug: 'client-signing-experience',
    title: '의뢰인 서명 경험 최적화 가이드',
    description: '서명을 받는 의뢰인(서명자)의 관점에서 최적의 서명 경험을 설계하는 방법을 안내합니다.',
    category: 'tips',
    tags: ['서명경험', 'UX', '의뢰인', '서명자'],
    readTime: 7,
    outline: ['서명자 경험이 중요한 이유', '서명 요청 이메일 최적화', '모바일 서명 경험', '서명 완료 후 자동 교부', '브랜딩으로 신뢰도 향상'],
  },
  {
    slug: 'esignature-accessibility',
    title: '전자서명 접근성 가이드 — 모든 사용자를 위한 설계',
    description: '디지털 취약계층도 쉽게 서명할 수 있도록 전자서명 접근성을 높이는 방법을 안내합니다.',
    category: 'guide',
    tags: ['접근성', '전자서명', 'UX', '디지털격차'],
    readTime: 8,
    outline: ['전자서명 접근성이란', '고령자를 위한 서명 UX', '모바일 최적화', '대면서명 활용', '안내 문구 최적화'],
  },
]
