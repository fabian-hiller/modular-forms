import rehypePrism from '@mapbox/rehype-prism';
import mdx from '@mdx-js/rollup';
import solid from 'solid-start/vite'; // @ts-ignore
import netlify from 'solid-start-netlify';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    {
      ...mdx({
        jsx: true,
        jsxImportSource: 'solid-js',
        providerImportSource: 'solid-mdx',
        rehypePlugins: [rehypePrism],
      }),
      enforce: 'pre',
    },
    solid({
      adapter: netlify({ edge: false }),
      extensions: ['.tsx', '.mdx'],
      ssr: false,
    }),
  ],
});
