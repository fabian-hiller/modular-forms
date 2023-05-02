import { ReadonlySignal } from '@preact/signals';
import clsx from 'clsx';
import { JSX, Ref } from 'preact';
import { forwardRef } from 'preact/compat';
import { InputError } from './InputError';
import { InputLabel } from './InputLabel';

type SliderProps = {
  name: string;
  value: ReadonlySignal<number | undefined>;
  ref: Ref<HTMLInputElement>;
  onInput: JSX.GenericEventHandler<HTMLInputElement>;
  onChange: JSX.GenericEventHandler<HTMLInputElement>;
  onBlur: JSX.FocusEventHandler<HTMLInputElement>;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  class?: string;
  label?: string;
  error?: ReadonlySignal<string>;
};

/**
 * Range slider that allows users to select predefined numbers. Various
 * decorations can be displayed in or around the field to communicate the
 * entry requirements.
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ label, error, ...props }, ref) => {
    const { name, required } = props;
    return (
      <div class={clsx('px-8 lg:px-10', props.class)}>
        <InputLabel name={name} label={label} required={required} />
        <input
          {...props}
          ref={ref}
          class="w-full"
          type="range"
          id={name}
          aria-invalid={!!error}
          aria-errormessage={`${name}-error`}
        />
        <InputError name={name} error={error} />
      </div>
    );
  }
);
