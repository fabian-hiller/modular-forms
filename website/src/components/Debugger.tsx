import {
  getValues,
  FieldValue,
  FieldValues,
  FormStore,
} from '@modular-forms/solid';
import clsx from 'clsx';
import { createMemo, For, Show } from 'solid-js';
import { useLocation } from 'solid-start';
import { getFramework } from '~/contexts';
import { FrameworkPicker } from './FrameworkPicker';

type DebuggerProps = {
  of: FormStore<any, any> | undefined;
};

/**
 * Displays the current form status and values. Useful to find bugs during
 * development.
 */
export function Debugger(props: DebuggerProps) {
  // Get values of form
  const values = createMemo(() => props.of && getValues(props.of));

  // Get path of form
  const getPath = createMemo(() => useLocation().pathname.split('/').pop());

  return (
    <div class="space-y-9 px-8 lg:mx-8 lg:max-h-[60vh] lg:w-72 lg:overflow-y-auto lg:overscroll-contain lg:rounded-3xl lg:border-2 lg:border-slate-200 lg:p-10 lg:dark:border-slate-800">
      <div>
        <h3 class="text-xl font-medium text-slate-900 dark:text-slate-200">
          Debugger
        </h3>
        <FrameworkPicker class="mt-6 w-full" />
        <p class="mt-4">
          See code on{' '}
          <a
            class="text-sky-600 dark:text-sky-400"
            href={`${import.meta.env.VITE_GITHUB_PLAYGROUNDS_URL}/${
              getFramework() === 'solid'
                ? `solid/src/routes/${getPath()}.tsx`
                : `qwik/src/routes/(default)/${getPath()}/index.tsx`
            }`}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>{' '}
          or{' '}
          <a
            class="text-sky-600 dark:text-sky-400"
            href={
              getFramework() === 'solid'
                ? `${
                    import.meta.env.VITE_STACKBLITZ_SOLID_URL
                  }?file=src/routes/${getPath()}.tsx`
                : `${
                    import.meta.env.VITE_STACKBLITZ_QWIK_URL
                  }?file=src/routes/${getPath()}/index.tsx`
            }
            target="_blank"
            rel="noreferrer"
          >
            Stackblitz
          </a>
          .
        </p>
      </div>
      <div class="space-y-6">
        <h4 class="text-lg font-medium text-slate-900 dark:text-slate-200">
          Form state
        </h4>
        <ul class="space-y-5">
          <For
            each={[
              {
                label: 'Submit Count',
                value: props.of?.submitCount,
              },
              {
                label: 'Submitting',
                value: props.of?.submitting,
              },
              {
                label: 'Submitted',
                value: props.of?.submitted,
              },
              {
                label: 'Validating',
                value: props.of?.validating,
              },
              {
                label: 'Dirty',
                value: props.of?.dirty,
              },
              {
                label: 'Touched',
                value: props.of?.touched,
              },
              {
                label: 'Invalid',
                value: props.of?.invalid,
              },
            ]}
          >
            {({ label, value }) => (
              <li class="flex justify-between">
                <span>{label}:</span>
                <span
                  classList={{
                    'text-purple-600 dark:text-purple-400':
                      typeof value === 'number',
                    'text-red-600 dark:text-red-400': value === false,
                    'text-emerald-600 dark:text-emerald-400': value === true,
                  }}
                >
                  {value?.toString()}
                </span>
              </li>
            )}
          </For>
        </ul>
      </div>
      <div class="space-y-6">
        <h4 class="text-lg font-medium text-slate-900 dark:text-slate-200">
          Field values
        </h4>
        <Show
          when={Object.keys(values() || {}).length}
          fallback={<p>Wait for input...</p>}
        >
          <FieldValueList values={values()} />
        </Show>
      </div>
    </div>
  );
}

type FieldValuesProps = {
  class?: string;
  values: FieldValues | (FieldValue | FieldValues)[];
};

/**
 * Recusive component that displays individual form values.
 */
function FieldValueList(props: FieldValuesProps) {
  return (
    <ul class={clsx('space-y-5', props.class)}>
      <For each={Object.entries(props.values)}>
        {([key, value]) => (
          <li
            class={clsx({
              'flex justify-between space-x-4':
                !value ||
                typeof value !== 'object' ||
                value instanceof File ||
                value instanceof Date,
            })}
          >
            <span>{key}:</span>
            {!value ||
            typeof value !== 'object' ||
            value instanceof File ||
            value instanceof Date ? (
              <span
                class={clsx('overflow-hidden text-ellipsis whitespace-nowrap', {
                  'text-yellow-600 dark:text-amber-200':
                    typeof value === 'string',
                  'text-purple-600 dark:text-purple-400':
                    typeof value === 'number',
                  'text-red-600 dark:text-red-400': value === false,
                  'text-emerald-600 dark:text-emerald-400': value === true,
                  'text-teal-600 dark:text-teal-400': value === null,
                  'text-sky-600 dark:text-sky-400': value instanceof File,
                })}
              >
                {value instanceof File ? value.name : String(value)}
              </span>
            ) : (
              <FieldValueList class="ml-2 mt-3" values={value} />
            )}
          </li>
        )}
      </For>
    </ul>
  );
}
