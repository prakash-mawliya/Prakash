import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages needs base path, Vercel needs root '/'
  base: process.env.GITHUB_ACTIONS ? "/Prakash/" : "/",
})
