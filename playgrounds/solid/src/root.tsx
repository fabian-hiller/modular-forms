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
import { Head, Tabs } from '~/components';
import { ThemeProvider } from '~/contexts';
import { disableTransitions } from '~/utils';
import '~/styles.css';

export default function Root() {
  // Disable CSS transitions while window is resized
  if (isClient) {
    makeEventListener(window, 'resize', disableTransitions);
  }

  return (
    <Html class="font-lexend" lang="en">
      <ThemeProvider>
        <Head />
        <Body class="space-y-12 bg-white py-12 text-slate-600 dark:bg-gray-900 dark:text-slate-400 md:space-y-14 md:py-14 lg:space-y-16 lg:py-16">
          <ErrorBoundary>
            <Suspense>
              <Tabs
                items={['Login', 'Payment', 'Todos', 'Special', 'Nested']}
              />
              <Routes>
                <FileRoutes />
              </Routes>
            </Suspense>
          </ErrorBoundary>
          <Scripts />
        </Body>
      </ThemeProvider>
    </Html>
  );
}
