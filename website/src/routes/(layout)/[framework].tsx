import { Show } from 'solid-js';
import { Outlet, useParams } from 'solid-start';
import { Framework, frameworks } from '~/contexts';
import NotFoundPage from './[...404]';

export default function FrameworkLayout() {
  return (
    <Show
      when={frameworks.includes(useParams().framework as Framework)}
      fallback={<NotFoundPage />}
    >
      <Outlet />
    </Show>
  );
}
