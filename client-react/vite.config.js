import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api/golang": {
        target: "http://api-golang:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/golang/, ""),
        secure: false,
      },
      "/api/node": {
        target: "http://api-node:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/node/, ""),
        secure: false,
      },
    },
  },
})
