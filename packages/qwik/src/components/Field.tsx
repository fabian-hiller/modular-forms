import type { QRL } from '@builder.io/qwik';
import { $ } from '@builder.io/qwik';
import { isServer } from '@builder.io/qwik/build';
import type { JSX } from '@builder.io/qwik/jsx-runtime';
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
  ref: (element: Element) => void;
  onInput$: (event: FieldEvent, element: FieldElement) => void;
  onChange$: (event: FieldEvent, element: FieldElement) => void;
  onBlur$: (event: FieldEvent, element: FieldElement) => void;
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
  ) => JSX.Element;
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
  : FieldProps<TFieldValues, TResponseData, TFieldName>): JSX.Element {
  // Destructure props
  const { of: form } = props;

  // Get store of specified field
  const field = getFieldStore(form, name)!;

  return (
    // @ts-ignore FIXME: Resolve type error
    <Lifecycle key={name} store={field} {...props}>
      {children(field, {
        name,
        autoFocus: isServer && !!field.error,
        ref: $((element: Element) => {
          field.internal.elements.push(element as FieldElement);
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
