export default defineNuxtRouteMiddleware(async () => {
  const { waitForAuth, isLoggedIn } = useAuth()
  await waitForAuth()
  if (!isLoggedIn.value) {
    return navigateTo('/auth/login')
  }
})
