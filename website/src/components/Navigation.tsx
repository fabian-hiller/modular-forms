import clsx from 'clsx';
import { createEffect, createMemo, createSignal, For } from 'solid-js';
import { A, useLocation } from 'solid-start';

type NavigationProps = {
  items: (NavItemProps | false)[];
  lowerCase?: boolean;
};

/**
 * Navigation list used as a secondary navigation over a certain part of the
 * website.
 */
export function Navigation(props: NavigationProps) {
  return (
    <nav class="px-8 lg:w-60 2xl:w-72">
      <ul class="space-y-9 lg:space-y-12">
        <For each={props.items.filter((item) => item) as NavItemProps[]}>
          {(item) => <NavItem {...item} lowerCase={props.lowerCase} />}
        </For>
      </ul>
    </nav>
  );
}

export type NavItemProps = {
  heading: string;
  items: (string | false)[];
  lowerCase?: boolean;
};

/**
 * Single navigation main point that displays a heading and a navigation list.
 */
function NavItem(props: NavItemProps) {
  // Use location
  const location = useLocation();

  // Create list element and indicator style signal
  const [getListElement, setListElement] = createSignal<HTMLUListElement>();
  const [getIndicatorStyle, setIndicatorStyle] = createSignal<{
    top: string;
    height: string;
  }>();

  // Update indicator style when pathname changes
  createEffect(() => {
    // Get active list element by pathname and href
    const activeElement = [...getListElement()!.children].find((e) =>
      (e.children[0] as HTMLAnchorElement).href.endsWith(location.pathname)
    ) as HTMLLIElement | undefined;

    // Update indicator style to active element or reset it to undefined
    setIndicatorStyle(
      activeElement
        ? {
            top: `${activeElement.offsetTop}px`,
            height: `${activeElement.offsetHeight}px`,
          }
        : undefined
    );
  });

  // Create memo of items
  const getItems = createMemo(() =>
    (props.items.filter((item) => item) as string[]).map((label) => ({
      slug: (props.lowerCase ? label.toLowerCase() : label).replace(/ /g, '-'),
      label,
    }))
  );

  return (
    <li class="space-y-6">
      <h4
        class={clsx(
          'text-lg font-medium text-slate-900 dark:text-slate-200',
          getItems().some(({ slug }) => location.pathname.endsWith(slug)) &&
            'docsearch-lvl1'
        )}
      >
        {props.heading}
      </h4>
      <div class="relative">
        <ul
          class="space-y-5 border-l-2 border-l-slate-200 dark:border-l-slate-800"
          ref={setListElement}
        >
          <For each={getItems()}>
            {({ slug, label }) => (
              <li>
                <A
                  class="focus-ring relative -left-0.5 block border-l-2 border-l-transparent pl-4 transition-colors hover:border-l-slate-400 focus-visible:rounded-md hover:dark:border-l-slate-600"
                  inactiveClass="hover:text-slate-800 dark:hover:text-slate-300"
                  activeClass="text-sky-600 dark:text-sky-400"
                  href={slug}
                  end
                >
                  {label}
                </A>
              </li>
            )}
          </For>
        </ul>
        <div
          class="absolute m-0 w-0.5 rounded bg-sky-600 duration-200 dark:bg-sky-400"
          style={getIndicatorStyle()}
        />
      </div>
    </li>
  );
}
