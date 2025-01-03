import { makeEventListener } from '@solid-primitives/event-listener';
import { isClient } from '@solid-primitives/utils';
import clsx from 'clsx';
import { createSignal, For } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { A, useLocation } from 'solid-start';
import { frameworks, getFramework, useFramework } from '~/contexts';
import {
  AngleDownIcon,
  PreactIcon,
  QwikIcon,
  ReactIcon,
  SolidIcon,
} from '~/icons';
import { createFocusTrap } from '~/primitives';
import { getFrameworkName } from '~/utils';

type FrameworkPickerProps = {
  class?: string;
};

/**
 * Allows the user to navigate between frameworks.
 */
export function FrameworkPicker(props: FrameworkPickerProps) {
  // Use framework
  const [, setFramework] = useFramework();

  // Create open and element signal
  const [getOpen, setOpen] = createSignal(false);
  const [getElement, setElement] = createSignal<HTMLDivElement>();

  // Create focus trap for picker
  createFocusTrap(getElement, getOpen);

  // Close picker when clicked outside
  if (isClient) {
    makeEventListener(document, 'click', (event) => {
      if (getOpen() && !getElement()!.contains(event.target as Node)) {
        setOpen(false);
      }
    });
  }

  /**
   * Returns the icon of the framework.
   */
  const getIcon = (framework: string) =>
    ({
      solid: SolidIcon,
      qwik: QwikIcon,
      preact: PreactIcon,
      react: ReactIcon,
    })[framework];

  /**
   * Returns the pathname to the framework.
   */
  const getPathname = (framework: string) => {
    const pathList = useLocation().pathname.split('/');
    pathList[1] = framework;
    return pathList.join('/');
  };

  return (
    <div class={clsx('relative', props.class)} ref={setElement}>
      <button
        class="flex h-12 w-full items-center justify-between rounded-xl border-2 border-slate-200 px-3.5 outline-none hover:border-slate-300 focus:border-sky-600/50 focus:ring-4 focus:ring-sky-600/10 dark:border-slate-800 dark:hover:border-slate-700 dark:focus:border-sky-400/50 dark:focus:ring-sky-400/10"
        type="button"
        onClick={() => setOpen((open) => !open)}
      >
        <div class="flex items-center">
          <Dynamic
            class="mr-2.5 h-[22px]"
            component={getIcon(getFramework())}
          />
          <div class="text-slate-900 dark:text-slate-200">
            {getFrameworkName(getFramework())}
          </div>
        </div>
        <AngleDownIcon class="h-4" />
      </button>
      <nav
        class={clsx(
          'absolute z-30 w-full origin-top rounded-xl border-2 border-slate-200 bg-white/90 py-2 backdrop-blur duration-200 hover:border-slate-300 dark:border-slate-800 dark:bg-gray-900/90 dark:hover:border-slate-700',
          getOpen() ? 'translate-y-2' : 'invisible scale-y-75 opacity-0'
        )}
        aria-hidden={!getOpen()}
      >
        <For
          each={frameworks.filter((framework) => framework !== getFramework())}
        >
          {(framework) => (
            <A
              class="focus-ring flex items-center space-x-2.5 rounded-xl px-3.5 py-2 hover:text-slate-900 dark:hover:text-slate-200"
              href={getPathname(framework)}
              onClick={() => {
                setOpen(false);
                setFramework(framework);
              }}
            >
              <Dynamic class="mr-2.5 h-[22px]" component={getIcon(framework)} />
              {getFrameworkName(framework)}
            </A>
          )}
        </For>
      </nav>
    </div>
  );
}
