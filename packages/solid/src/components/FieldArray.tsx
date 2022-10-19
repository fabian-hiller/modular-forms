import { JSX, splitProps } from 'solid-js';
import { useFieldArray } from '../primitives';
import {
  FieldArrayPath,
  FieldArrayState,
  FieldValues,
  FormState,
  ValidateFieldArray,
} from '../types';

type FieldArrayProps<
  TFieldValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
> = {
  of: FormState<TFieldValues>;
  name: TFieldArrayName;
  validate?: ValidateFieldArray<number[]> | ValidateFieldArray<number[]>[];
  keepActive?: boolean;
  keepState?: boolean;
  children: (
    fieldArray: FieldArrayState<TFieldValues, TFieldArrayName>
  ) => JSX.Element;
};

/**
 * Wrapper component that provides the reactive properties and state of a form
 * field array.
 */
export function FieldArray<
  TFieldValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(props: FieldArrayProps<TFieldValues, TFieldArrayName>): JSX.Element {
  // Split props between local and options
  const [local, options] = splitProps(props, ['of', 'name', 'children']);

  // Return children as render function with useFieldArray()
  return <>{local.children(useFieldArray(local.of, local.name, options))}</>;
}
