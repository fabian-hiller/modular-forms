import type { JSXOutput, QRL } from '@builder.io/qwik';
import { getFieldArrayStore } from '../utils';
import type {
  FieldArrayPath,
  FieldArrayStore,
  FieldValues,
  FormStore,
  Maybe,
  MaybeArray,
  ResponseData,
  ValidateFieldArray,
  ValidationMode,
} from '../types';
import { Lifecycle } from './Lifecycle';

/**
 * Value type of the field array props.
 */
export type FieldArrayProps<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
> = {
  of: FormStore<TFieldValues, TResponseData>;
  name: TFieldArrayName;
  children: (
    store: FieldArrayStore<TFieldValues, TFieldArrayName>
  ) => JSXOutput;
  validate?: Maybe<MaybeArray<QRL<ValidateFieldArray<number[]>>>>;
  validateOn?: Maybe<ValidationMode>;
  revalidateOn?: Maybe<ValidationMode>;
  keepActive?: Maybe<boolean>;
  keepState?: Maybe<boolean>;
};

/**
 * Headless field array that provides reactive properties and state.
 */
export function FieldArray<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>({
  children,
  name,
  ...props
}: FieldArrayProps<TFieldValues, TResponseData, TFieldArrayName>): JSXOutput {
  // Get store of specified field
  const fieldArray = getFieldArrayStore(props.of, name)!;

  return (
    <Lifecycle key={name} store={fieldArray} {...props}>
      {children(fieldArray)}
    </Lifecycle>
  );
}
