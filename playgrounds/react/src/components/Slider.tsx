import { ReadonlySignal } from '@preact/signals-react';
import clsx from 'clsx';
import { ChangeEventHandler, FocusEventHandler, forwardRef, Ref } from 'react';
import { InputError } from './InputError';
import { InputLabel } from './InputLabel';

type SliderProps = {
  name: string;
  value: ReadonlySignal<number | undefined>;
  ref: Ref<HTMLInputElement>;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur: FocusEventHandler<HTMLInputElement>;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  className?: string;
  label?: string;
  error?: ReadonlySignal<string>;
};

/**
 * Range slider that allows users to select predefined numbers. Various
 * decorations can be displayed in or around the field to communicate the
 * entry requirements.
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, value, error, ...props }, ref) => {
    const { name, required } = props;
    return (
      <div className={clsx('px-8 lg:px-10', className)}>
        <InputLabel name={name} label={label} required={required} />
        <input
          {...props}
          ref={ref}
          className="w-full"
          type="range"
          id={name}
          value={value.value || ''}
          aria-invalid={!!error}
          aria-errormessage={`${name}-error`}
        />
        <InputError name={name} error={error} />
      </div>
    );
  }
);
