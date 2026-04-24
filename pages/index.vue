<template>
  <div>
    <!-- Hero -->
    <section class="bg-white">
      <div class="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            전자서명, <span class="text-blue-600">쉽고 빠르게</span>
          </h1>
          <p class="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            계약서 업로드부터 서명 완료까지 3분. 모든 서명 이력을 한눈에.
          </p>
          <div class="mt-10 flex justify-center gap-4">
            <NuxtLink
              to="/auth/register"
              class="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              무료로 시작하기
            </NuxtLink>
            <NuxtLink
              to="/my"
              class="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
            >
              내 서명 조회
            </NuxtLink>
          </div>
          <p class="mt-4 text-sm text-gray-400">
            월 5건 무료 | 신용카드 불필요
          </p>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="bg-gray-50 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">왜 Pactery인가?</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-xl shadow-sm">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span class="text-2xl">&#x1F50D;</span>
            </div>
            <h3 class="text-lg font-semibold mb-2">3초 검색</h3>
            <p class="text-gray-500">모든 계약서를 제목, 서명자, 사건번호로 즉시 검색. 더 이상 헤매지 마세요.</p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-sm">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span class="text-2xl">&#x1F512;</span>
            </div>
            <h3 class="text-lg font-semibold mb-2">법적 효력</h3>
            <p class="text-gray-500">PKI 디지털 서명, SHA-256 해시, 감사추적인증서로 위변조 불가.</p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-sm">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span class="text-2xl">&#x1F465;</span>
            </div>
            <h3 class="text-lg font-semibold mb-2">팀 협업</h3>
            <p class="text-gray-500">회사 단위 문서함. 팀원별 역할/권한 관리. 누가 뭘 보냈는지 한눈에.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section class="bg-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">합리적인 가격</h2>
        <div class="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div class="border rounded-xl p-6">
            <h3 class="font-semibold text-lg">Free</h3>
            <p class="text-3xl font-bold mt-2">0<span class="text-base font-normal text-gray-500">원/월</span></p>
            <ul class="mt-4 space-y-2 text-sm text-gray-600">
              <li>월 5건</li>
              <li>1인</li>
              <li>템플릿 3개</li>
            </ul>
          </div>
          <div class="border-2 border-blue-600 rounded-xl p-6 relative">
            <span class="absolute -top-3 left-4 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">인기</span>
            <h3 class="font-semibold text-lg">Pro</h3>
            <p class="text-3xl font-bold mt-2">19,900<span class="text-base font-normal text-gray-500">원/월</span></p>
            <ul class="mt-4 space-y-2 text-sm text-gray-600">
              <li>월 50건</li>
              <li>팀원 3명</li>
              <li>무제한 템플릿</li>
              <li>사건관리 + AI</li>
            </ul>
          </div>
          <div class="border rounded-xl p-6">
            <h3 class="font-semibold text-lg">Business</h3>
            <p class="text-3xl font-bold mt-2">49,900<span class="text-base font-normal text-gray-500">원/월</span></p>
            <ul class="mt-4 space-y-2 text-sm text-gray-600">
              <li>월 200건</li>
              <li>팀원 10명</li>
              <li>대량전송 + API</li>
              <li>브랜딩</li>
            </ul>
          </div>
          <div class="border rounded-xl p-6">
            <h3 class="font-semibold text-lg">Enterprise</h3>
            <p class="text-3xl font-bold mt-2">별도<span class="text-base font-normal text-gray-500"> 상담</span></p>
            <ul class="mt-4 space-y-2 text-sm text-gray-600">
              <li>무제한</li>
              <li>팀원 무제한</li>
              <li>전용 지원</li>
              <li>SLA</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-lg font-semibold text-white mb-2">Pactery</p>
        <p class="text-sm">pactery.com | 전자서명법 준수 | 개인정보보호</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Pactery - 전자서명, 쉽고 빠르게' })
</script>
