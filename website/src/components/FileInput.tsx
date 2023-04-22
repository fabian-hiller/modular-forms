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
      <div
        class={clsx(
          'relative flex min-h-[96px] w-full items-center justify-center rounded-2xl border-[3px] border-dashed p-8 text-center focus-within:ring-4 md:min-h-[112px] md:text-lg lg:min-h-[128px] lg:p-10 lg:text-xl',
          !getFiles().length && 'text-slate-500',
          props.error
            ? 'border-red-500/25 focus-within:border-red-500/50 focus-within:ring-red-500/10 hover:border-red-500/40 dark:border-red-400/25 dark:focus-within:border-red-400/50 dark:focus-within:ring-red-400/10 dark:hover:border-red-400/40'
            : 'border-slate-200 focus-within:border-sky-500/50 focus-within:ring-sky-500/10 hover:border-slate-300 dark:border-slate-800 dark:focus-within:border-sky-400/50 dark:focus-within:ring-sky-400/10 dark:hover:border-slate-700'
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
      </div>
      <InputError name={props.name} error={props.error} />
    </div>
  );
}
