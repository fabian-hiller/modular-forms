import {
  FieldArrayPath,
  FieldPath,
  FieldPathValue,
  FieldValues,
  Maybe,
  MaybeArray,
  MaybeValue,
  PartialKey,
  ResponseData,
  ValidateField,
} from '@modular-forms/shared';
import { batch, createEffect, createMemo, JSX, untrack } from 'solid-js';
import { createLifecycle } from '../primitives';
import {
  FieldElementProps,
  FieldStore,
  FieldType,
  FieldValue,
  FormStore,
} from '../types';
import {
  getElementInput,
  getFieldStore,
  updateFieldValue,
  validateIfRequired,
} from '../utils';

export type FieldProps<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
> = {
  of: FormStore<TFieldValues, TResponseData, TFieldName, TFieldArrayName>;
  name: TFieldName;
  type: FieldType<FieldPathValue<TFieldValues, TFieldName, FieldValue>>;
  children: (
    store: FieldStore<TFieldValues, TFieldName>,
    props: FieldElementProps<TFieldValues, TFieldName>
  ) => JSX.Element;
  validate?: Maybe<
    MaybeArray<
      ValidateField<FieldPathValue<TFieldValues, TFieldName, FieldValue>>
    >
  >;
  keepActive?: boolean;
  keepState?: boolean;
};

/**
 * Headless form field that provides reactive properties and state.
 */
export function Field<
  TFieldValues extends FieldValues<FieldValue>,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues, FieldValue>,
  TFieldArrayName extends FieldArrayPath<TFieldValues, FieldValue>
>(
  props: FieldPathValue<
    TFieldValues,
    TFieldName,
    FieldValue
  > extends MaybeValue<string>
    ? PartialKey<
        FieldProps<TFieldValues, TResponseData, TFieldName, TFieldArrayName>,
        'type'
      >
    : FieldProps<TFieldValues, TResponseData, TFieldName, TFieldArrayName>
): JSX.Element {
  // Get store of specified field
  const getField = createMemo(() => getFieldStore(props.of, props.name));

  // Create lifecycle of field
  createLifecycle(props, getField);

  return (
    <>
      {props.children(getField(), {
        name: props.name,
        autoFocus: !!getField().error,
        ref(element) {
          getField().internal.setElements((elements) => [...elements, element]);

          // Create effect that replaces initial input and input of field with
          // initial input of element if both is "undefined", so that dirty
          // state also resets to "false" when user removes input
          createEffect(() => {
            if (
              getField().internal.getStartValue() === undefined &&
              untrack(() => getField().value) === undefined
            ) {
              const input = getElementInput(element, getField(), props.type);
              getField().internal.setStartValue(() => input);
              getField().internal.setValue(() => input);
            }
          });
        },
        onInput({ currentTarget }) {
          updateFieldValue(
            props.of,
            getField(),
            props.name,
            getElementInput(currentTarget, getField(), props.type)
          );
        },
        onChange() {
          validateIfRequired(props.of, getField(), props.name, {
            on: ['change'],
          });
        },
        onBlur() {
          batch(() => {
            getField().internal.setTouched(true);
            props.of.internal.setTouched(true);
            validateIfRequired(props.of, getField(), props.name, {
              on: ['touched', 'blur'],
            });
          });
        },
      })}
    </>
  );
}
