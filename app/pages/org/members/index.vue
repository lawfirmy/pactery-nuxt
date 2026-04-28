<template>
  <div class="max-w-5xl mx-auto py-8 px-4">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">팀원 관리</h1>
      <button @click="showInvite = true" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
        + 멤버 초대
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">이름</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">이메일</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">역할</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="m in members" :key="m.id">
            <td class="px-4 py-3 text-sm font-medium">{{ m.name }}</td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ m.email }}</td>
            <td class="px-4 py-3">
              <span :class="roleClass(m.role)" class="text-xs px-2 py-1 rounded-full">
                {{ roleLabel(m.role) }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm">
              <span :class="m.pending ? 'text-yellow-600' : 'text-green-600'">
                {{ m.pending ? '초대 대기' : '활성' }}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <button
                v-if="m.role !== 'owner'"
                @click="removeMember(m.id)"
                class="text-xs text-red-500 hover:text-red-700"
              >
                제거
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Invite Modal -->
    <div v-if="showInvite" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showInvite = false">
      <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <h2 class="text-lg font-semibold mb-4">멤버 초대</h2>
        <form @submit.prevent="handleInvite" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input v-model="invite.email" type="email" required class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">역할</label>
            <select v-model="invite.role" class="w-full px-3 py-2 border rounded-lg">
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div class="flex justify-end gap-3">
            <button type="button" @click="showInvite = false" class="px-4 py-2 text-gray-600">취소</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">초대</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: '팀원 관리 - Pactery' })

const { fetchMembers, inviteMember, orgFetch } = useOrganization()

const members = ref<any[]>([])
const showInvite = ref(false)
const invite = reactive({ email: '', role: 'member' })

onMounted(async () => {
  try {
    members.value = await fetchMembers()
  } catch (e) {
    console.error('Failed to load members:', e)
  }
})

async function handleInvite() {
  try {
    await inviteMember(invite)
    showInvite.value = false
    invite.email = ''
    invite.role = 'member'
    members.value = await fetchMembers()
  } catch (e: any) {
    useToast().error(e.data?.statusMessage || '초대 실패')
  }
}

async function removeMember(memberId: string) {
  if (!confirm('이 멤버를 제거하시겠습니까?')) return
  try {
    await orgFetch(`/members/${memberId}`, { method: 'DELETE' })
    members.value = await fetchMembers()
  } catch (e: any) {
    useToast().error(e.data?.statusMessage || '제거 실패')
  }
}

function roleLabel(role: string) {
  const map: Record<string, string> = { owner: 'Owner', admin: 'Admin', member: 'Member', viewer: 'Viewer' }
  return map[role] || role
}

function roleClass(role: string) {
  const map: Record<string, string> = {
    owner: 'bg-purple-100 text-purple-800',
    admin: 'bg-blue-100 text-blue-800',
    member: 'bg-gray-100 text-gray-800',
    viewer: 'bg-gray-50 text-gray-600',
  }
  return map[role] || 'bg-gray-100 text-gray-700'
}
</script>
