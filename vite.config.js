// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './',
  plugins: [
      react(),
      tailwindcss(),
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          'primary-color': '#2469F4',
          'link-color': '#5C6899',
        },
      },
    },
  },
});