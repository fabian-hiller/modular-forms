import { reset, type FormStore } from '@modular-forms/preact';
import { ActionButton } from './ActionButton';

type FormHeaderProps = {
  of: FormStore<any, any>;
  heading: string;
};

/**
 * Form header with heading and buttons to reset and submit the form.
 */
export function FormHeader({ of: form, heading }: FormHeaderProps) {
  return (
    <header class="flex items-center justify-between px-8 lg:px-10">
      <h1 class="text-2xl text-slate-900 dark:text-slate-200 md:text-3xl lg:text-4xl">
        {heading}
      </h1>
      <div class="hidden lg:flex lg:space-x-8">
        <ActionButton
          variant="secondary"
          label="Reset"
          type="button"
          onClick={() => reset(form)}
        />
        <ActionButton variant="primary" label="Submit" type="submit" />
      </div>
    </header>
  );
}
