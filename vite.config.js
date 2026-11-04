import { resolve } from 'path'
import fs from 'fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function getHtmlInputs() {
  const inputs = {
    main: resolve(__dirname, 'index.html'),
    panchang: resolve(__dirname, 'panchang/index.html'),
    muhurat: resolve(__dirname, 'muhurat/index.html'),
    festivals: resolve(__dirname, 'festivals/index.html'),
    daily: resolve(__dirname, 'daily/index.html'),
    matchmaking: resolve(__dirname, 'matchmaking/index.html'),
    tools: resolve(__dirname, 'tools/index.html'),
    astrologyTools: resolve(__dirname, 'astrology-tools/index.html'),
  }

  // Automatically index all subpages in astrology-tools/
  const astroToolsDir = resolve(__dirname, 'astrology-tools')
  if (fs.existsSync(astroToolsDir)) {
    fs.readdirSync(astroToolsDir, { withFileTypes: true }).forEach(dirent => {
      if (dirent.isDirectory()) {
        const file = resolve(astroToolsDir, dirent.name, 'index.html')
        if (fs.existsSync(file)) {
          inputs[`astro_${dirent.name.replace(/[^a-zA-Z0-9]/g, '_')}`] = file
        }
      }
    })
  }

  // Automatically index all subpages in tools/
  const toolsDir = resolve(__dirname, 'tools')
  if (fs.existsSync(toolsDir)) {
    fs.readdirSync(toolsDir, { withFileTypes: true }).forEach(dirent => {
      if (dirent.isDirectory()) {
        const file = resolve(toolsDir, dirent.name, 'index.html')
        if (fs.existsSync(file)) {
          inputs[`tools_${dirent.name.replace(/[^a-zA-Z0-9]/g, '_')}`] = file
        }
      }
    })
  }

  return inputs
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: getHtmlInputs()
    }
  }
})
