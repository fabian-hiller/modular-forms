import { ReadonlySignal } from '@preact/signals';
import { Expandable } from './Expandable';

type InputErrorProps = {
  name: string;
  error?: ReadonlySignal<string>;
};

/**
 * Input error that tells the user what to do to fix the problem.
 */
export function InputError({ name, error }: InputErrorProps) {
  return (
    <Expandable expanded={!!error?.value}>
      <div
        class="pt-4 text-sm text-red-500 dark:text-red-400 md:text-base lg:pt-5 lg:text-lg"
        id={`${name}-error`}
      >
        {error}
      </div>
    </Expandable>
  );
}
