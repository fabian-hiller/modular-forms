import type {
  FieldValues,
  ResponseData,
  FieldPath,
  FieldArrayPath,
  FieldPathValue,
  MaybeValue,
  PartialKey,
} from '@modular-forms/core';
import type { JSX } from 'solid-js/jsx-runtime';
import type { FormProps, FieldProps, FieldArrayProps } from '../components';
import { Form, Field, FieldArray } from '../components';
import type { FormOptions, FormStore } from '../types';
import { createFormStore } from './createFormStore';

/**
 * Creates and returns the store of the form as well as a linked Form, Field
 * and FieldArray component.
 *
 * @param options The form options.
 *
 * @returns The store and linked components.
 */
export function createForm<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData = undefined,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>
>(
  options?: FormOptions<TFieldValues>
): [
  FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
  {
    Form: (
      props: Omit<
        FormProps<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
        'of'
      >
    ) => JSX.Element;
    Field: (
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
    FieldArray: (
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
  // Create form store
  const form = createFormStore<
    TFieldValues,
    TResponseData,
    TFieldName,
    TFieldArrayName
  >(options);

  // Return form store and linked components
  return [
    form,
    {
      Form: (
        props: Omit<
          FormProps<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
          'of'
        >
      ) => Form({ of: form, ...props }),
      Field: (
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
      FieldArray: (
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
