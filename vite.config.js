import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Excalidraw, Mermaid ed ELK sono già caricati in modo differito.
    chunkSizeWarningLimit: 2000,
  },
})
