import { component$ } from '@builder.io/qwik';
import { type FormStore, reset } from '@modular-forms/qwik';
import { ActionButton } from './ActionButton';

type FormFooterProps = {
  of: FormStore<any, any, any>;
};

/**
 * Form footer with buttons to reset and submit the form.
 */
export const FormFooter = component$(({ of: form }: FormFooterProps) => (
  <footer class="flex space-x-6 px-8 md:space-x-8 lg:hidden">
    <ActionButton variant="primary" label="Submit" type="submit" />
    <ActionButton
      variant="secondary"
      label="Reset"
      type="button"
      onClick$={() => reset(form)}
    />
  </footer>
));
