// @refresh reload
import { createHandler, StartServer } from '@solidjs/start/server';

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html class="font-lexend" lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          <script
            innerHTML={`
              if (!window.matchMedia('(prefers-color-scheme: light)').matches) {
                document.documentElement.classList.add('dark');
              }
            `}
          />
          {assets}
        </head>
        <body class="bg-white text-slate-600 dark:bg-gray-900 dark:text-slate-400">
          <div
            id="app"
            class="space-y-12 py-12 md:space-y-14 md:py-14 lg:space-y-16 lg:py-16"
          >
            {children}
          </div>
          {scripts}
        </body>
      </html>
    )}
  />
));
