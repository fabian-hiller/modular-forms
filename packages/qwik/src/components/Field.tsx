import type { JSXOutput, QRL } from '@builder.io/qwik';
import { $ } from '@builder.io/qwik';
import { isServer } from '@builder.io/qwik/build';
import { getElementInput, getFieldStore, handleFieldEvent } from '../utils';
import type {
  FieldElement,
  FieldEvent,
  FieldPath,
  FieldPathValue,
  FieldStore,
  FieldType,
  FieldValues,
  FormStore,
  Maybe,
  MaybeArray,
  MaybeValue,
  PartialKey,
  ResponseData,
  TransformField,
  ValidateField,
} from '../types';
import { Lifecycle } from './Lifecycle';

/**
 * Value type of the field element props.
 */
export type FieldElementProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
> = {
  name: TFieldName;
  autoFocus: boolean;
  ref: QRL<(element: FieldElement) => void>;
  onInput$: QRL<(event: FieldEvent, element: FieldElement) => void>;
  onChange$: QRL<(event: FieldEvent, element: FieldElement) => void>;
  onBlur$: QRL<(event: FieldEvent, element: FieldElement) => void>;
};

/**
 * Value type of the field props.
 */
export type FieldProps<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>
> = {
  of: FormStore<TFieldValues, TResponseData>;
  name: TFieldName;
  type: FieldType<FieldPathValue<TFieldValues, TFieldName>>;
  children: (
    store: FieldStore<TFieldValues, TFieldName>,
    props: FieldElementProps<TFieldValues, TFieldName>
  ) => JSXOutput;
  validate?: Maybe<
    MaybeArray<QRL<ValidateField<FieldPathValue<TFieldValues, TFieldName>>>>
  >;
  transform?: Maybe<
    MaybeArray<QRL<TransformField<FieldPathValue<TFieldValues, TFieldName>>>>
  >;
  keepActive?: Maybe<boolean>;
  keepState?: Maybe<boolean>;
  key?: Maybe<string | number>;
};

/**
 * Headless form field that provides reactive properties and state.
 */
export function Field<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>
>({
  children,
  name,
  type,
  ...props
}: FieldPathValue<TFieldValues, TFieldName> extends MaybeValue<string>
  ? PartialKey<FieldProps<TFieldValues, TResponseData, TFieldName>, 'type'>
  : FieldProps<TFieldValues, TResponseData, TFieldName>): JSXOutput;

export function Field({
  children,
  name,
  type,
  ...props
}:
  | PartialKey<FieldProps<FieldValues, ResponseData, string>, 'type'>
  | FieldProps<FieldValues, ResponseData, string>): JSXOutput {
  // Destructure props
  const { of: form } = props;

  // Get store of specified field
  const field = getFieldStore(form, name)!;

  return (
    <Lifecycle key={name} store={field} {...props}>
      {children(field, {
        name,
        autoFocus: isServer && !!field.error,
        ref: $((element: FieldElement) => {
          field.internal.elements.push(element);
        }),
        onInput$: $((event: FieldEvent, element: FieldElement) => {
          handleFieldEvent(
            form,
            field,
            name,
            event,
            element,
            ['touched', 'input'],
            getElementInput(element, field, type)
          );
        }),
        onChange$: $((event: FieldEvent, element: FieldElement) => {
          handleFieldEvent(form, field, name, event, element, ['change']);
        }),
        onBlur$: $((event: FieldEvent, element: FieldElement) => {
          handleFieldEvent(form, field, name, event, element, [
            'touched',

            'blur',
          ]);
        }),
      })}
    </Lifecycle>
  );
}
