import clsx from 'clsx';
import { JSX, splitProps } from 'solid-js';
import { InputError } from './InputError';
import { InputLabel } from './InputLabel';

type SliderProps = {
  ref: (element: HTMLInputElement) => void;
  name: string;
  value?: number;
  onInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
  onChange: JSX.EventHandler<HTMLInputElement, Event>;
  onBlur: JSX.EventHandler<HTMLInputElement, FocusEvent>;
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
export function Slider(props: SliderProps) {
  const [, inputProps] = splitProps(props, [
    'class',
    'value',
    'label',
    'error',
  ]);
  return (
    <div class={clsx('px-8 lg:px-10', props.class)}>
      <InputLabel
        name={props.name}
        label={props.label}
        required={props.required}
      />
      <input
        {...inputProps}
        class="w-full"
        type="range"
        id={props.name}
        value={props.value}
        aria-invalid={!!props.error}
        aria-errormessage={`${props.name}-error`}
      />
      <InputError name={props.name} error={props.error} />
    </div>
  );
}
