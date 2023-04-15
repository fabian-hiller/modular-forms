import type {
  FieldArrayPath,
  FieldPath,
  FieldPathValue,
  FieldValues,
  MaybeValue,
  PartialKey,
  ResponseData,
} from '@modular-forms/core';
import { mergeProps } from 'solid-js';
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
  FormStore<
    TFieldValues,
    TResponseData,
    FieldPath<TFieldValues>,
    FieldArrayPath<TFieldValues>
  >,
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
  // Create form store
  const form = createFormStore(options);

  // Return form store and linked components
  return [
    form,
    {
      Form: (
        props: Omit<
          FormProps<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
          'of' | 'action'
        >
      ) => Form({ of: form, ...props }),
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
        // FIXME: Improve types and remove `as unknown`
        Field(
          mergeProps({ of: form }, props) as unknown as FieldProps<
            TFieldValues,
            TResponseData,
            TFieldName,
            TFieldArrayName
          >
        ),
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
      ) =>
        // FIXME: Improve types and remove `as unknown`
        FieldArray(
          mergeProps({ of: form }, props) as unknown as FieldArrayProps<
            TFieldValues,
            TResponseData,
            TFieldName,
            TFieldArrayName
          >
        ),
    },
  ];
}
