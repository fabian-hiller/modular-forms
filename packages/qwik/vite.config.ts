import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';

export default defineConfig(() => {
  return {
    build: {
      target: 'es2020',
      outDir: 'dist',
      lib: {
        entry: './src/index.ts',
        formats: ['es', 'cjs'],
        fileName: (format) => `${format === 'es' ? 'esm' : format}/index.js`,
      },
      minify: false,
      rollupOptions: {
        external: ['@builder.io/qwik', '@builder.io/qwik-city', 'zod'],
      },
    },
    plugins: [qwikVite()],
  };
});
