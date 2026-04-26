<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Header -->
    <div class="mb-10 text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-3">전자서명 블로그</h1>
      <p class="text-gray-500 text-lg max-w-xl mx-auto">
        전자서명 실무 가이드, 서비스 비교, 법률 정보를 제공합니다.
      </p>
    </div>

    <!-- 카테고리 탭 -->
    <div class="flex flex-wrap gap-2 mb-8 justify-center">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="selectedCategory = tab.value"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition-colors',
          selectedCategory === tab.value
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600',
        ]"
      >
        {{ tab.label }}
        <span class="ml-1 text-xs opacity-70">({{ tab.count }})</span>
      </button>
    </div>

    <!-- 블로그 카드 그리드 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="post in filteredPosts"
        :key="post.slug"
        :to="`/blog/${post.slug}`"
        class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-blue-200 transition-all group"
      >
        <div class="p-6">
          <!-- 카테고리 배지 -->
          <div class="mb-3">
            <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', categoryColors[post.category]]">
              {{ categoryLabels[post.category] }}
            </span>
          </div>

          <!-- 제목 -->
          <h2 class="text-base font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
            {{ post.title }}
          </h2>

          <!-- 설명 -->
          <p class="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4">
            {{ post.description }}
          </p>

          <!-- 메타 정보 -->
          <div class="flex items-center gap-3 text-xs text-gray-400">
            <span>{{ formatDate(post.publishedAt) }}</span>
            <span class="text-gray-200">|</span>
            <span>읽기 {{ post.readTime }}분</span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- 결과 없음 -->
    <div v-if="filteredPosts.length === 0" class="text-center py-20 text-gray-400">
      해당 카테고리의 글이 없습니다.
    </div>
  </div>
</template>

<script setup lang="ts">
import { blogPosts, categoryLabels } from '~/data/blog-posts'
import type { BlogPost } from '~/data/blog-posts'

useSeoMeta({
  title: '전자서명 블로그 - Pactery',
  description: '전자서명 실무 가이드, 서비스 비교 분석, 법률 정보를 제공하는 Pactery 공식 블로그입니다. 법률사무소 전자서명 도입부터 보안까지 전문 콘텐츠를 만나보세요.',
  ogTitle: '전자서명 블로그 - Pactery',
  ogDescription: '전자서명 실무 가이드, 서비스 비교 분석, 법률 정보를 제공하는 Pactery 공식 블로그',
  ogType: 'website',
})

type CategoryFilter = BlogPost['category'] | 'all'

const selectedCategory = ref<CategoryFilter>('all')

const categoryColors: Record<BlogPost['category'], string> = {
  guide: 'bg-blue-50 text-blue-700',
  comparison: 'bg-purple-50 text-purple-700',
  legal: 'bg-red-50 text-red-700',
  tips: 'bg-green-50 text-green-700',
}

const tabs = computed(() => {
  const counts = blogPosts.reduce((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return [
    { value: 'all' as CategoryFilter, label: '전체', count: blogPosts.length },
    { value: 'guide' as CategoryFilter, label: '가이드', count: counts.guide || 0 },
    { value: 'comparison' as CategoryFilter, label: '비교', count: counts.comparison || 0 },
    { value: 'legal' as CategoryFilter, label: '법률', count: counts.legal || 0 },
    { value: 'tips' as CategoryFilter, label: '실무 팁', count: counts.tips || 0 },
  ]
})

const filteredPosts = computed(() => {
  if (selectedCategory.value === 'all') return blogPosts
  return blogPosts.filter(post => post.category === selectedCategory.value)
})

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>
