export const meta = {
  slug: 'api-integration-guide',
  title: '전자서명 API 연동 가이드 – CRM·ERP와 자동화하기',
  description: '전자서명 REST API의 기본 개념부터 웹훅 활용, CRM·ERP 시스템 연동 사례까지 개발자와 비개발자 모두를 위한 전자서명 API 연동 가이드입니다.',
  category: 'guide' as const,
  publishedAt: '2026-05-03',
  author: 'Pactery 팀',
  readTime: 8,
  tags: ['API', '전자서명', '개발', '연동'],
}

export const content = `
<h2>전자서명 API가 필요한 이유</h2>
<p>수작업으로 전자서명 요청을 보내는 것은 건수가 적을 때는 괜찮지만, 비즈니스가 성장하면 병목이 됩니다. <strong>전자서명 API</strong>를 활용하면 서명 요청 생성·발송·완료 처리를 기존 시스템과 완전히 통합하여 사람의 개입 없이 자동화할 수 있습니다.</p>
<p>다음과 같은 상황에서 API 연동이 특히 유용합니다.</p>
<ul>
  <li>CRM에서 고객 정보 입력 즉시 자동으로 계약서 발송</li>
  <li>ERP에서 구매 발주 승인 시 자동으로 계약서 생성</li>
  <li>회원가입 완료 시 자동으로 이용약관 동의서 전송</li>
  <li>HR 시스템에서 신규 입사자에게 자동으로 근로계약서 발송</li>
</ul>

<h2>REST API 기본 개념</h2>
<p>Pactery API는 표준 <strong>REST API</strong> 방식으로 설계되어 있습니다. HTTP 메서드(GET, POST, PATCH, DELETE)와 JSON 형식을 사용하며, 인증은 Bearer Token 방식입니다.</p>
<h3>인증 토큰 발급</h3>
<p>Pactery 대시보드 <strong>[설정 → API 키 관리]</strong>에서 API 키를 발급받습니다. Business 플랜(39,900원/월, 200건) 이상에서 API 접근이 가능합니다. 발급된 키는 절대 외부에 노출되어서는 안 되며, 서버 환경변수로 안전하게 관리하세요.</p>

<h3>주요 API 엔드포인트</h3>
<table>
  <thead>
    <tr><th>기능</th><th>메서드</th><th>엔드포인트</th></tr>
  </thead>
  <tbody>
    <tr><td>서명 요청 생성</td><td>POST</td><td>/v1/requests</td></tr>
    <tr><td>서명 요청 목록 조회</td><td>GET</td><td>/v1/requests</td></tr>
    <tr><td>서명 요청 상세 조회</td><td>GET</td><td>/v1/requests/{id}</td></tr>
    <tr><td>서명 요청 취소</td><td>DELETE</td><td>/v1/requests/{id}</td></tr>
    <tr><td>완료 문서 다운로드</td><td>GET</td><td>/v1/requests/{id}/document</td></tr>
    <tr><td>템플릿 목록 조회</td><td>GET</td><td>/v1/templates</td></tr>
  </tbody>
</table>

<h3>서명 요청 생성 예시</h3>
<p>다음은 Node.js에서 Pactery API로 서명 요청을 생성하는 기본 예시입니다.</p>
<pre><code>const response = await fetch('https://api.pactery.com/v1/requests', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    templateId: 'tpl_abc123',
    title: '서비스 이용 계약서',
    signers: [
      {
        name: '홍길동',
        email: 'hong@example.com',
        role: 'customer',
      }
    ],
    dueDate: '2026-05-10',
    message: '계약서 검토 후 서명 부탁드립니다.',
  }),
})
const data = await response.json()
console.log(data.requestId) // req_xyz789
</code></pre>

<h2>웹훅(Webhook) 활용하기</h2>
<p>서명 완료 여부를 알기 위해 주기적으로 API를 폴링(Polling)하는 방식은 비효율적입니다. <strong>웹훅</strong>을 설정하면 서명 이벤트가 발생할 때 Pactery가 자동으로 여러분의 서버에 HTTP POST 요청을 보냅니다.</p>

<h3>지원하는 웹훅 이벤트</h3>
<ul>
  <li><strong>request.sent</strong>: 서명 요청이 수신자에게 발송됨</li>
  <li><strong>request.viewed</strong>: 수신자가 서명 요청 링크를 열람함</li>
  <li><strong>request.signed</strong>: 수신자가 서명 완료</li>
  <li><strong>request.completed</strong>: 모든 서명자의 서명 완료 (최종 완료)</li>
  <li><strong>request.declined</strong>: 수신자가 서명 거절</li>
  <li><strong>request.expired</strong>: 서명 기한 만료</li>
</ul>

<h3>웹훅 수신 서버 예시</h3>
<pre><code>// Express.js 웹훅 수신 핸들러
app.post('/webhook/pactery', (req, res) => {
  const event = req.body

  if (event.type === 'request.completed') {
    const requestId = event.data.requestId
    // 완료 처리: DB 업데이트, 알림 발송 등
    markContractCompleted(requestId)
  }

  res.status(200).send('OK')
})
</code></pre>
<p>웹훅 보안을 위해 Pactery는 각 요청에 <strong>HMAC-SHA256 서명 헤더</strong>를 포함합니다. 수신 서버에서 반드시 이를 검증하여 위조 요청을 차단하세요.</p>

<h2>CRM 연동 사례: Salesforce</h2>
<p>Salesforce에서 거래가 "Closed Won" 상태로 전환될 때 자동으로 Pactery 계약서 서명 요청을 발송하는 흐름입니다.</p>
<ul>
  <li>Salesforce Apex 트리거 또는 Flow에서 Opportunity 상태 변경 감지</li>
  <li>고객 이름·이메일을 Pactery API로 전달하여 서명 요청 생성</li>
  <li>생성된 <code>requestId</code>를 Salesforce 레코드 필드에 저장</li>
  <li>웹훅으로 서명 완료 이벤트 수신 시 Salesforce 레코드 자동 업데이트</li>
</ul>

<h2>HR 시스템 연동 사례: 근로계약서 자동화</h2>
<p>인사 시스템에 신규 직원 정보가 등록될 때 자동으로 근로계약서 서명 요청을 발송하는 사례입니다.</p>
<ul>
  <li>HR 시스템의 온보딩 이벤트 발생 시 API 호출</li>
  <li>직원 이름, 이메일, 입사일, 부서 정보를 템플릿 변수로 전달</li>
  <li>근로계약서 자동 생성 및 이메일 발송</li>
  <li>서명 완료 시 HR 시스템과 전자결재 시스템에 자동 반영</li>
</ul>

<h2>API 연동 시 모범 사례</h2>
<ul>
  <li><strong>재시도 로직 구현</strong>: 네트워크 오류 시 지수 백오프(Exponential Backoff)로 재시도</li>
  <li><strong>API 키 순환</strong>: 90일마다 API 키를 새로 발급하여 보안 강화</li>
  <li><strong>Rate Limit 준수</strong>: Pactery API는 분당 100 요청 제한이 있으니 대량 처리 시 큐(Queue)를 사용하세요</li>
  <li><strong>오류 로깅</strong>: API 응답의 에러 코드와 메시지를 반드시 로그에 기록</li>
  <li><strong>Sandbox 환경 활용</strong>: 실서비스 적용 전에 Pactery의 테스트 환경에서 충분히 검증하세요</li>
</ul>
<p>Pactery API 연동 관련 문의는 Business 플랜(39,900원/월) 고객 지원 채널을 통해 기술 지원을 받을 수 있습니다.</p>
`
