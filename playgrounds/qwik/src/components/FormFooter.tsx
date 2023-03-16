import { Fragment } from '@builder.io/qwik';
import { type ActionStore, Form } from '@builder.io/qwik-city';
import { type FormStore, reset } from '@modular-forms/qwik';
import { ActionButton } from './ActionButton';

type FormFooterProps = {
  of: FormStore<any, any, any>;
  resetAction?: ActionStore<void, Record<string, any>>;
  form?: string;
};

/**
 * Form footer with buttons to reset and submit the form.
 */
export function FormFooter({
  of: formStore,
  resetAction,
  form,
}: FormFooterProps) {
  const ResetForm = resetAction ? Form : Fragment;
  return (
    <footer class="flex space-x-6 px-8 md:space-x-8 lg:hidden">
      <ActionButton
        variant="primary"
        label="Submit"
        type="submit"
        form={form}
      />
      <ResetForm action={resetAction!}>
        <ActionButton
          variant="secondary"
          label="Reset"
          type={resetAction ? 'submit' : 'button'}
          preventdefault:click
          onClick$={() => reset(formStore)}
        />
      </ResetForm>
    </footer>
  );
}
