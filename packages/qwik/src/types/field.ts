import type {
  NoSerialize,
  PropFunction,
  QRL,
  QwikChangeEvent,
  QwikFocusEvent,
} from '@builder.io/qwik';
import type { FieldPath, FieldPathValue } from './path';

/**
 * Value type of a field.
 */
export type FieldValue =
  | string
  | string[]
  | number
  | boolean
  | null
  | undefined
  | NoSerialize<File>
  | NoSerialize<FileList>;

/**
 * Value type of the form fields.
 */
export type FieldValues = {
  [name: string]: FieldValue | FieldValue[] | FieldValues | FieldValues[];
};

/**
 * HTML element type of a field.
 */
export type FieldElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

/**
 * Function type to validate a field.
 */
export type ValidateField<TFieldValue> = QRL<
  (value: TFieldValue | undefined) => string | Promise<string>
>;

/**
 * Value type ot the field store.
 *
 * Notice: The initial value is used for resetting and may only be changed
 * during this process. It does not move when a field is moved. The start
 * value, on the other hand, is used to determine whether the field is dirty
 * and moves with it.
 */
export type FieldStore<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
> = {
  internal: {
    initialValue: FieldPathValue<TFieldValues, TFieldName>;
    startValue: FieldPathValue<TFieldValues, TFieldName>;
    validate: ValidateField<FieldPathValue<TFieldValues, TFieldName>>[];
    elements: FieldElement[];
    consumers: number[];
  };
  name: TFieldName;
  value: FieldPathValue<TFieldValues, TFieldName>;
  error: string;
  active: boolean;
  touched: boolean;
  dirty: boolean;
};

/**
 * Value type of the field element props.
 */
export type FieldElementProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
> = {
  name: TFieldName;
  autoFocus: boolean;
  ref: PropFunction<(element: Element) => void>;
  onInput$: PropFunction<(event: Event, element: FieldElement) => void>;
  onChange$: PropFunction<
    (event: QwikChangeEvent<FieldElement>, element: FieldElement) => void
  >;
  onBlur$: PropFunction<
    (event: QwikFocusEvent<FieldElement>, element: FieldElement) => void
  >;
};

/**
 * Value type of the internal raw field state.
 */
export type RawFieldState<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
> = {
  startValue: FieldPathValue<TFieldValues, TFieldName>;
  value: FieldPathValue<TFieldValues, TFieldName>;
  error: string;
  active: boolean;
  touched: boolean;
  dirty: boolean;
};
