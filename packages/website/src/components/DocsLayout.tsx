import { createMemo, Show } from 'solid-js';
import { Outlet, useLocation } from 'solid-start';
import { ArrowLeftIcon, ArrowRightIcon, PenIcon } from '~/icons';
import { IconButton } from './IconButton';
import { Navigation, NavItemProps } from './Navigation';
import { SideBar } from './SideBar';

type DocsLayoutProps = {
  items: NavItemProps[];
  lowerCase?: boolean;
};

/**
 * Provides the layout for the documentation pages.
 */
export function DocsLayout(props: DocsLayoutProps) {
  // Use location
  const location = useLocation();

  // Create navigation items
  const getNavItems = createMemo(() =>
    props.items.reduce<string[]>(
      (list, { items }) => [
        ...list,
        ...items.map(
          (item) =>
            `${location.pathname
              .split('/')
              .slice(0, -1)
              .join('/')}/${(props.lowerCase
              ? item.toLowerCase()
              : item
            ).replace(/ /g, '-')}`
        ),
      ],
      []
    )
  );

  // Get current navigation index
  const getNavIndex = createMemo(() =>
    getNavItems().indexOf(location.pathname)
  );

  // Get previous and next page
  const getPrevPage = createMemo(() => getNavItems()[getNavIndex() - 1]);
  const getNextPage = createMemo(() => getNavItems()[getNavIndex() + 1]);

  return (
    <main class="flex w-full max-w-screen-xl flex-1 flex-col-reverse self-center lg:flex-row">
      {/* Side bar navigation */}
      <SideBar
        buttons={
          <NavButtons prevPage={getPrevPage()} nextPage={getNextPage()} />
        }
      >
        <Navigation {...props} />
      </SideBar>

      <div class="relative flex-1 py-12 md:py-20 lg:w-px lg:py-32 lg:pl-9">
        {/* Navigation buttons */}
        <div class="hidden lg:absolute lg:right-0 lg:flex lg:space-x-6">
          <NavButtons prevPage={getPrevPage()} nextPage={getNextPage()} />
        </div>

        {/* Article */}
        <article>
          <Outlet />
        </article>

        <div class="mt-10 flex justify-between px-8 md:mt-12 lg:mt-14 lg:px-10">
          {/* GitHub buttton */}
          <IconButton
            variant="secondary"
            type="link"
            href={`https://github.com/fabian-hiller/modular-forms/blob/main/packages/website/src/routes${location.pathname}.mdx`}
            target="_blank"
            label="Edit page"
            icon={PenIcon}
          />

          {/* Next page button */}
          <Show when={getNextPage()} keyed>
            {(nextPage) => (
              <div class="hidden lg:block">
                <IconButton
                  variant="secondary"
                  type="link"
                  href={nextPage}
                  label="Next page"
                  icon={ArrowRightIcon}
                  align="right"
                />
              </div>
            )}
          </Show>
        </div>
      </div>
    </main>
  );
}

type NavButtonsProps = {
  prevPage?: string;
  nextPage?: string;
};

/**
 * Buttons to navigate to the previous or next page.
 */
export function NavButtons(props: NavButtonsProps) {
  return (
    <>
      <Show when={props.prevPage} fallback={<div class="w-10" />}>
        <IconButton
          variant="secondary"
          type="link"
          href={props.prevPage!}
          label="Previous page"
          icon={ArrowLeftIcon}
          hideLabel
        />
      </Show>
      <Show when={props.nextPage} fallback={<div class="w-10" />}>
        <IconButton
          variant="secondary"
          type="link"
          href={props.nextPage!}
          label="Next page"
          icon={ArrowRightIcon}
          hideLabel
        />
      </Show>
    </>
  );
}
