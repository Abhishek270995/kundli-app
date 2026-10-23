import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        panchang: resolve(__dirname, 'panchang/index.html'),
        muhurat: resolve(__dirname, 'muhurat/index.html'),
        festivals: resolve(__dirname, 'festivals/index.html'),
        daily: resolve(__dirname, 'daily/index.html'),
        matchmaking: resolve(__dirname, 'matchmaking/index.html'),
        tools: resolve(__dirname, 'tools/index.html'),
      }
    }
  }
})
