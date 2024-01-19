import { component$, type QRL } from '@builder.io/qwik';
import clsx from 'clsx';
import { InputError } from './InputError';

type CheckboxProps = {
  ref: QRL<(element: HTMLInputElement) => void>;
  name: string;
  value?: string;
  checked?: boolean;
  onInput$: (event: Event, element: HTMLInputElement) => void;
  onChange$: (event: Event, element: HTMLInputElement) => void;
  onBlur$: (event: Event, element: HTMLInputElement) => void;
  required?: boolean;
  class?: string;
  label: string;
  error?: string;
};

/**
 * Checkbox that allows users to select an option. The label next to the
 * checkbox describes the selection option.
 */
export const Checkbox = component$(
  ({ label, error, class: className, ...props }: CheckboxProps) => {
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
          {required && (
            <span class="ml-1 text-red-600 dark:text-red-400">*</span>
          )}
        </label>
        <InputError name={name} error={error} />
      </div>
    );
  }
);
