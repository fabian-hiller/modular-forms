import type {
  FieldValues,
  MaybePromise,
  ResponseData,
} from '@modular-forms/core';
import { getValues, handleSubmit } from '@modular-forms/core';
import { batch, type JSX, splitProps, untrack } from 'solid-js';
import type { FormStore } from '../types';

/**
 * Value type of the submit event object.
 */
export type SubmitEvent = Event & {
  submitter: HTMLElement;
} & {
  currentTarget: HTMLFormElement;
  target: Element;
};

/**
 * Function type to handle the submission of the form.
 */
export type SubmitHandler<TFieldValues extends FieldValues> = (
  values: TFieldValues,
  event: SubmitEvent
) => MaybePromise<any>;

/**
 * Value type of the form properties.
 */
export type FormProps<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
> = Omit<JSX.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> & {
  of: FormStore<TFieldValues, TResponseData>;
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
export function Form<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
>(props: FormProps<TFieldValues, TResponseData>): JSX.Element {
  // Split props between local, options and other
  const [local, options, other] = splitProps(
    props,
    ['of', 'onSubmit'],
    [
      'keepResponse',
      'shouldActive',
      'shouldTouched',
      'shouldDirty',
      'shouldFocus',
    ]
  );

  return (
    <form
      {...other}
      noValidate
      ref={props.of.element}
      onSubmit={async (event: SubmitEvent) => {
        // Prevent default behavior of browser
        event.preventDefault();

        // Destructure local props
        // eslint-disable-next-line solid/reactivity
        const { of: form, onSubmit } = local;

        // Handle submission and execute user action
        await handleSubmit(
          { batch, untrack },
          form,
          () => onSubmit(getValues(form, options) as TFieldValues, event),
          options
        );
      }}
    />
  );
}
