import type { JSX } from '@builder.io/qwik/jsx-runtime';
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
] {
  // Use form store
  const form = useFormStore<TFieldValues, TResponseData>(options);

  // Return form store and linked components
  return [
    form,
    {
      Form: (
        props: Omit<FormProps<TFieldValues, TResponseData>, 'of' | 'action'>
      ) => Form({ of: form, action: options.action, ...props }),
      Field: <TFieldName extends FieldPath<TFieldValues>>(
        props: FieldPathValue<
          TFieldValues,
          TFieldName
        > extends MaybeValue<string>
          ? PartialKey<
              Omit<FieldProps<TFieldValues, TResponseData, TFieldName>, 'of'>,
              'type'
            >
          : Omit<FieldProps<TFieldValues, TResponseData, TFieldName>, 'of'>
      ) =>
        Field({ of: form, ...props } as FieldProps<
          TFieldValues,
          TResponseData,
          TFieldName
        >),
      FieldArray: <TFieldArrayName extends FieldArrayPath<TFieldValues>>(
        props: Omit<
          FieldArrayProps<TFieldValues, TResponseData, TFieldArrayName>,
          'of'
        >
      ) => FieldArray({ of: form, ...props }),
    },
  ];
}
