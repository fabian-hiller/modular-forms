import { untrack } from 'solid-js';
import type {
  FieldElement,
  FieldPath,
  FieldPathValue,
  FieldType,
  FieldValues,
  InternalFieldStore,
  Maybe,
} from '../types';

/**
 * Returns the current input of the element.
 *
 * @param element The field element.
 * @param field The store of the field.
 * @param type The data type to capture.
 *
 * @returns The element input.
 */
export function getElementInput<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
>(
  element: FieldElement,
  field: InternalFieldStore<TFieldValues, TFieldName>,
  type: Maybe<FieldType<any>>
): FieldPathValue<TFieldValues, TFieldName> {
  const { checked, files, options, value, valueAsDate, valueAsNumber } =
    element as HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement;
  return untrack(() => {
    if (!type || type === 'string') {
      return value;
    }
    if (type === 'string[]') {
      return options
        ? [...options]
            .filter((e) => e.selected && !e.disabled)
            .map((e) => e.value)
        : checked
          ? [...((field.value.get() || []) as string[]), value]
          : ((field.value.get() || []) as string[]).filter((v) => v !== value);
    }

    if (type === 'number') {
      if (element instanceof HTMLSelectElement) {
        return value ? parseFloat(value) : undefined;
      }

      return valueAsNumber;
    }

    if (type === 'boolean') {
      return checked;
    }

    if (type === 'File') {
      return files ? files[0] : undefined;
    }

    if (type === 'File[]') {
      return files ? [...files] : undefined;
    }

    if (type === 'Date') {
      return valueAsDate;
    }
  }) as FieldPathValue<TFieldValues, TFieldName>;
}
