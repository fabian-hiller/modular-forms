import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  outExtension({ format }) {
    return {
      js: `.${format}.jsx`,
    };
  },
  clean: true,
  dts: true,
});
