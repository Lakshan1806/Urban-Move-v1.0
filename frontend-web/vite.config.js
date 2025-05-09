import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [tailwindcss(),react()],
  server: {
    proxy: {
      "/uploads": {
        target:"http://localhost:5000",
        changeOrigin:true,
        secure:false,
      }
    }
  }
})
