import { makeEventListener } from '@solid-primitives/event-listener';
import { isClient } from '@solid-primitives/utils';
import { createEffect, createSignal, For } from 'solid-js';
import { A, useLocation } from 'solid-start';

type TabsProps = {
  items: string[];
};

/**
 * Tabs organize content into multiple sections and allow users to navigate
 * between them.
 */
export function Tabs(props: TabsProps) {
  // Create active element and indicator style signal
  const [getActiveElement, setActiveElement] =
    createSignal<HTMLAnchorElement>();
  const [getIndicatorStyle, setIndicatorStyle] = createSignal<{
    left: string;
    width: string;
  }>();

  /**
   * Updates the indicator style position.
   */
  const updateIndicatorStyle = () =>
    setIndicatorStyle({
      left: `${getActiveElement()?.offsetLeft || 0}px`,
      width: `${getActiveElement()?.offsetWidth || 0}px`,
    });

  // Update indicator style when active element changes
  createEffect(updateIndicatorStyle);

  // Update indicator style when window size change
  if (isClient) {
    makeEventListener(window, 'resize', updateIndicatorStyle);
  }

  return (
    <div class="scrollbar-none flex overflow-x-auto px-8">
      <div class="relative flex-1 border-b-2 border-b-slate-200 dark:border-b-slate-800">
        <nav class="flex space-x-8 lg:space-x-14">
          <For each={props.items}>
            {(item) => (
              <A
                class="block pb-4 lg:text-lg"
                inactiveClass="hover:text-slate-900 dark:hover:text-slate-200"
                activeClass="text-sky-600 dark:text-sky-400"
                href={item.toLowerCase().replace(/ /g, '-')}
                ref={(element) =>
                  element.href.endsWith(useLocation().pathname) &&
                  setActiveElement(element)
                }
              >
                {item}
              </A>
            )}
          </For>
        </nav>
        <div
          class="absolute -bottom-0.5 m-0 h-0.5 rounded bg-sky-600 duration-200 dark:bg-sky-400"
          style={getIndicatorStyle()}
        />
      </div>
    </div>
  );
}
