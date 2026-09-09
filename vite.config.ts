import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

const isGitHubPages = process.env.GITHUB_PAGES === 'true'

/** GitHub Pages serves 404.html for unknown paths — copy SPA entry so deep links work. */
function spaFallback404(): Plugin {
  return {
    name: 'spa-fallback-404',
    closeBundle() {
      if (!isGitHubPages) return
      const index = resolve('dist/index.html')
      const fallback = resolve('dist/404.html')
      if (existsSync(index)) copyFileSync(index, fallback)
    },
  }
}

export default defineConfig({
  base: isGitHubPages ? '/table-tennis-run/' : '/',
  plugins: [vue(), spaFallback404()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
