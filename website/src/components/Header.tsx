import { makeEventListener } from '@solid-primitives/event-listener';
import { isClient } from '@solid-primitives/utils';
import clsx from 'clsx';
import { createSignal, For } from 'solid-js';
import { A } from 'solid-start';
import { getFramework } from '~/contexts';
import { GitHubIcon, LogoIcon } from '~/icons';
import { createFocusTrap } from '~/primitives';
import { DocSearch } from './DocSearch';
import { Hamburger } from './Hamburger';
import { ThemeToggle } from './ThemeToggle';

/**
 * Sticky header with logo, main navigation and theme toogle.
 */
export function Header() {
  // Create menu open, window scrolled and element signal
  const [getMenuOpen, setMenuOpen] = createSignal(false);
  const [getWindowScrolled, setWindowScrolled] = createSignal(false);
  const [getElement, setElement] = createSignal<HTMLElement>();

  // Create focus trap for menu
  createFocusTrap(getElement, getMenuOpen);

  if (isClient) {
    // Close menu when window width is changed to desktop
    makeEventListener(window, 'resize', () =>
      setMenuOpen((menuOpen) => (window.innerWidth >= 1024 ? false : menuOpen))
    );

    // Changes scroll state when window is scrolled
    makeEventListener(window, 'scroll', () => {
      setWindowScrolled(window.scrollY > 0);
    });
  }

  return (
    <header
      class={clsx(
        'sticky top-0 h-14 md:h-16 lg:h-[70px]',
        getMenuOpen() ? 'z-30' : 'z-20'
      )}
      ref={setElement}
    >
      {/* Header content */}
      <div
        class={clsx(
          'flex h-full items-center justify-between border-b-2 px-2 backdrop-blur duration-200 lg:px-4',
          getMenuOpen()
            ? 'bg-white dark:bg-gray-900'
            : 'bg-white/90 dark:bg-gray-900/90',
          getWindowScrolled()
            ? 'border-b-slate-200 dark:border-b-slate-800'
            : 'border-b-transparent'
        )}
      >
        {/* Website logo */}
        <div class="-m-1 overflow-hidden p-1 lg:w-56">
          <A
            class="focus-ring inline-flex w-full items-center rounded-lg p-2 font-medium transition-colors hover:text-slate-900 dark:hover:text-slate-200 md:w-auto md:text-lg lg:text-xl"
            href="/"
            onClick={() => setMenuOpen(false)}
          >
            <LogoIcon class="mr-2 h-6 shrink-0 md:h-7 lg:h-8" />
            <div class="truncate">Modular Forms</div>
          </A>
        </div>

        {/* Icon buttons (mobile) */}
        <div class="flex items-center space-x-4 lg:hidden">
          <GitHubLink />
          <ThemeToggle />
          <DocSearch />
          <Hamburger
            active={getMenuOpen()}
            onClick={() => setMenuOpen((menuOpen) => !menuOpen)}
          />
        </div>

        {/* Main menu */}
        <nav
          class={clsx(
            'absolute left-0 top-full flex max-h-[60vh] w-full origin-top -translate-y-0.5 flex-col overflow-y-auto border-b-2 border-b-slate-200 bg-white pb-8 pt-4 duration-200 dark:border-b-slate-800 dark:bg-gray-900 lg:static lg:top-auto lg:w-auto lg:translate-y-0 lg:flex-row lg:space-x-10 lg:overflow-visible lg:border-none lg:bg-transparent lg:p-0 lg:dark:bg-transparent',
            !getMenuOpen() && 'invisible scale-y-0 lg:visible lg:scale-y-100'
          )}
          id="main-menu"
        >
          <For
            each={[
              { label: 'Guides', href: `/${getFramework()}/guides` },
              { label: 'API reference', href: `/${getFramework()}/api` },
              { label: 'Playground', href: `/${getFramework()}/playground` },
            ]}
          >
            {({ label, href }) => (
              <A
                class="focus-ring mx-4 rounded-lg px-4 py-3 text-lg transition-colors hover:text-slate-900 dark:hover:text-slate-200 lg:px-3 lg:py-2 lg:text-[17px] lg:font-medium"
                activeClass="docsearch-lvl0 text-slate-900 dark:text-slate-200"
                href={href}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </A>
            )}
          </For>
        </nav>

        {/* Icon buttons (desktop) */}
        <div class="hidden lg:flex lg:w-56 lg:items-center lg:justify-end lg:space-x-6">
          <DocSearch />
          <ThemeToggle />
          <div
            class="lg:block lg:h-5 lg:w-0.5 lg:rounded-full lg:bg-slate-200 lg:dark:bg-slate-800"
            role="separator"
          />
          <GitHubLink />
        </div>
      </div>

      {/* Background overlay */}
      <div
        class={clsx(
          'absolute top-0 -z-10 h-screen w-full bg-black/10 dark:bg-black/20 lg:hidden',
          getMenuOpen() ? 'duration-300' : 'invisible opacity-0 duration-75'
        )}
        onClick={() => setMenuOpen(false)}
      />
    </header>
  );
}

/**
 * GitHub icon pointing to our repository.
 */
function GitHubLink() {
  return (
    <a
      class="focus-ring box-content h-5 w-5 rounded-lg p-2 transition-colors hover:text-slate-900 dark:hover:text-slate-200 md:h-[22px] md:w-[22px] lg:h-6 lg:w-6"
      href={import.meta.env.VITE_GITHUB_URL}
      target="_blank"
      rel="noreferrer"
    >
      <GitHubIcon class="h-full" />
    </a>
  );
}
