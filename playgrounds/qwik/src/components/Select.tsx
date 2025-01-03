import { component$, type QRL, useSignal, useTask$ } from '@builder.io/qwik';
import clsx from 'clsx';
import { AngleDownIcon } from '~/icons';
import { InputError } from './InputError';
import { InputLabel } from './InputLabel';

type SelectProps<T> = {
  ref: QRL<(element: HTMLSelectElement) => void>;
  name: string;
  value: T | T[] | null | undefined;
  onInput$: (event: Event, element: HTMLSelectElement) => void;
  onChange$: (event: Event, element: HTMLSelectElement) => void;
  onBlur$: (event: Event, element: HTMLSelectElement) => void;
  options: { label: string; value: T }[];
  multiple?: boolean;
  size?: number;
  placeholder?: string;
  required?: boolean;
  class?: string;
  label?: string;
  error?: string;
};

/**
 * Select field that allows users to select predefined values. Various
 * decorations can be displayed in or around the field to communicate the
 * entry requirements.
 */
export const Select = component$(
  ({ value, options, label, error, ...props }: SelectProps<string | number>) => {
    const { name, required, multiple, placeholder } = props;

    // Create computed value of selected values
    const values = useSignal<(string | number)[]>();
    useTask$(({ track }) => {
      track(() => value);
      values.value = Array.isArray(value)
        ? value
        : value && (typeof value === 'string' || typeof value === 'number')
        ? [value]
        : [];
    });

    return (
      <div class={clsx('px-8 lg:px-10', props.class)}>
        <InputLabel name={name} label={label} required={required} />
        <div class="relative flex items-center">
          <select
            {...props}
            class={clsx(
              'w-full appearance-none space-y-2 rounded-2xl border-2 bg-transparent px-5 outline-none md:text-lg lg:space-y-3 lg:px-6 lg:text-xl',
              error
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
