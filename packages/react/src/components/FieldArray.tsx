import type { ReadonlySignal } from '@preact/signals-react';
import { type ReactNode, useMemo } from 'react';
import { useLifecycle, useLiveSignal } from '../hooks';
import type {
  FieldArrayPath,
  FieldValues,
  FormStore,
  Maybe,
  MaybeArray,
  ResponseData,
  ValidateFieldArray,
} from '../types';
import { initializeFieldArrayStore } from '../utils';

/**
 * Value type ot the field store.
 */
export type FieldArrayStore<
  TFieldValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
> = {
  name: TFieldArrayName;
  items: ReadonlySignal<number[]>;
  error: ReadonlySignal<string>;
  active: ReadonlySignal<boolean>;
  touched: ReadonlySignal<boolean>;
  dirty: ReadonlySignal<boolean>;
};

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
  ) => ReactNode;
  validate?: Maybe<MaybeArray<ValidateFieldArray<number[]>>>;
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
  ...props
}: FieldArrayProps<TFieldValues, TResponseData, TFieldArrayName>): JSX.Element {
  // Destructure props
  const { of: form, name } = props;

  // Get store of specified field array
  const fieldArray = useMemo(
    () => initializeFieldArrayStore(form, name),
    [form, name]
  );

  // Use lifecycle of field array
  useLifecycle({ ...props, store: fieldArray });

  // Create readonly live signals
  // https://github.com/preactjs/signals/issues/361
  const items = useLiveSignal(fieldArray.items);
  const error = useLiveSignal(fieldArray.error);
  const active = useLiveSignal(fieldArray.active);
  const touched = useLiveSignal(fieldArray.touched);
  const dirty = useLiveSignal(fieldArray.dirty);

  return (
    <>
      {children(
        useMemo(
          () => ({
            name,
            items,
            error,
            active,
            touched,
            dirty,
          }),
          // eslint-disable-next-line react-hooks/exhaustive-deps
          [name]
        )
      )}
    </>
  );
}
