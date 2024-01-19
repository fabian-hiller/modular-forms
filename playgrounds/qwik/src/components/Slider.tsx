import { component$, type QRL } from '@builder.io/qwik';
import clsx from 'clsx';
import { InputError } from './InputError';
import { InputLabel } from './InputLabel';

type SliderProps = {
  ref: QRL<(element: HTMLInputElement) => void>;
  name: string;
  value?: number;
  onInput$: (event: Event, element: HTMLInputElement) => void;
  onChange$: (event: Event, element: HTMLInputElement) => void;
  onBlur$: (event: Event, element: HTMLInputElement) => void;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  class?: string;
  label?: string;
  error?: string;
};

/**
 * Range slider that allows users to select predefined numbers. Various
 * decorations can be displayed in or around the field to communicate the
 * entry requirements.
 */
export const Slider = component$(({ label, error, ...props }: SliderProps) => {
  const { name, required } = props;
  return (
    <div class={clsx('px-8 lg:px-10', props.class)}>
      <InputLabel name={name} label={label} required={required} />
      <input
        {...props}
        class="w-full"
        type="range"
        id={name}
        aria-invalid={!!error}
        aria-errormessage={`${name}-error`}
      />
      <InputError name={name} error={error} />
    </div>
  );
});
