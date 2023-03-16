import {
  $,
  component$,
  type PropFunction,
  Slot,
  useSignal,
} from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import clsx from 'clsx';
import { Spinner } from './Spinner';

type LinkProps = {
  type: 'link';
  href: string;
  download?: boolean | string;
  target?: '_blank';
};

type ButtonProps = {
  type: 'button' | 'reset' | 'submit';
  'preventdefault:click'?: boolean;
  onClick$?: PropFunction<() => unknown>;
  loading?: boolean;
  form?: string;
};

export type DefaultButtonProps = LinkProps | ButtonProps;

type UnstyledButtonProps = DefaultButtonProps & {
  class?: string;
  'aria-label'?: string;
};

/**
 * Basic button component that contains important functionality and is used to
 * build more complex components on top of it.
 */
export const UnstyledButton = component$((props: UnstyledButtonProps) => {
  // Use loading signal
  const loading = useSignal(false);

  return (
    <>
      {/* Link button */}
      {props.type === 'link' && (
        <Link
          class={props.class}
          href={props.href}
          download={props.download}
          target={props.target}
          rel={props.target === '_blank' ? 'noreferrer' : undefined}
          aria-label={props['aria-label']}
        >
          <Slot />
        </Link>
      )}

      {/* Normal button */}
      {props.type !== 'link' && (
        <button
          type={props.type}
          class={props.class}
          form={props.form}
          disabled={loading.value}
          aria-label={props['aria-label']}
          preventdefault:click={props['preventdefault:click']}
          // Start and stop loading if function is async
          onClick$={
            props.onClick$ &&
            $(async () => {
              loading.value = true;
              await props.onClick$!();
              loading.value = false;
            })
          }
        >
          <div
            class={clsx(
              'transition-[opacity,transform,visibility] duration-200',
              loading.value || props.loading
                ? 'invisible translate-x-5 opacity-0'
                : 'visible delay-300'
            )}
          >
            <Slot />
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
      )}
    </>
  );
});
