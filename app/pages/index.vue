<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden bg-brand-900">
      <div class="absolute inset-0 bg-gradient-to-b from-brand-950/50 to-transparent"></div>
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-700/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
      <div class="relative max-w-7xl mx-auto px-4 py-20 sm:py-28 lg:py-36 sm:px-6 lg:px-8">
        <div class="text-center max-w-4xl mx-auto">
          <div v-if="hero.badge" class="mb-6 inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
            <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span class="text-sm text-brand-200 font-medium">{{ hero.badge }}</span>
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            {{ heroHeadlineParts.prefix
            }}<span class="text-brand-200">{{ heroHeadlineParts.highlight }}</span>{{ heroHeadlineParts.suffix }}
          </h1>
          <p class="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-brand-200/80 leading-relaxed">
            {{ hero.subtext }}
          </p>
          <div class="mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <NuxtLink
              to="/auth/register"
              class="px-8 py-3.5 bg-white text-brand-900 font-semibold rounded-xl hover:bg-brand-50 transition shadow-lg shadow-white/10"
              @click="recordClick"
            >
              {{ hero.cta }}
            </NuxtLink>
            <NuxtLink
              to="/my"
              class="px-8 py-3.5 border border-white/20 text-white font-medium rounded-xl hover:bg-white/10 backdrop-blur-sm transition"
            >
              내 서명 조회
            </NuxtLink>
          </div>
          <p class="mt-6 text-sm text-brand-300/60">
            월 5건 무료 &middot; 신용카드 불필요 &middot; 30초 만에 시작
          </p>
        </div>
      </div>
    </section>

    <!-- Event Banner -->
    <section class="bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 py-4 sm:py-5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-white">
          <div class="flex items-center gap-3">
            <span class="hidden sm:inline-flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full text-lg shrink-0">
              &#127881;
            </span>
            <div class="text-center sm:text-left">
              <p class="font-bold text-base sm:text-lg leading-tight">
                <span class="sm:hidden">&#127881; </span>오픈 기념 이벤트! 전자서명 10건 무료
              </p>
              <p class="text-sm text-white/80 mt-0.5">이벤트 기간 중 가입하시면 모든 사용자에게 전자서명 10건을 무료로 드립니다</p>
            </div>
          </div>
          <NuxtLink
            to="/auth/register"
            class="shrink-0 px-6 py-2.5 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition shadow-lg shadow-orange-700/20 text-sm"
          >
            무료로 시작하기
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Trust Bar -->
    <section class="bg-white border-b border-gray-100 py-8">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap justify-center items-center gap-6 sm:gap-10 text-gray-400">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
            <span class="text-sm font-medium">전자서명법 준수</span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
            <span class="text-sm font-medium">SHA-256 암호화</span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
            <span class="text-sm font-medium">감사추적인증서</span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>
            <span class="text-sm font-medium">모바일 서명</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="bg-white py-20 sm:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <p class="text-sm font-semibold text-brand-700 uppercase tracking-wider mb-3">Features</p>
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900">왜 Pactery인가?</h2>
          <p class="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">변호사와 법률사무소를 위해 설계된 전자서명 솔루션</p>
        </div>
        <div class="grid md:grid-cols-3 gap-6 lg:gap-8">
          <div class="group bg-gray-50 hover:bg-brand-50 p-8 rounded-2xl transition-colors duration-200">
            <div class="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-brand-200 transition-colors">
              <svg class="w-6 h-6 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">3초 검색</h3>
            <p class="text-gray-500 leading-relaxed">모든 계약서를 제목, 서명자, 사건번호로 즉시 검색. 더 이상 헤매지 마세요.</p>
          </div>
          <div class="group bg-gray-50 hover:bg-green-50 p-8 rounded-2xl transition-colors duration-200">
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-green-200 transition-colors">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">법적 효력</h3>
            <p class="text-gray-500 leading-relaxed">PKI 디지털 서명, SHA-256 해시, 감사추적인증서로 위변조 불가.</p>
          </div>
          <div class="group bg-gray-50 hover:bg-purple-50 p-8 rounded-2xl transition-colors duration-200">
            <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-purple-200 transition-colors">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">팀 협업</h3>
            <p class="text-gray-500 leading-relaxed">회사 단위 문서함. 팀원별 역할/권한 관리. 누가 뭘 보냈는지 한눈에.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="bg-gray-50 py-20 sm:py-24">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <p class="text-sm font-semibold text-brand-700 uppercase tracking-wider mb-3">How it works</p>
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900">3분이면 서명 완료</h2>
        </div>
        <div class="grid sm:grid-cols-3 gap-8 sm:gap-12">
          <div class="text-center">
            <div class="w-14 h-14 bg-brand-800 text-white rounded-2xl flex items-center justify-center mx-auto mb-5 text-xl font-bold shadow-lg shadow-brand-800/30">1</div>
            <h3 class="font-semibold text-gray-900 mb-2">문서 업로드</h3>
            <p class="text-sm text-gray-500">PDF를 업로드하고 서명 위치를 지정하세요.</p>
          </div>
          <div class="text-center">
            <div class="w-14 h-14 bg-brand-800 text-white rounded-2xl flex items-center justify-center mx-auto mb-5 text-xl font-bold shadow-lg shadow-brand-800/30">2</div>
            <h3 class="font-semibold text-gray-900 mb-2">서명자 초대</h3>
            <p class="text-sm text-gray-500">이메일 또는 카카오톡으로 서명 요청을 보내세요.</p>
          </div>
          <div class="text-center">
            <div class="w-14 h-14 bg-brand-800 text-white rounded-2xl flex items-center justify-center mx-auto mb-5 text-xl font-bold shadow-lg shadow-brand-800/30">3</div>
            <h3 class="font-semibold text-gray-900 mb-2">서명 완료</h3>
            <p class="text-sm text-gray-500">감사추적인증서와 함께 서명 완료된 문서를 받으세요.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section class="bg-white py-20 sm:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <p class="text-sm font-semibold text-brand-700 uppercase tracking-wider mb-3">Pricing</p>
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900">업계 최저가, 기능은 최고</h2>
          <p class="mt-4 text-lg text-gray-500">타사 대비 최대 80% 저렴합니다. 추가 건당 990원.</p>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <!-- Free -->
          <div class="bg-white border border-gray-200 rounded-2xl p-7 hover:shadow-lg transition-shadow duration-200">
            <h3 class="font-semibold text-lg text-gray-900">Free</h3>
            <p class="text-4xl font-bold mt-3">0<span class="text-base font-normal text-gray-400">원/월</span></p>
            <ul class="mt-6 space-y-3 text-sm text-gray-600">
              <li class="flex items-start gap-2"><svg class="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 12.75l6 6 9-13.5" /></svg>월 5건</li>
              <li class="flex items-start gap-2"><svg class="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 12.75l6 6 9-13.5" /></svg>1인</li>
              <li class="flex items-start gap-2"><svg class="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 12.75l6 6 9-13.5" /></svg>템플릿 3개</li>
              <li class="flex items-start gap-2"><svg class="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 12.75l6 6 9-13.5" /></svg>이메일 &middot; 카카오톡 전송</li>
              <li class="flex items-start gap-2"><svg class="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 12.75l6 6 9-13.5" /></svg>감사추적인증서</li>
            </ul>
            <NuxtLink to="/auth/register" class="mt-8 block text-center px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm font-medium">
              무료로 시작
            </NuxtLink>
          </div>
          <!-- Starter -->
          <div class="relative bg-brand-800 text-white rounded-2xl p-7 shadow-xl shadow-brand-800/20 ring-2 ring-brand-800">
            <span class="absolute -top-3 left-6 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">인기</span>
            <h3 class="font-semibold text-lg">Starter</h3>
            <p class="text-4xl font-bold mt-3">19,900<span class="text-base font-normal text-brand-200">원/월</span></p>
            <p class="text-xs text-brand-200 font-medium mt-1">타사 팀 요금제 대비 64% 절감</p>
            <ul class="mt-6 space-y-3 text-sm text-brand-100">
              <li class="flex items-start gap-2"><svg class="w-5 h-5 text-brand-300 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 12.75l6 6 9-13.5" /></svg><strong class="text-white">월 50건</strong></li>
              <li class="flex items-start gap-2"><svg class="w-5 h-5 text-brand-300 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 12.75l6 6 9-13.5" /></svg><strong class="text-white">팀원 5명</strong></li>
              <li class="flex items-start gap-2"><svg class="w-5 h-5 text-brand-300 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 12.75l6 6 9-13.5" /></svg>무제한 템플릿</li>
              <li class="flex items-start gap-2"><svg class="w-5 h-5 text-brand-300 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 12.75l6 6 9-13.5" /></svg>사건관리 연동</li>
              <li class="flex items-start gap-2"><svg class="w-5 h-5 text-brand-300 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 12.75l6 6 9-13.5" /></svg>슬랙 &middot; 구글드라이브 연동</li>
            </ul>
            <NuxtLink to="/auth/register" class="mt-8 block text-center px-4 py-2.5 bg-white text-brand-700 rounded-xl hover:bg-brand-50 transition text-sm font-semibold">
              무료체험 시작
            </NuxtLink>
          </div>
          <!-- Business -->
          <div class="bg-white border border-gray-200 rounded-2xl p-7 hover:shadow-lg transition-shadow duration-200">
            <h3 class="font-semibold text-lg text-gray-900">Business</h3>
            <p class="text-4xl font-bold mt-3">39,900<span class="text-base font-normal text-gray-400">원/월</span></p>
            <p class="text-xs text-green-600 font-medium mt-1">타사 프로 요금제 대비 55% 절감</p>
            <ul class="mt-6 space-y-3 text-sm text-gray-600">
              <li class="flex items-start gap-2"><svg class="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 12.75l6 6 9-13.5" /></svg><strong>월 200건</strong></li>
              <li class="flex items-start gap-2"><svg class="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 12.75l6 6 9-13.5" /></svg><strong>팀원 15명</strong></li>
              <li class="flex items-start gap-2"><svg class="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 12.75l6 6 9-13.5" /></svg>Starter 전체 포함</li>
              <li class="flex items-start gap-2"><svg class="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 12.75l6 6 9-13.5" /></svg>대량전송 &middot; API 연동</li>
              <li class="flex items-start gap-2"><svg class="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 12.75l6 6 9-13.5" /></svg>이메일/카카오 브랜딩</li>
            </ul>
            <NuxtLink to="/auth/register" class="mt-8 block text-center px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm font-medium">
              무료체험 시작
            </NuxtLink>
          </div>
          <!-- Enterprise -->
          <div class="bg-white border border-gray-200 rounded-2xl p-7 hover:shadow-lg transition-shadow duration-200">
            <h3 class="font-semibold text-lg text-gray-900">Enterprise</h3>
            <p class="text-4xl font-bold mt-3">별도<span class="text-base font-normal text-gray-400"> 상담</span></p>
            <ul class="mt-6 space-y-3 text-sm text-gray-600">
              <li class="flex items-start gap-2"><svg class="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 12.75l6 6 9-13.5" /></svg><strong>무제한 건수</strong></li>
              <li class="flex items-start gap-2"><svg class="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 12.75l6 6 9-13.5" /></svg><strong>팀원 무제한</strong></li>
              <li class="flex items-start gap-2"><svg class="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 12.75l6 6 9-13.5" /></svg>SSO &middot; IP 접근 제어</li>
              <li class="flex items-start gap-2"><svg class="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 12.75l6 6 9-13.5" /></svg>전용 담당자 &middot; SLA</li>
              <li class="flex items-start gap-2"><svg class="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 12.75l6 6 9-13.5" /></svg>온프레미스 설치 가능</li>
            </ul>
            <a href="mailto:contact@pactery.com" class="mt-8 block text-center px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm font-medium">
              도입 문의
            </a>
          </div>
        </div>

        <!-- 경쟁사 비교 하이라이트 -->
        <div class="mt-20 max-w-3xl mx-auto">
          <h3 class="text-xl font-bold text-center text-gray-900 mb-8">같은 기능, 확 다른 가격</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between bg-gray-50 rounded-xl px-6 py-4 border border-gray-100">
              <div>
                <p class="font-medium text-gray-900">팀 요금제 (30건, 3명)</p>
                <p class="text-sm text-gray-500">모두싸인 TEAM 기준</p>
              </div>
              <div class="text-right">
                <p class="text-gray-400 line-through text-sm">55,000원/월</p>
                <p class="text-brand-800 font-bold">19,900원/월 <span class="text-xs text-green-600">(50건, 5명)</span></p>
              </div>
            </div>
            <div class="flex items-center justify-between bg-gray-50 rounded-xl px-6 py-4 border border-gray-100">
              <div>
                <p class="font-medium text-gray-900">프로 요금제 (30건, 5명)</p>
                <p class="text-sm text-gray-500">모두싸인 TEAM PRO 기준</p>
              </div>
              <div class="text-right">
                <p class="text-gray-400 line-through text-sm">88,000원/월</p>
                <p class="text-brand-800 font-bold">39,900원/월 <span class="text-xs text-green-600">(200건, 15명)</span></p>
              </div>
            </div>
            <div class="flex items-center justify-between bg-gray-50 rounded-xl px-6 py-4 border border-gray-100">
              <div>
                <p class="font-medium text-gray-900">비즈니스 (100건, 무제한)</p>
                <p class="text-sm text-gray-500">eformsign Business 기준</p>
              </div>
              <div class="text-right">
                <p class="text-gray-400 line-through text-sm">40,000원/월</p>
                <p class="text-brand-800 font-bold">39,900원/월 <span class="text-xs text-green-600">(200건, 15명)</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Feature Comparison Table -->
    <section class="bg-gray-50 py-20 sm:py-24">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">요금제별 전체 기능 비교</h2>
        <div class="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b-2 border-gray-100">
                <th class="text-left py-4 px-5 font-semibold text-gray-700">기능</th>
                <th class="text-center py-4 px-3 font-semibold text-gray-700 w-24">Free</th>
                <th class="text-center py-4 px-3 font-semibold text-brand-800 w-24 bg-brand-50/50">Starter</th>
                <th class="text-center py-4 px-3 font-semibold text-gray-700 w-24">Business</th>
                <th class="text-center py-4 px-3 font-semibold text-gray-700 w-24">Enterprise</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr class="bg-gray-50"><td colspan="5" class="py-2.5 px-5 font-semibold text-gray-800 text-xs uppercase tracking-wider">핵심 기능</td></tr>
              <tr><td class="py-3 px-5 text-gray-600">서명 요청</td><td class="text-center text-gray-500">월 5건</td><td class="text-center bg-brand-50/30 font-medium text-brand-700">월 50건</td><td class="text-center text-gray-500">월 200건</td><td class="text-center text-gray-500">무제한</td></tr>
              <tr><td class="py-3 px-5 text-gray-600">멤버 (계정)</td><td class="text-center text-gray-500">1명</td><td class="text-center bg-brand-50/30 font-medium text-brand-700">5명</td><td class="text-center text-gray-500">15명</td><td class="text-center text-gray-500">무제한</td></tr>
              <tr><td class="py-3 px-5 text-gray-600">이메일 &middot; 카카오톡 전송</td><td class="text-center text-green-500">&#10003;</td><td class="text-center bg-brand-50/30 text-green-500">&#10003;</td><td class="text-center text-green-500">&#10003;</td><td class="text-center text-green-500">&#10003;</td></tr>
              <tr><td class="py-3 px-5 text-gray-600">대면서명</td><td class="text-center text-green-500">&#10003;</td><td class="text-center bg-brand-50/30 text-green-500">&#10003;</td><td class="text-center text-green-500">&#10003;</td><td class="text-center text-green-500">&#10003;</td></tr>
              <tr><td class="py-3 px-5 text-gray-600">링크서명</td><td class="text-center text-gray-300">-</td><td class="text-center bg-brand-50/30 text-green-500">&#10003;</td><td class="text-center text-green-500">&#10003;</td><td class="text-center text-green-500">&#10003;</td></tr>
              <tr><td class="py-3 px-5 text-gray-600">대량전송</td><td class="text-center text-gray-300">-</td><td class="text-center bg-brand-50/30 text-gray-300">-</td><td class="text-center text-green-500">&#10003;</td><td class="text-center text-green-500">&#10003;</td></tr>

              <tr class="bg-gray-50"><td colspan="5" class="py-2.5 px-5 font-semibold text-gray-800 text-xs uppercase tracking-wider">계약 설정 및 체결</td></tr>
              <tr><td class="py-3 px-5 text-gray-600">템플릿</td><td class="text-center text-gray-500">3개</td><td class="text-center bg-brand-50/30 font-medium text-brand-700">무제한</td><td class="text-center text-gray-500">무제한</td><td class="text-center text-gray-500">무제한</td></tr>
              <tr><td class="py-3 px-5 text-gray-600">사인 &middot; 도장 &middot; 이니셜</td><td class="text-center text-green-500">&#10003;</td><td class="text-center bg-brand-50/30 text-green-500">&#10003;</td><td class="text-center text-green-500">&#10003;</td><td class="text-center text-green-500">&#10003;</td></tr>
              <tr><td class="py-3 px-5 text-gray-600">예약 전송</td><td class="text-center text-gray-300">-</td><td class="text-center bg-brand-50/30 text-green-500">&#10003;</td><td class="text-center text-green-500">&#10003;</td><td class="text-center text-green-500">&#10003;</td></tr>
              <tr><td class="py-3 px-5 text-gray-600">고급 입력란 &middot; 문서 편집</td><td class="text-center text-gray-300">-</td><td class="text-center bg-brand-50/30 text-gray-300">-</td><td class="text-center text-green-500">&#10003;</td><td class="text-center text-green-500">&#10003;</td></tr>

              <tr class="bg-gray-50"><td colspan="5" class="py-2.5 px-5 font-semibold text-gray-800 text-xs uppercase tracking-wider">인증 &middot; 보안</td></tr>
              <tr><td class="py-3 px-5 text-gray-600">감사추적인증서</td><td class="text-center text-green-500">&#10003;</td><td class="text-center bg-brand-50/30 text-green-500">&#10003;</td><td class="text-center text-green-500">&#10003;</td><td class="text-center text-green-500">&#10003;</td></tr>
              <tr><td class="py-3 px-5 text-gray-600">SSO &middot; 2단계 인증</td><td class="text-center text-gray-300">-</td><td class="text-center bg-brand-50/30 text-gray-300">-</td><td class="text-center text-gray-300">-</td><td class="text-center text-green-500">&#10003;</td></tr>

              <tr class="bg-gray-50"><td colspan="5" class="py-2.5 px-5 font-semibold text-gray-800 text-xs uppercase tracking-wider">연동 서비스</td></tr>
              <tr><td class="py-3 px-5 text-gray-600">슬랙 알림</td><td class="text-center text-gray-300">-</td><td class="text-center bg-brand-50/30 text-green-500">&#10003;</td><td class="text-center text-green-500">&#10003;</td><td class="text-center text-green-500">&#10003;</td></tr>
              <tr><td class="py-3 px-5 text-gray-600">API 연동</td><td class="text-center text-gray-300">-</td><td class="text-center bg-brand-50/30 text-gray-300">-</td><td class="text-center text-green-500">&#10003;</td><td class="text-center text-green-500">&#10003;</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-brand-900 py-16 sm:py-20">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-2xl sm:text-3xl font-bold text-white">지금 바로 시작하세요</h2>
        <p class="mt-4 text-brand-300 text-lg">30초 만에 가입하고, 첫 서명을 보내보세요.</p>
        <NuxtLink to="/auth/register" class="mt-8 inline-block px-8 py-3.5 bg-white text-brand-900 font-semibold rounded-xl hover:bg-brand-50 transition shadow-lg shadow-white/10">
          무료로 시작하기
        </NuxtLink>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p class="text-lg font-bold text-white">Pactery</p>
            <p class="text-sm mt-1">전자서명, 쉽고 빠르게</p>
          </div>
          <div class="flex items-center gap-6 text-sm">
            <NuxtLink to="/blog" class="hover:text-white transition">블로그</NuxtLink>
            <a href="mailto:contact@pactery.com" class="hover:text-white transition">문의</a>
            <span>전자서명법 준수</span>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          &copy; {{ new Date().getFullYear() }} Pactery. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
