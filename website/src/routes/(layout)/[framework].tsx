import { Show } from 'solid-js';
import { Meta, Outlet, useParams } from 'solid-start';
import { Framework, frameworks } from '~/contexts';
import NotFoundPage from './[...404]';

export default function FrameworkLayout() {
  // Use params
  const params = useParams();

  return (
    <Show
      when={frameworks.includes(params.framework as Framework)}
      fallback={<NotFoundPage />}
    >
      <Meta name="docsearch:framework" content={params.framework} />
      <Outlet />
    </Show>
  );
}
