import { FormStore, reset } from '@modular-forms/solid';
import { ActionButton } from './ActionButton';

type FormFooterProps = {
  of: FormStore<any, any>;
};

/**
 * Form footer with buttons to reset and submit the form.
 */
export function FormFooter(props: FormFooterProps) {
  return (
    <footer class="flex space-x-6 px-8 md:space-x-8 lg:hidden">
      <ActionButton variant="primary" label="Submit" type="submit" />
      <ActionButton
        variant="secondary"
        label="Reset"
        type="button"
        onClick={() => reset(props.of)}
      />
    </footer>
  );
}
