import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// CDN-externalized dependencies — not bundled into dist
const externalDeps = [
  'react',
  'react/jsx-runtime',
  'react-dom',
  'react-dom/client',
  'zod',
  '@tanstack/react-query',
  'react-hook-form',
  '@headlessui/react',
]

export default defineConfig({
  // GitHub Pages: /taskform/ | Walrus Site: /
  // Set VITE_BASE_PATH=/ for Walrus Site builds
  base: process.env.VITE_BASE_PATH || '/taskform/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        'create-form': resolve(__dirname, 'create-form.html'),
        form: resolve(__dirname, 'form.html'),
      },
      external: externalDeps,
      output: {
        // Preserve external imports as-is for import map resolution
        format: 'es',
        globals: {
          react: 'React',
          'react-dom/client': 'ReactDOM',
        },
      },
    },
  },
})
