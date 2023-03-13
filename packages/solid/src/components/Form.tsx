import { JSX, splitProps } from 'solid-js';
import { handleSubmit } from '../methods/handleSubmit';
import { FieldValues, FormState, SubmitHandler } from '../types';

type FormProps<TFieldValues extends FieldValues> = Omit<
  JSX.FormHTMLAttributes<HTMLFormElement>,
  'onSubmit'
> & {
  of: FormState<TFieldValues>;
  onSubmit: SubmitHandler<TFieldValues>;
  keepResponse?: boolean;
  shouldActive?: boolean;
  shouldTouched?: boolean;
  shouldDirty?: boolean;
  shouldFocus?: boolean;
  children: JSX.Element;
};

/**
 * HTML form element that simplifies form submission and disables the browser's
 * default form validation.
 */
export function Form<TFieldValues extends FieldValues>(
  props: FormProps<TFieldValues>
): JSX.Element {
  // Split props between local, options and other
  const [local, options, others] = splitProps(
    props,
    ['of', 'onSubmit', 'children'],
    [
      'keepResponse',
      'shouldActive',
      'shouldTouched',
      'shouldDirty',
      'shouldFocus',
    ]
  );

  // Return HTML form element and include handleSubmit in onSubmit
  return (
    <form
      {...others}
      ref={props.of.internal.setElement}
      onSubmit={handleSubmit(local.of, local.onSubmit, options)}
      noValidate
    >
      {local.children}
    </form>
  );
}
