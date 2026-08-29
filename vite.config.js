// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), 
  ],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  esbuild: {
    // .js fayllar ichida ham JSX sintaksisini kompyatsiya qilishga ruxsat berish
    loader: 'jsx',
    include: /src\/.*\.js$/, 
  },
})
