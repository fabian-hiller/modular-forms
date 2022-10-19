import { FieldPath, FieldPathValue, FieldValues, FormState } from '../types';

/**
 * Sets the initial value of the form field.
 *
 * @param form The form that contains the field.
 * @param name The name of the field.
 * @param value The initial value.
 */
export function setInitialValue<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
>(
  form: FormState<TFieldValues>,
  name: TFieldName,
  value: FieldPathValue<TFieldValues, TFieldName>
): void {
  name
    .split('.')
    .reduce(
      (values, key, index, pathList) =>
        typeof values === 'object' && index === pathList.length - 1
          ? (values[key] = value)
          : typeof values[key] === 'object'
          ? values[key]
          : isNaN(+key)
          ? (values[key] = {})
          : (values[key] = []),
      form.internal.initialValues as any
    );
}
