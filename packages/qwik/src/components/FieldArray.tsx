import type { QRL } from '@builder.io/qwik';
import type { JSX } from '@builder.io/qwik/jsx-runtime';
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
  ) => JSX.Element;
  validate?: Maybe<MaybeArray<QRL<ValidateFieldArray<number[]>>>>;
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
}: FieldArrayProps<TFieldValues, TResponseData, TFieldArrayName>): JSX.Element {
  // Get store of specified field
  const fieldArray = getFieldArrayStore(props.of, name)!;

  return (
    <Lifecycle key={name} store={fieldArray} {...props}>
      {children(fieldArray)}
    </Lifecycle>
  );
}
