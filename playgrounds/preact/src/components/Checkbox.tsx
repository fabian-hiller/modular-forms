import { ReadonlySignal } from '@preact/signals';
import clsx from 'clsx';
import { JSX, Ref } from 'preact';
import { InputError } from './InputError';

type CheckboxProps = {
  name: string;
  value?: string;
  checked: ReadonlySignal<boolean | undefined>;
  ref: Ref<HTMLInputElement>;
  onInput: JSX.GenericEventHandler<HTMLInputElement>;
  onChange: JSX.GenericEventHandler<HTMLInputElement>;
  onBlur: JSX.FocusEventHandler<HTMLInputElement>;
  required?: boolean;
  class?: string;
  label: string;
  error?: ReadonlySignal<string>;
};

/**
 * Checkbox that allows users to select an option. The label next to the
 * checkbox describes the selection option.
 */
export function Checkbox({
  label,
  error,
  class: className,
  ...props
}: CheckboxProps) {
  const { name, required } = props;
  return (
    <div class={clsx('px-8 lg:px-10', className)}>
      <label class="flex select-none space-x-4 font-medium md:text-lg lg:text-xl">
        <input
          {...props}
          class="mt-1 h-4 w-4 cursor-pointer lg:mt-1 lg:h-5 lg:w-5"
          type="checkbox"
          id={name}
          aria-invalid={!!error}
          aria-errormessage={`${name}-error`}
        />
        <span>{label}</span>{' '}
        {required && <span class="ml-1 text-red-600 dark:text-red-400">*</span>}
      </label>
      <InputError name={name} error={error} />
    </div>
  );
}
