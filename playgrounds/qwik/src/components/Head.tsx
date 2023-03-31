import { component$ } from '@builder.io/qwik';
import { useDocumentHead, useLocation } from '@builder.io/qwik-city';

/**
 * Head with title, meta, link and script elements.
 */
export const Head = component$(() => {
  const documentHead = useDocumentHead();
  const location = useLocation();

  return (
    <head>
      <title>{`${documentHead.title} | Modular Forms`}</title>

      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <link rel="manifest" href="/manifest.json" />
      <link rel="canonical" href={location.url.href} />
      <link rel="icon" href="/favicon.ico" />

      {documentHead.meta.map((meta) => (
        <meta key={meta.key} {...meta} />
      ))}

      {documentHead.links.map((link) => (
        <link key={link.key} {...link} />
      ))}

      {documentHead.styles.map((style) => (
        <style
          key={style.key}
          {...style.props}
          dangerouslySetInnerHTML={style.style}
        />
      ))}

      <script
        // Add "dark" class for theming before browser has chance to paint to
        // prevent screen from flashing between two color modes
        dangerouslySetInnerHTML={`
          if (!window.matchMedia('(prefers-color-scheme: light)').matches) {
            document.documentElement.classList.add('dark');
          }
        `}
      />
    </head>
  );
});
