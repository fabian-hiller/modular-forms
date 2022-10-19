// @refresh reload
import { makeEventListener } from '@solid-primitives/event-listener';
import { isClient } from '@solid-primitives/utils';
import { Suspense } from 'solid-js';
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Html,
  Routes,
  Scripts,
} from 'solid-start';
import { Footer, Head, Header } from '~/components';
import { ThemeProvider } from '~/contexts';
import { disableTransitions } from '~/utils';
import '~/styles/base.css';
import '~/styles/components.css';
import '~/styles/fonts.css';
import '~/styles/pace.css';
import '~/styles/utilities.css';

export default function Root() {
  // Disable CSS transitions while window is resized
  if (isClient) {
    makeEventListener(window, 'resize', disableTransitions);
  }

  return (
    <Html class="font-lexend" lang="en">
      <ThemeProvider>
        <Head />
        <Body class="flex min-h-screen flex-col bg-white text-slate-600 dark:bg-gray-900 dark:text-slate-400">
          <ErrorBoundary>
            <Suspense>
              <Header />
              <Routes>
                <FileRoutes />
              </Routes>
              <Footer />
            </Suspense>
          </ErrorBoundary>
          <Scripts />
        </Body>
      </ThemeProvider>
    </Html>
  );
}
