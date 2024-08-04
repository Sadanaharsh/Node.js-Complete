import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/

// jab bhi request me api call hoga, then always api ke peeche ye URL bhi append ho jayega.
export default defineConfig({
  server: {
    proxy: {
      '/api' : 'http://localhost:3000',
    },
  },
  plugins: [react()],
})
