import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // The prerender entry (passed via `vite build --ssr src/entry-server.tsx`)
  // is consumed by scripts/prerender.mjs and never ships to the browser.
  build: isSsrBuild
    ? {
        outDir: 'dist-ssr',
        rollupOptions: { output: { entryFileNames: 'entry-server.js' } },
      }
    : {},

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
}))
