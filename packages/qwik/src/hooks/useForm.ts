import type { JSXOutput } from '@builder.io/qwik';
import type { FieldProps, FormProps, FieldArrayProps } from '../components';
import { Field, Form, FieldArray } from '../components';
import type {
  FieldArrayPath,
  FieldPath,
  FieldPathValue,
  FieldValues,
  FormOptions,
  FormStore,
  MaybeValue,
  PartialKey,
  ResponseData,
} from '../types';
import { useFormStore } from './useFormStore';

/**
 * Creates and returns the store of the form as well as a linked Form, Field
 * and FieldArray component.
 *
 * @param options The form options.
 *
 * @returns The store and linked components.
 */
export function useForm<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData = undefined
>(
  options: FormOptions<TFieldValues, TResponseData>
): [
  FormStore<TFieldValues, TResponseData>,
  {
    Form: (
      props: Omit<FormProps<TFieldValues, TResponseData>, 'of' | 'action'>
    ) => JSXOutput;
    Field: <TFieldName extends FieldPath<TFieldValues>>(
      props: FieldPathValue<TFieldValues, TFieldName> extends MaybeValue<string>
        ? PartialKey<
            Omit<FieldProps<TFieldValues, TResponseData, TFieldName>, 'of'>,
            'type'
          >
        : Omit<FieldProps<TFieldValues, TResponseData, TFieldName>, 'of'>
    ) => JSXOutput;
    FieldArray: <TFieldArrayName extends FieldArrayPath<TFieldValues>>(
      props: Omit<
        FieldArrayProps<TFieldValues, TResponseData, TFieldArrayName>,
        'of'
      >
    ) => JSXOutput;
  }
];

export function useForm(options: FormOptions<FieldValues, ResponseData>): [
  FormStore<FieldValues, ResponseData>,
  {
    Form: (
      props: Omit<FormProps<FieldValues, ResponseData>, 'of' | 'action'>
    ) => JSXOutput;
    Field: (
      props: Omit<FieldProps<FieldValues, ResponseData, string>, 'of'>
    ) => JSXOutput;
    FieldArray: (
      props: Omit<FieldArrayProps<FieldValues, ResponseData, string>, 'of'>
    ) => JSXOutput;
  }
] {
  // Use form store
  const form = useFormStore(options);

  // Return form store and linked components
  return [
    form,
    {
      Form: (props) => Form({ of: form, action: options.action, ...props }),
      Field: (props) => Field({ of: form, ...props }),
      FieldArray: (props) => FieldArray({ of: form, ...props }),
    },
  ];
}
