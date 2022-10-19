import { Outlet } from 'solid-start';
import { Navigation, NavItemProps } from './Navigation';
import { SideBar } from './SideBar';

type DocsLayoutProps = {
  items: NavItemProps[];
};

/**
 * Provides the layout for the documentation pages.
 */
export function DocsLayout(props: DocsLayoutProps) {
  return (
    <main class="flex w-full max-w-screen-xl flex-1 flex-col-reverse self-center lg:flex-row">
      <SideBar>
        <Navigation items={props.items} />
      </SideBar>
      <article class="flex-1 py-12 md:py-20 lg:w-px lg:py-32 lg:pl-9">
        <Outlet />
      </article>
    </main>
  );
}
