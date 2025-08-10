// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// MUST match your repo name
export default defineConfig({
  plugins: [react()],
  base: '/CRT-TTT/',
})
