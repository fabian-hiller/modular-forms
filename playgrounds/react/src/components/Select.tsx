import { ReadonlySignal } from '@preact/signals-react';
import clsx from 'clsx';
import { ChangeEventHandler, FocusEventHandler, forwardRef, Ref } from 'react';
import { AngleDownIcon } from '../icons';
import { InputError } from './InputError';
import { InputLabel } from './InputLabel';

type SelectProps<T> = {
  name: string;
  value: ReadonlySignal<T | T[] | null | undefined>;
  ref: Ref<HTMLSelectElement>;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  onBlur: FocusEventHandler<HTMLSelectElement>;
  options: { label: string; value: T }[];
  multiple?: boolean;
  size?: number;
  placeholder?: string;
  required?: boolean;
  className?: string;
  label?: string;
  error?: ReadonlySignal<string>;
};

/**
 * Select field that allows users to select predefined values. Various
 * decorations can be displayed in or around the field to communicate the
 * entry requirements.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps<string | number>>(
  ({ className, value, options, label, error, ...props }, ref) => {
    const { name, required, multiple, placeholder } = props;
    // Create computed value of selected values
    const values = Array.isArray(value.value)
        ? value.value
      : (typeof value === 'string' || typeof value === 'number')
        ? [value]
        : [];


    return (
      <div className={clsx('px-8 lg:px-10', className)}>
        <InputLabel name={name} label={label} required={required} />
        <div className="relative flex items-center">
          <select
            {...props}
            ref={ref}
            className={clsx(
              'w-full appearance-none space-y-2 rounded-2xl border-2 bg-transparent px-5 outline-none md:text-lg lg:space-y-3 lg:px-6 lg:text-xl',
              error?.value
                ? 'border-red-600/50 dark:border-red-400/50'
                : 'border-slate-200 hover:border-slate-300 focus:border-sky-600/50 dark:border-slate-800 dark:hover:border-slate-700 dark:focus:border-sky-400/50',
              multiple ? 'py-5' : 'h-14 md:h-16 lg:h-[70px]',
              placeholder && !value.value && 'text-slate-500'
            )}
            id={name}
            aria-invalid={!!error}
            aria-errormessage={`${name}-error`}
          >
            <option value="" disabled hidden>
              {placeholder}
            </option>
            {options.map(({ label, value }) => (
              <option key={value} value={value} selected={values?.includes(value)}>
                {label}
              </option>
            ))}
          </select>
          {!multiple && (
            <AngleDownIcon className="pointer-events-none absolute right-6 h-5 lg:right-8 lg:h-6" />
          )}
        </div>
        <InputError name={name} error={error} />
      </div>
    );
  }
);
