import clsx from 'clsx';
import { JSX, Show } from 'solid-js';
import { Spinner } from './Spinner';
import { DefaultButtonProps, UnstyledButton } from './UnstyledButton';

type SystemIconProps = DefaultButtonProps & {
  class?: string;
  label: string;
  icon?: (props: JSX.SvgSVGAttributes<SVGSVGElement>) => JSX.Element;
  children?: JSX.Element;
  loading?: boolean;
};

/**
 * System icon that is used for navigation, to confirm form entries or perform
 * individual actions.
 */
export function SystemIcon(props: SystemIconProps) {
  return (
    <UnstyledButton
      {...props}
      class={clsx(
        'focus-ring box-content flex h-5 w-5 justify-center rounded-lg p-2 transition-colors hover:text-slate-900 dark:hover:text-slate-200 md:h-[22px] md:w-[22px] lg:h-6 lg:w-6',
        props.class
      )}
      aria-label={props.label}
    >
      {() => (
        <Show
          when={props.loading}
          fallback={props.icon ? <props.icon class="h-full" /> : props.children}
        >
          <Spinner label={`${props.label} is loading`} />
        </Show>
      )}
    </UnstyledButton>
  );
}
