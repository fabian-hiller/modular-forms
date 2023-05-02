import { ReadonlySignal, useComputed } from '@preact/signals';
import clsx from 'clsx';
import { Ref } from 'preact';
import { forwardRef } from 'preact/compat';
import { JSX } from 'preact/jsx-runtime';
import { AngleDownIcon } from '../icons';
import { InputError } from './InputError';
import { InputLabel } from './InputLabel';

type SelectProps = {
  name: string;
  value: ReadonlySignal<string | string[] | null | undefined>;
  ref: Ref<HTMLSelectElement>;
  onInput: JSX.GenericEventHandler<HTMLSelectElement>;
  onChange: JSX.GenericEventHandler<HTMLSelectElement>;
  onBlur: JSX.FocusEventHandler<HTMLSelectElement>;
  options: { label: string; value: string }[];
  multiple?: boolean;
  size?: number;
  placeholder?: string;
  required?: boolean;
  class?: string;
  label?: string;
  error?: ReadonlySignal<string>;
};

/**
 * Select field that allows users to select predefined values. Various
 * decorations can be displayed in or around the field to communicate the
 * entry requirements.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ value, options, label, error, ...props }, ref) => {
    const { name, required, multiple, placeholder } = props;

    // Create computed value of selected values
    const values = useComputed(() =>
      Array.isArray(value.value)
        ? value.value
        : value.value && typeof value.value === 'string'
        ? [value.value]
        : []
    );

    return (
      <div class={clsx('px-8 lg:px-10', props.class)}>
        <InputLabel name={name} label={label} required={required} />
        <div class="relative flex items-center">
          <select
            {...props}
            ref={ref}
            class={clsx(
              'w-full appearance-none space-y-2 rounded-2xl border-2 bg-transparent px-5 outline-none md:text-lg lg:space-y-3 lg:px-6 lg:text-xl',
              error?.value
                ? 'border-red-600/50 dark:border-red-400/50'
                : 'border-slate-200 hover:border-slate-300 focus:border-sky-600/50 dark:border-slate-800 dark:hover:border-slate-700 dark:focus:border-sky-400/50',
              multiple ? 'py-5' : 'h-14 md:h-16 lg:h-[70px]',
              placeholder && !values.value?.length && 'text-slate-500'
            )}
            id={name}
            aria-invalid={!!error}
            aria-errormessage={`${name}-error`}
          >
            <option value="" disabled hidden selected={!value}>
              {placeholder}
            </option>
            {options.map(({ label, value }) => (
              <option
                key={value}
                value={value}
                selected={values.value?.includes(value)}
              >
                {label}
              </option>
            ))}
          </select>
          {!multiple && (
            <AngleDownIcon class="pointer-events-none absolute right-6 h-5 lg:right-8 lg:h-6" />
          )}
        </div>
        <InputError name={name} error={error} />
      </div>
    );
  }
);
