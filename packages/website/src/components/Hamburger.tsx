import clsx from 'clsx';
import { For, JSX } from 'solid-js';

type HamburgerProps = {
  active: boolean;
  onClick: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
};

/**
 * Animated hamburger icon that turns into a close icon when active.
 */
export function Hamburger(props: HamburgerProps) {
  return (
    <button
      class={clsx('group p-4 lg:hidden', !props.active && 'rotate-180')}
      onClick={props.onClick}
      aria-expanded={props.active}
      aria-label={`${props.active ? 'Close' : 'Open'} main menu`}
      aria-controls="main-menu"
    >
      <div class="relative flex h-5 w-5 items-center justify-center md:h-[22px] md:w-[22px]">
        <For each={[...Array(3).keys()]}>
          {(index) => (
            <div
              class={clsx(
                'absolute h-[1.5px] w-full rounded-full bg-slate-600 transition group-hover:bg-slate-900 dark:bg-slate-400 dark:group-hover:bg-slate-200',
                index === 1 && props.active && 'opacity-0',
                index === 0 &&
                  (props.active ? '-rotate-45' : '-translate-y-1.5'),
                index === 2 && (props.active ? 'rotate-45' : 'translate-y-1.5')
              )}
            />
          )}
        </For>
      </div>
    </button>
  );
}
