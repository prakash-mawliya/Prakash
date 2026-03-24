import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const isGithubActions = Boolean(env.GITHUB_ACTIONS)

  return {
    plugins: [react()],
    base: isGithubActions ? '/Prakash/' : '/',
  }
})
