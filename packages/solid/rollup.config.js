import withSolid from 'rollup-preset-solid';

export default withSolid({
  input: 'src/index.ts',
  targets: ['esm', 'cjs'],
  external: ['valibot', 'zod'],
});
