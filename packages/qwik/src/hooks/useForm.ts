import type { JSX } from '@builder.io/qwik/jsx-runtime';
import {
  Field,
  type FieldProps,
  Form,
  type FormProps,
  type FieldArrayProps,
  FieldArray,
} from '../components';
import type {
  FieldArrayPath,
  FieldPath,
  FieldValues,
  FormOptions,
  FormStore,
} from '../types';
import { useFormStore } from './useFormStore';

/**
 * Creates and returns the store of the form as well as a linked Form, Field
 * and FieldArray component in a tuple.
 *
 * @param options The form options.
 *
 * @returns The store and component tuple.
 */
export function useForm<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>
>(
  options: FormOptions<TFieldValues>
): [
  FormStore<TFieldValues, TFieldName, TFieldArrayName>,
  (
    props: Omit<FormProps<TFieldValues, TFieldName, TFieldArrayName>, 'of'>
  ) => JSX.Element,
  <
    TFieldName extends FieldPath<TFieldValues>,
    TFieldArrayName extends FieldArrayPath<TFieldValues>
  >(
    props: Omit<FieldProps<TFieldValues, TFieldName, TFieldArrayName>, 'of'>
  ) => JSX.Element,
  <
    TFieldName extends FieldPath<TFieldValues>,
    TFieldArrayName extends FieldArrayPath<TFieldValues>
  >(
    props: Omit<
      FieldArrayProps<TFieldValues, TFieldName, TFieldArrayName>,
      'of'
    >
  ) => JSX.Element
] {
  // Use form store
  const form = useFormStore(options);

  return [
    // Form store
    form,

    // Form component
    (props: Omit<FormProps<TFieldValues, TFieldName, TFieldArrayName>, 'of'>) =>
      Form({ of: form, ...props }),

    // Field component
    <
      TFieldName extends FieldPath<TFieldValues>,
      TFieldArrayName extends FieldArrayPath<TFieldValues>
    >(
      props: Omit<FieldProps<TFieldValues, TFieldName, TFieldArrayName>, 'of'>
    ) => Field({ of: form, ...props }),

    // Field array component
    <
      TFieldName extends FieldPath<TFieldValues>,
      TFieldArrayName extends FieldArrayPath<TFieldValues>
    >(
      props: Omit<
        FieldArrayProps<TFieldValues, TFieldName, TFieldArrayName>,
        'of'
      >
    ) => FieldArray({ of: form, ...props }),
  ];
}
