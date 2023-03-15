import { component$ } from '@builder.io/qwik';
import { useFrozenText } from '~/hooks';
import { Expandable } from './Expandable';

type InputErrorProps = {
  name: string;
  error?: string;
};

/**
 * Input error that tells the user what to do to fix the problem.
 */
export const InputError = component$(({ name, error }: InputErrorProps) => {
  // Freeze error while element collapses to prevent UI from jumping
  const frozenError = useFrozenText(
    {
      get value() {
        return error;
      },
    },
    200
  );

  return (
    <Expandable expanded={!!error}>
      <div
        class="pt-4 text-sm text-red-500 dark:text-red-400 md:text-base lg:pt-5 lg:text-lg"
        id={`${name}-error`}
      >
        {frozenError.value}
      </div>
    </Expandable>
  );
});
