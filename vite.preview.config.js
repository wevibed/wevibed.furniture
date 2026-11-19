// Used only by scripts/make-preview.mjs to build one self-contained HTML file.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  publicDir: false,
  build: { outDir: 'dist-preview', chunkSizeWarningLimit: 4000, assetsInlineLimit: 0, rollupOptions: { output: { inlineDynamicImports: true } } },
});
