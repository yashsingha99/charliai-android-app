import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import compression from "vite-plugin-compression";
import sitemap from "vite-plugin-sitemap";
import { VitePWA } from "vite-plugin-pwa";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "CharliAI",
        short_name: "Charli",
        description: "Your AI Assistant",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/logo.webp",
            sizes: "192x192",
            type: "image/webp",
          },
          {
            src: "/logo.webp",
            sizes: "512x512",
            type: "image/webp",
          },
        ],
      },
    }),
    react(),
    tailwindcss(),
    compression({
      algorithm: "gzip",  
    }),
    sitemap({
      hostname: "https://charli-ai.vercel.app",
    }),
  ],
  server: {
    host: true,  
    port: 5173, 
    strictPort: true,  
    cors: true,  
  },
});
