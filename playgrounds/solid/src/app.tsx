import { Suspense } from 'solid-js';
import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { makeEventListener } from '@solid-primitives/event-listener';
import { disableTransitions } from './utils';
import { isClient } from '@solid-primitives/utils';
import { Tabs } from './components';
import { MetaProvider } from '@solidjs/meta';
import './styles.css';

export default function App() {
  // Disable CSS transitions while window is resized
  if (isClient) {
    makeEventListener(window, 'resize', disableTransitions);
  }

  return (
    <MetaProvider>
      <Router
        root={(props) => (
          <Suspense>
            <Tabs items={['Login', 'Payment', 'Todos', 'Special', 'Nested']} />
            {props.children}
          </Suspense>
        )}
      >
        <FileRoutes />
      </Router>
    </MetaProvider>
  );
}
