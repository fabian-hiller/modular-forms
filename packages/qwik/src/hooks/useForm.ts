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
  TResponseData extends ResponseData = undefined,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>
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
    Field: <TFieldName extends FieldPath<TFieldValues>>(
      props: FieldPathValue<TFieldValues, TFieldName> extends MaybeValue<string>
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
    FieldArray: <TFieldArrayName extends FieldArrayPath<TFieldValues>>(
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
      Field: <TFieldName extends FieldPath<TFieldValues>>(
        props: FieldPathValue<
          TFieldValues,
          TFieldName
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
      FieldArray: <TFieldArrayName extends FieldArrayPath<TFieldValues>>(
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
