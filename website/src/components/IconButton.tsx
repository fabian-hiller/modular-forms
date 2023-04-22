import clsx from 'clsx';
import { JSX, Show } from 'solid-js';
import { Spinner } from './Spinner';
import { UnstyledButton, DefaultButtonProps } from './UnstyledButton';

type IconButtonProps = DefaultButtonProps & {
  variant: 'primary' | 'secondary';
  label: string;
  icon: (props: JSX.SvgSVGAttributes<SVGSVGElement>) => JSX.Element;
  align?: 'right';
  hideLabel?: boolean;
};

/**
 * Button with an icon that is used for navigation, to confirm form entries or
 * perform individual actions.
 */
export function IconButton(props: IconButtonProps) {
  return (
    <UnstyledButton
      class={clsx(
        'group flex items-center gap-x-4 md:gap-x-6 lg:gap-x-8',
        props.align === 'right' && 'flex-row-reverse'
      )}
      {...props}
    >
      {(renderProps) => (
        <>
          <div
            class={clsx(
              'flex h-10 w-10 items-center justify-center rounded-xl transition-colors',
              props.variant === 'primary' &&
                'bg-sky-600 text-white group-hover:bg-sky-600/80 dark:bg-sky-400 dark:text-gray-900 dark:group-hover:bg-sky-400/80',
              props.variant === 'secondary' &&
                'bg-sky-600/10 text-sky-600 group-hover:bg-sky-600/20 dark:bg-sky-400/10 dark:text-sky-400 dark:group-hover:bg-sky-400/20'
            )}
          >
            <Show
              when={renderProps.loading}
              fallback={<props.icon class="h-[18px]" />}
            >
              <Spinner label={`${props.label} is loading`} />
            </Show>
          </div>
          <div
            class={clsx(
              'transition-colors group-hover:text-slate-700 dark:group-hover:text-slate-200 md:text-lg lg:text-xl',
              props.hideLabel && 'hidden'
            )}
          >
            {props.label}
          </div>
        </>
      )}
    </UnstyledButton>
  );
}
