import clsx from 'clsx';
import { Show } from 'solid-js';
import { Spinner } from './Spinner';
import { UnstyledButton, DefaultButtonProps } from './UnstyledButton';

type ActionButtonProps = DefaultButtonProps & {
  variant: 'primary' | 'secondary';
  label: string;
};

/**
 * Button that is used for navigation, to confirm form entries or perform
 * individual actions.
 */
export function ActionButton(props: ActionButtonProps) {
  return (
    <UnstyledButton
      class={clsx(
        'relative flex items-center justify-center rounded-2xl px-5 py-2.5 font-medium no-underline transition-colors md:text-lg lg:rounded-2xl lg:px-6 lg:py-3 lg:text-xl',
        props.variant === 'primary' &&
          'bg-sky-600 text-white hover:bg-sky-600/80 dark:bg-sky-400 dark:text-gray-900 dark:hover:bg-sky-400/80',
        props.variant === 'secondary' &&
          'bg-sky-600/10 text-sky-600 hover:bg-sky-600/20 dark:bg-sky-400/10 dark:text-sky-400 dark:hover:bg-sky-400/20'
      )}
      {...props}
    >
      {(renderProps) => (
        <Show when={renderProps.loading} fallback={props.label}>
          <Spinner label={`${props.label} is loading`} />
        </Show>
      )}
    </UnstyledButton>
  );
}
