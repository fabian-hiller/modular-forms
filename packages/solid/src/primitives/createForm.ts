import { mergeProps, type JSX } from 'solid-js';
import type { FormProps, FieldProps, FieldArrayProps } from '../components';
import { Form, Field, FieldArray } from '../components';
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
  TResponseData extends ResponseData = undefined
>(
  options?: FormOptions<TFieldValues>
): [
  FormStore<TFieldValues, TResponseData>,
  {
    Form: (
      props: Omit<FormProps<TFieldValues, TResponseData>, 'of'>
    ) => JSX.Element;
    Field: <TFieldName extends FieldPath<TFieldValues>>(
      props: FieldPathValue<TFieldValues, TFieldName> extends MaybeValue<string>
        ? PartialKey<
            Omit<FieldProps<TFieldValues, TResponseData, TFieldName>, 'of'>,
            'type'
          >
        : Omit<FieldProps<TFieldValues, TResponseData, TFieldName>, 'of'>
    ) => JSX.Element;
    FieldArray: <TFieldArrayName extends FieldArrayPath<TFieldValues>>(
      props: Omit<
        FieldArrayProps<TFieldValues, TResponseData, TFieldArrayName>,
        'of'
      >
    ) => JSX.Element;
  }
];

export function createForm(options?: FormOptions<FieldValues>): [
  FormStore<FieldValues, ResponseData>,
  {
    Form: (
      props: Omit<FormProps<FieldValues, ResponseData>, 'of'>
    ) => JSX.Element;
    Field: (
      props: Omit<FieldProps<FieldValues, ResponseData, string>, 'of'>
    ) => JSX.Element;
    FieldArray: (
      props: Omit<FieldArrayProps<FieldValues, ResponseData, string>, 'of'>
    ) => JSX.Element;
  }
] {
  // Create form store
  const form = createFormStore<FieldValues, ResponseData>(options);

  // Return form store and linked components
  return [
    form,
    {
      Form: (
        props
        // eslint-disable-next-line solid/reactivity
      ) => Form(mergeProps({ of: form }, props)),
      Field: (props) =>
        Field(
          // eslint-disable-next-line solid/reactivity
          mergeProps({ of: form }, props)
        ),
      FieldArray: (
        props
        // eslint-disable-next-line solid/reactivity
      ) => FieldArray(mergeProps({ of: form }, props)),
    },
  ];
}
