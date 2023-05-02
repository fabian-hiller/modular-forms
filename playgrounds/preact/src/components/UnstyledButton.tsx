import { useSignal } from '@preact/signals';
import clsx from 'clsx';
import { ComponentChildren } from 'preact';
import { Link } from 'preact-router';
import { Spinner } from './Spinner';

type LinkProps = {
  type: 'link';
  href: string;
  download?: boolean | string;
  target?: '_blank';
};

type ButtonProps = {
  type: 'button' | 'reset' | 'submit';
  onClick?: () => unknown;
  loading?: boolean;
  form?: string;
};

export type DefaultButtonProps = LinkProps | ButtonProps;

type UnstyledButtonProps = DefaultButtonProps & {
  children: ComponentChildren;
  class?: string;
  'aria-label'?: string;
};

/**
 * Basic button component that contains important functionality and is used to
 * build more complex components on top of it.
 */
export function UnstyledButton({ children, ...props }: UnstyledButtonProps) {
  // Use loading signal
  const loading = useSignal(false);

  // Return link button
  if (props.type === 'link') {
    return (
      <Link
        {...props}
        rel={props.target === '_blank' ? 'noreferrer' : undefined}
      >
        {children}
      </Link>
    );
  }

  const { loading: _, ...buttonProps } = props;

  // Return normal button
  return (
    <button
      {...buttonProps}
      // Start and stop loading if function is async
      onClick={() => {
        const result = props.onClick?.();
        // Start and stop loading if function is async
        if (Promise.resolve(result) === result) {
          loading.value = true;
          Promise.resolve(result).then(() => {
            loading.value = false;
          });
        }
      }}
      disabled={loading.value || props.loading}
    >
      <div
        class={clsx(
          'transition-[opacity,transform,visibility] duration-200',
          loading.value || props.loading
            ? 'invisible translate-x-5 opacity-0'
            : 'visible delay-300'
        )}
      >
        {children}
      </div>
      <div
        class={clsx(
          'absolute duration-200',
          loading.value || props.loading
            ? 'visible delay-300'
            : 'invisible -translate-x-5 opacity-0'
        )}
      >
        <Spinner />
      </div>
    </button>
  );
}
