import { Head as SolidHead, Meta, Title } from 'solid-start';

/**
 * Head with title, meta, link and script elements.
 */
export function Head() {
  return (
    <SolidHead>
      <Title>Modular Forms Playground</Title>
      <Meta charset="utf-8" />
      <Meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      <script
        // If necessary, add "dark" class for theming before browser has
        // chance to paint to prevent screen from flashing between two
        // color modes
        innerHTML={`
          const theme = localStorage.getItem('theme');
          const { classList } = document.documentElement;
          if (
            theme === 'dark' ||
            (!theme &&
              window.matchMedia('(prefers-color-scheme: dark)').matches)
          ) {
            classList.add('dark');
          } else {
            classList.remove('dark');
          }
        `}
      />
    </SolidHead>
  );
}
