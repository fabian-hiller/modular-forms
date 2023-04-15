import type {
  FieldPath,
  FieldPathValue,
  FieldValues,
  FormStore,
  InitializeStoreDeps,
  Maybe,
  ReactivityDeps,
  ResponseData,
} from '../types';
import { updateFieldDirty, validateIfRequired } from '../utils';

/**
 * Value type of the value options.
 */
export type ValueOptions = Partial<{
  shouldTouched: boolean;
  shouldDirty: boolean;
  shouldValidate: boolean;
  shouldFocus: boolean;
}>;

/**
 * Sets the value of the specified field.
 *
 * @param initialize The initialize function.
 * @param form The form of the field.
 * @param name The name of the field.
 * @param value The value to bet set.
 * @param options The value options.
 */
export function setValue<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>
>(
  deps: ReactivityDeps &
    Pick<
      InitializeStoreDeps<TFieldValues, TResponseData>,
      'initializeFieldStore'
    >,
  form: FormStore<TFieldValues, TResponseData>,
  name: TFieldName,
  value: FieldPathValue<TFieldValues, TFieldName>,
  {
    shouldTouched = true,
    shouldDirty = true,
    shouldValidate = true,
    shouldFocus = true,
  }: Maybe<ValueOptions> = {}
): void {
  // Initialize store of specified field
  const field = deps.initializeFieldStore(form, name);

  // Set new value
  field.value = value;

  // Update touched if set to "true"
  if (shouldTouched) {
    field.touched = true;
    form.touched = true;
  }

  // Update dirty if set to "true"
  if (shouldDirty) {
    updateFieldDirty(form, field);
  }

  // Validate if set to "true" and necessary
  if (shouldValidate) {
    validateIfRequired(deps, form, field, name, {
      on: ['touched', 'input'],
      shouldFocus,
    });
  }
}
