import clsx from 'clsx';
import { JSX, splitProps } from 'solid-js';
import { InputError } from './InputError';

type CheckboxProps = {
  ref: (element: HTMLInputElement) => void;
  name: string;
  value?: string;
  checked?: boolean;
  onInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
  onChange: JSX.EventHandler<HTMLInputElement, Event>;
  onBlur: JSX.EventHandler<HTMLInputElement, FocusEvent>;
  required?: boolean;
  class?: string;
  label: string;
  error?: string;
  padding?: 'none';
};

/**
 * Checkbox that allows users to select an option. The label next to the
 * checkbox describes the selection option.
 */
export function Checkbox(props: CheckboxProps) {
  const [, inputProps] = splitProps(props, [
    'class',
    'value',
    'label',
    'error',
    'padding',
  ]);
  return (
    <div class={clsx(!props.padding && 'px-8 lg:px-10', props.class)}>
      <label class="flex select-none space-x-4 font-medium md:text-lg lg:text-xl">
        <input
          {...inputProps}
          class="mt-1 h-4 w-4 cursor-pointer lg:mt-1 lg:h-5 lg:w-5"
          type="checkbox"
          id={props.name}
          value={props.value || ''}
          checked={props.checked}
          aria-invalid={!!props.error}
          aria-errormessage={`${props.name}-error`}
        />
        <span>{props.label}</span>{' '}
        {props.required && (
          <span class="ml-1 text-red-600 dark:text-red-400">*</span>
        )}
      </label>
      <InputError name={props.name} error={props.error} />
    </div>
  );
}
