<template>
  <div>
    <!-- 존재하지 않는 슬러그 -->
    <div v-if="!post" class="max-w-3xl mx-auto px-4 py-24 text-center">
      <p class="text-gray-400 text-lg mb-4">존재하지 않는 글입니다.</p>
      <NuxtLink to="/blog" class="text-blue-600 hover:underline text-sm">블로그 목록으로 돌아가기</NuxtLink>
    </div>

    <template v-else>
      <!-- 아티클 본문 -->
      <article class="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <!-- 브레드크럼 -->
        <nav class="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <NuxtLink to="/blog" class="hover:text-gray-600">블로그</NuxtLink>
          <span>/</span>
          <span class="text-gray-600">{{ categoryLabels[post.category] }}</span>
        </nav>

        <!-- 카테고리 + 메타 -->
        <div class="mb-4 flex flex-wrap items-center gap-3">
          <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', categoryColors[post.category]]">
            {{ categoryLabels[post.category] }}
          </span>
          <span class="text-sm text-gray-400">{{ formatDate(post.publishedAt) }}</span>
          <span class="text-gray-200">|</span>
          <span class="text-sm text-gray-400">읽기 {{ post.readTime }}분</span>
          <span class="text-gray-200">|</span>
          <span class="text-sm text-gray-400">{{ post.author }}</span>
        </div>

        <!-- 제목 -->
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-snug">
          {{ post.title }}
        </h1>

        <!-- 설명 (리드문) -->
        <p class="text-gray-500 text-base leading-relaxed mb-6 border-l-4 border-blue-200 pl-4">
          {{ post.description }}
        </p>

        <!-- 태그 -->
        <div class="flex flex-wrap gap-2 mb-10">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="px-2.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full"
          >
            #{{ tag }}
          </span>
        </div>

        <!-- 콘텐츠 영역 -->
        <div
          v-if="post.content"
          class="prose prose-gray prose-headings:font-bold prose-a:text-blue-600 max-w-none"
          v-html="post.content"
        />
        <div v-else class="py-16 text-center text-gray-300 border border-dashed border-gray-200 rounded-xl">
          <p class="text-sm">콘텐츠 준비 중입니다.</p>
        </div>

        <!-- 이전글 / 다음글 네비게이션 -->
        <div class="mt-14 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4">
          <div>
            <NuxtLink
              v-if="prevPost"
              :to="`/blog/${prevPost.slug}`"
              class="group block p-4 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all"
            >
              <p class="text-xs text-gray-400 mb-1">이전 글</p>
              <p class="text-sm font-medium text-gray-700 group-hover:text-blue-600 line-clamp-2 leading-snug">
                {{ prevPost.title }}
              </p>
            </NuxtLink>
          </div>
          <div class="flex justify-end">
            <NuxtLink
              v-if="nextPost"
              :to="`/blog/${nextPost.slug}`"
              class="group block p-4 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all text-right"
            >
              <p class="text-xs text-gray-400 mb-1">다음 글</p>
              <p class="text-sm font-medium text-gray-700 group-hover:text-blue-600 line-clamp-2 leading-snug">
                {{ nextPost.title }}
              </p>
            </NuxtLink>
          </div>
        </div>
      </article>

      <!-- CTA 배너 -->
      <div class="bg-blue-600 mt-4">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 py-10 text-center">
          <h2 class="text-xl font-bold text-white mb-2">Pactery로 전자서명 시작하기</h2>
          <p class="text-blue-100 text-sm mb-6">
            법률사무소에 최적화된 전자서명 서비스. 무료로 시작해보세요.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
            <NuxtLink
              to="/auth/register"
              class="px-6 py-2.5 bg-white text-blue-600 font-semibold text-sm rounded-lg hover:bg-blue-50 transition-colors"
            >
              무료로 시작하기
            </NuxtLink>
            <NuxtLink
              to="/auth/login"
              class="px-6 py-2.5 border border-blue-400 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              로그인
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- 관련 글 -->
      <div v-if="relatedPosts.length > 0" class="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h2 class="text-lg font-bold text-gray-800 mb-6">관련 글</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NuxtLink
            v-for="related in relatedPosts"
            :key="related.slug"
            :to="`/blog/${related.slug}`"
            class="group block p-4 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all"
          >
            <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mb-2', categoryColors[related.category]]">
              {{ categoryLabels[related.category] }}
            </span>
            <p class="text-sm font-medium text-gray-700 group-hover:text-blue-600 line-clamp-2 leading-snug">
              {{ related.title }}
            </p>
            <p class="text-xs text-gray-400 mt-2">읽기 {{ related.readTime }}분</p>
          </NuxtLink>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { blogPosts, getBlogPost, getRelatedPosts, categoryLabels } from '~/data/blog-posts'
import type { BlogPost } from '~/data/blog-posts'

const route = useRoute()
const slug = route.params.slug as string

const post = computed(() => getBlogPost(slug))

const categoryColors: Record<BlogPost['category'], string> = {
  guide: 'bg-blue-50 text-blue-700',
  comparison: 'bg-purple-50 text-purple-700',
  legal: 'bg-red-50 text-red-700',
  tips: 'bg-green-50 text-green-700',
}

const currentIndex = computed(() => blogPosts.findIndex(p => p.slug === slug))
const prevPost = computed(() => currentIndex.value > 0 ? blogPosts[currentIndex.value - 1] : null)
const nextPost = computed(() => currentIndex.value < blogPosts.length - 1 ? blogPosts[currentIndex.value + 1] : null)
const relatedPosts = computed(() => post.value ? getRelatedPosts(slug, post.value.category) : [])

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

// SEO
if (post.value) {
  const config = useRuntimeConfig()
  const appUrl = config.public.appUrl || 'https://pactery.com'
  const canonicalUrl = `${appUrl}/blog/${post.value.slug}`

  useSeoMeta({
    title: `${post.value.title} - Pactery`,
    description: post.value.description,
    ogTitle: `${post.value.title} - Pactery`,
    ogDescription: post.value.description,
    ogType: 'article',
    ogUrl: canonicalUrl,
    twitterCard: 'summary_large_image',
    twitterTitle: `${post.value.title} - Pactery`,
    twitterDescription: post.value.description,
  })

  useHead({
    link: [{ rel: 'canonical', href: canonicalUrl }],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.value.title,
          description: post.value.description,
          author: {
            '@type': 'Organization',
            name: post.value.author,
          },
          publisher: {
            '@type': 'Organization',
            name: 'Pactery',
            url: appUrl,
          },
          datePublished: post.value.publishedAt,
          dateModified: post.value.updatedAt || post.value.publishedAt,
          url: canonicalUrl,
          keywords: post.value.tags.join(', '),
          articleSection: categoryLabels[post.value.category],
          inLanguage: 'ko-KR',
        }),
      },
    ],
  })
} else {
  useSeoMeta({ title: '글을 찾을 수 없습니다 - Pactery' })
}
</script>
