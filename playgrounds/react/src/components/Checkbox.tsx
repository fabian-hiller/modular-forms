import { ReadonlySignal } from '@preact/signals-react';
import clsx from 'clsx';
import { ChangeEventHandler, FocusEventHandler, forwardRef, Ref } from 'react';
import { InputError } from './InputError';

type CheckboxProps = {
  name: string;
  value?: string;
  checked: ReadonlySignal<boolean | undefined>;
  ref: Ref<HTMLInputElement>;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur: FocusEventHandler<HTMLInputElement>;
  required?: boolean;
  className?: string;
  label: string;
  error?: ReadonlySignal<string>;
};

/**
 * Checkbox that allows users to select an option. The label next to the
 * checkbox describes the selection option.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, checked, error, className, ...props }, ref) => {
    const { name, required } = props;
    return (
      <div className={clsx('px-8 lg:px-10', className)}>
        <label className="flex select-none space-x-4 font-medium md:text-lg lg:text-xl">
          <input
            {...props}
            ref={ref}
            className="mt-1 h-4 w-4 cursor-pointer lg:mt-1 lg:h-5 lg:w-5"
            type="checkbox"
            id={name}
            checked={!!checked.value}
            aria-invalid={!!error}
            aria-errormessage={`${name}-error`}
          />
          <span>{label}</span>{' '}
          {required && (
            <span className="ml-1 text-red-600 dark:text-red-400">*</span>
          )}
        </label>
        <InputError name={name} error={error} />
      </div>
    );
  }
);
