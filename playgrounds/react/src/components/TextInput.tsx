import {
  ReadonlySignal,
  useSignal,
  useSignalEffect,
} from '@preact/signals-react';
import clsx from 'clsx';
import { ChangeEventHandler, FocusEventHandler, forwardRef } from 'react';
import { InputError } from './InputError';
import { InputLabel } from './InputLabel';

type TextInputProps = {
  type: 'text' | 'email' | 'tel' | 'password' | 'url' | 'number' | 'date';
  name: string;
  value: ReadonlySignal<string | number | undefined>;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur: FocusEventHandler<HTMLInputElement>;
  placeholder?: string;
  required?: boolean;
  className?: string;
  label?: string;
  error?: ReadonlySignal<string>;
};

/**
 * Text input field that users can type into. Various decorations can be
 * displayed in or around the field to communicate the entry requirements.
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, label, value, error, ...props }, ref) => {
    const { name, required } = props;
    const input = useSignal<string | number>('');
    useSignalEffect(() => {
      if (!Number.isNaN(value.value)) {
        input.value = value.value === undefined ? '' : value.value;
      }
    });
    return (
      <div className={clsx('px-8 lg:px-10', className)}>
        <InputLabel name={name} label={label} required={required} />
        <input
          {...props}
          ref={ref}
          className={clsx(
            'h-14 w-full rounded-2xl border-2 bg-white px-5 outline-none placeholder:text-slate-500 dark:bg-gray-900 md:h-16 md:text-lg lg:h-[70px] lg:px-6 lg:text-xl',
            error?.value
              ? 'border-red-600/50 dark:border-red-400/50'
              : 'border-slate-200 hover:border-slate-300 focus:border-sky-600/50 dark:border-slate-800 dark:hover:border-slate-700 dark:focus:border-sky-400/50'
          )}
          id={name}
          value={input.value ?? ''}
          aria-invalid={!!error}
          aria-errormessage={`${name}-error`}
        />
        <InputError name={name} error={error} />
      </div>
    );
  }
);
