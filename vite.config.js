import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const isGithubActions = Boolean(env.GITHUB_ACTIONS)

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['logo.svg'], 
        manifest: {
          name: 'Prakash Portfolio',
          short_name: 'Prakash',
          description: 'My Portfolio Website',
          theme_color: '#ffffff',
          icons: [
            {
              src: 'logo.svg',
              sizes: '192x192',
              type: 'image/svg+xml'
            },
            {
              src: 'logo.svg',
              sizes: '512x512',
              type: 'image/svg+xml'
            }
          ]
        }
      })
    ],
    base: isGithubActions ? '/Prakash/' : '/',
  }
})
