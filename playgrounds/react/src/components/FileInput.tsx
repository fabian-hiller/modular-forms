import { ReadonlySignal, useComputed } from '@preact/signals-react';
import clsx from 'clsx';
import { ChangeEventHandler, FocusEventHandler, forwardRef, Ref } from 'react';
import { InputError } from './InputError';
import { InputLabel } from './InputLabel';

type FileInputProps = {
  name: string;
  value: ReadonlySignal<File | File[] | null | undefined>;
  ref: Ref<HTMLInputElement>;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur: FocusEventHandler<HTMLInputElement>;
  accept?: string;
  required?: boolean;
  multiple?: boolean;
  className?: string;
  label?: string;
  error?: ReadonlySignal<string>;
};

/**
 * File input field that users can click or drag files into. Various
 * decorations can be displayed in or around the field to communicate the entry
 * requirements.
 */
export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, value, label, error, ...props }, ref) => {
    const { name, required, multiple } = props;

    // Create computed value of selected files
    const files = useComputed(() =>
      value.value
        ? Array.isArray(value.value)
          ? value.value
          : [value.value]
        : []
    );

    return (
      <div className={clsx('px-8 lg:px-10', className)}>
        <InputLabel name={name} label={label} required={required} />
        <label
          className={clsx(
            'relative flex min-h-[96px] w-full items-center justify-center rounded-2xl border-[3px] border-dashed border-slate-200 p-8 text-center focus-within:border-sky-600/50 hover:border-slate-300 dark:border-slate-800 dark:focus-within:border-sky-400/50 dark:hover:border-slate-700 md:min-h-[112px] md:text-lg lg:min-h-[128px] lg:p-10 lg:text-xl',
            !files.value?.length && 'text-slate-500'
          )}
        >
          {files.value?.length
            ? `Selected file${multiple ? 's' : ''}: ${files.value
                .map(({ name }) => name)
                .join(', ')}`
            : `Click or drag and drop file${multiple ? 's' : ''}`}
          <input
            {...props}
            ref={ref}
            className="absolute h-full w-full cursor-pointer opacity-0"
            type="file"
            id={name}
            aria-invalid={!!error}
            aria-errormessage={`${name}-error`}
          />
        </label>
        <InputError name={name} error={error} />
      </div>
    );
  }
);
