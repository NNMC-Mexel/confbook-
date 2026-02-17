import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 15001,
    proxy: {
      '/api': {
        target: 'http://localhost:14001',
        changeOrigin: true,
      },
    },
  },
})
