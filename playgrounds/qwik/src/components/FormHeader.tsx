import { Fragment } from '@builder.io/qwik';
import { type ActionStore, Form } from '@builder.io/qwik-city';
import { reset, type FormStore } from '@modular-forms/qwik';
import { ActionButton } from './ActionButton';

type FormHeaderProps = {
  of: FormStore<any, any, any, any>;
  heading: string;
  resetAction?: ActionStore<void, Record<string, any>>;
  form?: string;
};

/**
 * Form header with heading and buttons to reset and submit the form.
 */
export function FormHeader({
  of: formStore,
  heading,
  resetAction,
  form,
}: FormHeaderProps) {
  const ResetForm = resetAction ? Form : Fragment;
  return (
    <header class="flex items-center justify-between px-8 lg:px-10">
      <h1 class="text-2xl text-slate-900 dark:text-slate-200 md:text-3xl lg:text-4xl">
        {heading}
      </h1>
      <div class="hidden lg:flex lg:space-x-8">
        <ResetForm action={resetAction!}>
          <ActionButton
            variant="secondary"
            label="Reset"
            type={resetAction ? 'submit' : 'button'}
            preventdefault:click
            onClick$={() => reset(formStore)}
          />
        </ResetForm>
        <ActionButton
          variant="primary"
          label="Submit"
          type="submit"
          form={form}
        />
      </div>
    </header>
  );
}
