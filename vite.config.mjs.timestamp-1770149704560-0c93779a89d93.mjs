import { defineConfig } from "file:///C:/Projects/Academic_result_predictor/academic_result_predictor/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Projects/Academic_result_predictor/academic_result_predictor/node_modules/@vitejs/plugin-react/dist/index.mjs";
import tsconfigPaths from "file:///C:/Projects/Academic_result_predictor/academic_result_predictor/node_modules/vite-tsconfig-paths/dist/index.mjs";
import tagger from "file:///C:/Projects/Academic_result_predictor/academic_result_predictor/node_modules/@dhiwise/component-tagger/dist/index.mjs";
import { VitePWA } from "file:///C:/Projects/Academic_result_predictor/academic_result_predictor/node_modules/vite-plugin-pwa/dist/index.js";
import path from "path";
import { fileURLToPath } from "url";
var __vite_injected_original_import_meta_url = "file:///C:/Projects/Academic_result_predictor/academic_result_predictor/vite.config.mjs";
var __filename = fileURLToPath(__vite_injected_original_import_meta_url);
var __dirname = path.dirname(__filename);
var vite_config_default = defineConfig({
  
  
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 2e3
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  plugins: [
    tsconfigPaths(),
    react(),
    tagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["graduate-hat.ico", "apple-touch-icon.png", "masked-icon.svg"],
      devOptions: {
        enabled: true
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5e6
        
      },
      manifest: {
        name: "StudyMate",
        short_name: "StudyMate",
        description: "Predict your academic results and analyze performance",
        theme_color: "#ffffff",
        icons: [
          {
            src: "graduate-hat.ico",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/x-icon"
          },
          {
            src: "logo192_1764522242085.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "logo512_1764522227168.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ],
  server: {
    port: "4028",
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: [".amazonaws.com", ".builtwithrocket.new"],
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5002",
        changeOrigin: true,
        secure: false
      }
    }
  }
});
export {
  vite_config_default as default
};