interface Variant {
  id: string
  headline: string
  subtext: string
  cta: string
  badge: string
  weight: number
}

interface AbTest {
  id: string
  name: string
  variants: Variant[]
}

const DEFAULT_HERO: Variant = {
  id: 'default',
  headline: '전자서명, 쉽고 빠르게',
  subtext: '계약서 업로드부터 서명 완료까지 3분. 모든 서명 이력을 한눈에.',
  cta: '무료로 시작하기',
  badge: '',
  weight: 100,
}

const hero = ref<Variant>(DEFAULT_HERO)
const abTestId = ref<string | null>(null)

const heroHeadlineParts = computed(() => {
  const h = hero.value.headline
  const commaIdx = h.indexOf(',')
  if (commaIdx === -1) {
    return { prefix: '', highlight: h, suffix: '' }
  }
  return {
    prefix: h.slice(0, commaIdx + 1) + ' ',
    highlight: h.slice(commaIdx + 2),
    suffix: '',
  }
})

function pickVariant(variants: Variant[]): Variant {
  const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0)
  const rand = Math.random() * totalWeight
  let cumulative = 0
  for (const v of variants) {
    cumulative += v.weight
    if (rand < cumulative) return v
  }
  return variants[variants.length - 1]
}

function recordImpression(testId: string, variantId: string, action: 'view' | 'click' | 'signup') {
  $fetch('/api/ab/impress', {
    method: 'POST',
    body: { testId, variantId, action },
  }).catch(() => {})
}

function recordClick() {
  if (abTestId.value && hero.value.id !== 'default') {
    recordImpression(abTestId.value, hero.value.id, 'click')
  }
}

onMounted(async () => {
  try {
    const tests = await $fetch<AbTest[]>('/api/ab/active')
    const landingHeroTest = tests.find((t) => t.name === 'landing-hero')

    if (!landingHeroTest || !landingHeroTest.variants?.length) return

    abTestId.value = landingHeroTest.id

    const cookieKey = `ab_variant_${landingHeroTest.id}`
    const savedVariantId = useCookie(cookieKey, {
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
    })

    let selectedVariant: Variant

    if (savedVariantId.value) {
      const found = landingHeroTest.variants.find((v) => v.id === savedVariantId.value)
      selectedVariant = found ?? pickVariant(landingHeroTest.variants)
    } else {
      selectedVariant = pickVariant(landingHeroTest.variants)
      savedVariantId.value = selectedVariant.id
    }

    hero.value = selectedVariant
    recordImpression(landingHeroTest.id, selectedVariant.id, 'view')
  } catch {}
})

useHead({ title: 'Pactery - 전자서명, 쉽고 빠르게' })
</script>
