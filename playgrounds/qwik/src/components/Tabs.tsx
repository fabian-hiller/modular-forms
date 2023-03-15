import { $, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import clsx from 'clsx';

type TabsProps = {
  items: string[];
};

/**
 * Tabs organize content into multiple sections and allow users to navigate
 * between them.
 */
export const Tabs = component$((props: TabsProps) => {
  // Use loaction
  const loaction = useLocation();

  // Use navigation element and indicator style signal
  const navElement = useSignal<HTMLElement>();
  const indicatorStyle = useSignal<{
    left: string;
    width: string;
  }>();

  /**
   * Updates the indicator style position.
   */
  const updateIndicatorStyle = $(() => {
    // Get active navigation element by pathname and href
    const activeElement = [...navElement.value!.children].find(
      (e) => (e as HTMLAnchorElement).pathname === loaction.url.pathname
    ) as HTMLAnchorElement | undefined;

    // Update indicator style to active element or reset it to undefined
    indicatorStyle.value = activeElement
      ? {
          left: `${activeElement.offsetLeft || 0}px`,
          width: `${activeElement.offsetWidth || 0}px`,
        }
      : undefined;
  });

  // Update indicator style when active element changes
  useVisibleTask$(({ track }) => {
    track(() => loaction.url.pathname);
    updateIndicatorStyle();
  });

  return (
    <div class="scrollbar-none flex scroll-px-8 overflow-x-auto scroll-smooth px-8">
      <div class="relative flex-1 border-b-2 border-b-slate-200 dark:border-b-slate-800">
        <nav class="flex space-x-8 lg:space-x-14" ref={navElement}>
          {props.items.map((item) => {
            const href = `/${item.toLowerCase().replace(/ /g, '-')}/`;
            return (
              <Link
                key={href}
                class={clsx(
                  'block pb-4 lg:text-lg',
                  href === loaction.url.pathname
                    ? 'text-sky-600 dark:text-sky-400'
                    : 'hover:text-slate-900 dark:hover:text-slate-200'
                )}
                href={href}
                // TODO: Enable once issue #3223 is fixed
                // onClick$={(_, element) =>
                //   element.scrollIntoView({
                //     block: "nearest",
                //     inline: "center",
                //   })
                // }
              >
                {item}
              </Link>
            );
          })}
        </nav>
        <div
          window:onResize$={updateIndicatorStyle}
          class="absolute -bottom-0.5 m-0 h-0.5 rounded bg-sky-600 duration-200 dark:bg-sky-400"
          style={indicatorStyle.value}
        />
      </div>
    </div>
  );
});
