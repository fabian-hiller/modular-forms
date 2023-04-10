import { FieldValues, Maybe, ValidateField } from '@modular-forms/shared';
import { JSX, splitProps } from 'solid-js';
import { useField } from '../primitives';
import {
  FieldPath,
  FieldPathValue,
  FieldState,
  FieldValue,
  FormState,
} from '../types';

export type FieldProps<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldName extends FieldPath<TFieldValues>
> = {
  of: FormState<TFieldValues>;
  name: TFieldName;
  initialValue?: [FieldPathValue<TFieldValues, TFieldName>];
  validate?:
    | ValidateField<Maybe<FieldPathValue<TFieldValues, TFieldName>>>
    | ValidateField<Maybe<FieldPathValue<TFieldValues, TFieldName>>>[];
  keepActive?: boolean;
  keepState?: boolean;
  children: (field: FieldState<TFieldValues, TFieldName>) => JSX.Element;
};

/**
 * Wrapper component that sets up a form field and provides its reactive
 * properties and state.
 */
export function Field<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldName extends FieldPath<TFieldValues>
>(props: FieldProps<TFieldValues, TFieldName>): JSX.Element {
  // Split props between local and options
  const [local, options] = splitProps(props, ['of', 'name', 'children']);

  // Return children as render function with useField()
  return <>{local.children(useField(local.of, local.name, options))}</>;
}
