import clsx from 'clsx';
import { createMemo, JSX, Show, splitProps } from 'solid-js';
import { InputError } from './InputError';
import { InputLabel } from './InputLabel';

type FileInputProps = {
  ref: (element: HTMLInputElement) => void;
  name: string;
  value?: File[] | File;
  onInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
  onChange: JSX.EventHandler<HTMLInputElement, Event>;
  onBlur: JSX.EventHandler<HTMLInputElement, FocusEvent>;
  accept?: string;
  required?: boolean;
  multiple?: boolean;
  class?: string;
  label?: string;
  error?: string;
};

/**
 * File input field that users can click or drag files into. Various
 * decorations can be displayed in or around the field to communicate the entry
 * requirements.
 */
export function FileInput(props: FileInputProps) {
  // Split input element props
  const [, inputProps] = splitProps(props, [
    'class',
    'value',
    'label',
    'error',
  ]);

  // Create file list
  const getFiles = createMemo(() =>
    props.value
      ? Array.isArray(props.value)
        ? props.value
        : [props.value]
      : []
  );

  return (
    <div class={clsx('px-8 lg:px-10', props.class)}>
      <InputLabel
        name={props.name}
        label={props.label}
        required={props.required}
      />
      <label
        class={clsx(
          'relative flex min-h-[96px] w-full items-center justify-center rounded-2xl border-[3px] border-dashed border-slate-200 p-8 text-center focus-within:border-sky-600/50 hover:border-slate-300 dark:border-slate-800 dark:focus-within:border-sky-400/50 dark:hover:border-slate-700 md:min-h-[112px] md:text-lg lg:min-h-[128px] lg:p-10 lg:text-xl',
          !getFiles().length && 'text-slate-500'
        )}
      >
        <Show
          when={getFiles().length}
          fallback={<>Click or drag and drop file{props.multiple && 's'}</>}
        >
          Selected file{props.multiple && 's'}:{' '}
          {getFiles()
            .map(({ name }) => name)
            .join(', ')}
        </Show>
        <input
          {...inputProps}
          class="absolute h-full w-full cursor-pointer opacity-0"
          type="file"
          id={props.name}
          aria-invalid={!!props.error}
          aria-errormessage={`${props.name}-error`}
        />
      </label>
      <InputError name={props.name} error={props.error} />
    </div>
  );
}
