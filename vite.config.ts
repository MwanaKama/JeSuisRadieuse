import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Utilisez un port différent
    strictPort: false, // Permet à Vite de trouver un autre port si nécessaire
  },
})
