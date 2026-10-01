import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dns from "dns";

dns.setDefaultResultOrder("verbatim");

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/golang": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/golang/, ""),
        secure: false,
      },
      "/api/node": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/node/, ""),
        secure: false,
      },
    },
  },
});
