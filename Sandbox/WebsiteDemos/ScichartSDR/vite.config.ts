import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      pwaAssets: {
        config: true,
      },
      manifest: {
        name: 'SciChart SDR',
        short_name: 'SDR Radio',
        description: 'Software Defined Radio receiver with spectrum and waterfall display',
        theme_color: '#040d1a',
        background_color: '#090e18',
        display: 'standalone',
        orientation: 'landscape',
        start_url: '.',
        scope: '.',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,wasm,data}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
  assetsInclude: ['**/*.wasm', '**/*.data'],
  build: {
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('/node_modules/')) {
            return undefined
          }

          if (id.includes('/node_modules/scichart/')) {
            return 'scichart-vendor'
          }

          if (id.includes('/node_modules/@mui/') || id.includes('/node_modules/@emotion/')) {
            return 'mui-vendor'
          }

          if (id.includes('/node_modules/@jtarrio/')) {
            return 'sdr-vendor'
          }

          if (id.includes('/node_modules/react/') || id.includes('/node_modules/react-dom/')) {
            return 'react-vendor'
          }

          return undefined
        },
      },
    },
  },
})
