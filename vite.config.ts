import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'charts', test: /node_modules[\\/]recharts[\\/]/, priority: 2 },
            { name: 'app-vendor', test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|@tanstack|zustand|i18next|react-i18next|lucide-react|axios|react-hook-form|zod|@hookform|scheduler)[\\/]/, priority: 1 },
          ],
        },
      },
    },
  },
})
