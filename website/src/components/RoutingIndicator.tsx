import clsx from 'clsx';
import { createSignal, createEffect, onCleanup, Show, on } from 'solid-js';
import { useIsRouting } from 'solid-start';

type State = 'none' | 'start' | 'loading' | 'end';

/**
 * Loading animation that gives visual feedback that the route is being changed.
 */
export function RoutingIndicator() {
  // Use is routing and create state signal
  const getIsRouting = useIsRouting();
  const [getState, setState] = createSignal<State>('none');

  // Update state when is routing changes
  createEffect(
    on(
      getIsRouting,
      (isRouting) => {
        if (isRouting) {
          let frame = requestAnimationFrame(() => {
            setState('start');
            frame = requestAnimationFrame(() => setState('loading'));
          });
          onCleanup(() => cancelAnimationFrame(frame));
        } else {
          setState('end');
          const timeout = setTimeout(() => setState('none'), 750);
          onCleanup(() => clearTimeout(timeout));
        }
      },
      { defer: true }
    )
  );

  return (
    <Show when={getState() !== 'none'}>
      <div
        class={clsx(
          'fixed z-50 h-0.5 w-screen origin-left bg-sky-600 md:h-[3px]',
          getState() === 'start' && 'scale-x-0',
          getState() === 'loading' && 'scale-x-75 duration-[3s] ease-linear',
          getState() === 'end' &&
            'opacity-0 [transition:transform_.5s_ease-in,opacity_.5s_linear_.25s]'
        )}
        role="status"
        aria-label="Route is changed"
      />
    </Show>
  );
}
