import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://blablajava.vercel.app",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, "/api/proxy"),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split node_modules into separate chunks
          if (id.includes("node_modules")) {
            // React and React DOM
            if (id.includes("react") || id.includes("react-dom")) {
              return "react-vendor";
            }
            // React Router
            if (id.includes("react-router")) {
              return "router-vendor";
            }
            // Redux
            if (id.includes("redux") || id.includes("@reduxjs")) {
              return "redux-vendor";
            }
            // TanStack Query
            if (id.includes("@tanstack/react-query")) {
              return "query-vendor";
            }
            // Radix UI components
            if (id.includes("@radix-ui")) {
              return "radix-vendor";
            }
            // Other large vendor libraries
            if (id.includes("axios")) {
              return "axios-vendor";
            }
            // All other node_modules
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
