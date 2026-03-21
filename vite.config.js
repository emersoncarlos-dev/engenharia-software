import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// configuração do vite para usar o plugin do React
export default defineConfig({
  plugins: [react()],
})
