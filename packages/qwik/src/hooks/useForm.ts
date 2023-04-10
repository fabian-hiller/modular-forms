import type { JSX } from '@builder.io/qwik/jsx-runtime';
import type {
  FieldArrayPath,
  FieldPath,
  FieldPathValue,
  FieldValues,
  MaybeValue,
  PartialKey,
  ResponseData,
} from '@modular-forms/shared';
import {
  Field,
  type FieldProps,
  Form,
  type FormProps,
  type FieldArrayProps,
  FieldArray,
} from '../components';
import type { FieldValue, FormOptions, FormStore } from '../types';
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
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData = undefined,
  TFieldName extends FieldPath<TFieldValues, FieldValue> = FieldPath<
    TFieldValues,
    FieldValue
  >,
  TFieldArrayName extends FieldArrayPath<
    TFieldValues,
    FieldValue
  > = FieldArrayPath<TFieldValues, FieldValue>
>(
  options: FormOptions<TFieldValues, TResponseData>
): [
  FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  {
    Form: (
      props: Omit<
        FormProps<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
        'of' | 'action'
      >
    ) => JSX.Element;
    Field: <TFieldName extends FieldPath<TFieldValues, FieldValue>>(
      props: FieldPathValue<
        TFieldValues,
        TFieldName,
        FieldValue
      > extends MaybeValue<string>
        ? PartialKey<
            Omit<
              FieldProps<
                TFieldValues,
                TResponseData,
                TFieldName,
                TFieldArrayName
              >,
              'of'
            >,
            'type'
          >
        : Omit<
            FieldProps<
              TFieldValues,
              TResponseData,
              TFieldName,
              TFieldArrayName
            >,
            'of'
          >
    ) => JSX.Element;
    FieldArray: <
      TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
    >(
      props: Omit<
        FieldArrayProps<
          TFieldValues,
          TResponseData,
          TFieldName,
          TFieldArrayName
        >,
        'of'
      >
    ) => JSX.Element;
  }
] {
  // Use form store
  const form = useFormStore(options);

  // Return form store and linked components
  return [
    form,
    {
      Form: (
        props: Omit<
          FormProps<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
          'of' | 'action'
        >
      ) => Form({ of: form, action: options.action, ...props }),
      Field: <TFieldName extends FieldPath<TFieldValues, FieldValue>>(
        props: FieldPathValue<
          TFieldValues,
          TFieldName,
          FieldValue
        > extends MaybeValue<string>
          ? PartialKey<
              Omit<
                FieldProps<
                  TFieldValues,
                  TResponseData,
                  TFieldName,
                  TFieldArrayName
                >,
                'of'
              >,
              'type'
            >
          : Omit<
              FieldProps<
                TFieldValues,
                TResponseData,
                TFieldName,
                TFieldArrayName
              >,
              'of'
            >
      ) =>
        Field({ of: form, ...props } as FieldProps<
          TFieldValues,
          TResponseData,
          TFieldName,
          TFieldArrayName
        >),
      FieldArray: <
        TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
      >(
        props: Omit<
          FieldArrayProps<
            TFieldValues,
            TResponseData,
            TFieldName,
            TFieldArrayName
          >,
          'of'
        >
      ) => FieldArray({ of: form, ...props }),
    },
  ];
}
