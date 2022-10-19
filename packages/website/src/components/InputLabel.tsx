import { Show } from 'solid-js';

type InputLabelProps = {
  name: string;
  label?: string;
  required?: boolean;
};

/**
 * Input label for a form field.
 */
export function InputLabel(props: InputLabelProps) {
  return (
    <Show when={props.label}>
      <label
        class="mb-4 inline-block font-medium md:text-lg lg:mb-5 lg:text-xl"
        for={props.name}
      >
        {props.label}{' '}
        {props.required && (
          <span class="ml-1 text-red-600 dark:text-red-400">*</span>
        )}
      </label>
    </Show>
  );
}
