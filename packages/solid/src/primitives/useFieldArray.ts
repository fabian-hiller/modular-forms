import { batch, onCleanup } from 'solid-js';
import { reset } from '../methods';
import {
  FieldArrayPath,
  FieldArrayState,
  FieldValues,
  FormState,
  ValidateFieldArray,
} from '../types';
import { getFieldArray, getUniqueId, getValidateList } from '../utils';

type FieldArrayOptions = Partial<{
  validate: ValidateFieldArray<number[]> | ValidateFieldArray<number[]>[];
  keepActive: boolean;
  keepState: boolean;
}>;

/**
 * Sets up a form field array and returns its reactive state.
 *
 * @param form The form to which the field array is connected.
 * @param name The name of the form field array.
 * @param options The optional field array options.
 *
 * @returns The reactive state of the field array.
 */
export function useFieldArray<
  TFieldValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues>
>(
  form: FormState<TFieldValues>,
  name: TFieldArrayName,
  options: FieldArrayOptions = {}
): FieldArrayState<TFieldValues, TFieldArrayName> {
  // Destructure options and set default values
  const { keepActive = false, keepState = true } = options;

  // Create validate list
  const validate = getValidateList(options.validate);

  // Get specified field array
  const fieldArray = getFieldArray(form, name, { validate });

  // Create unique consumer ID
  const consumer = getUniqueId();

  // Add consumer to field array and mark field as active
  fieldArray.consumers.add(consumer);
  fieldArray.setActive(true);

  // On cleanup, remove consumer from field
  onCleanup(() => {
    fieldArray.consumers.delete(consumer);

    // Mark field as inactive if there is no other consumer
    if (!keepActive && !fieldArray.consumers.size) {
      // Sync state updates and prevent unnecessary recalculation
      batch(() => {
        fieldArray.setActive(false);

        // Reset state if it is not to be kept
        if (!keepState) {
          reset(form, name);
        }
      });
    }
  });

  // Return field array state
  return {
    name,
    get items() {
      return fieldArray.getItems();
    },
    get length() {
      return fieldArray.getItems().length;
    },
    get error() {
      return fieldArray.getError();
    },
    get active() {
      return fieldArray.getActive();
    },
    get touched() {
      return fieldArray.getTouched();
    },
    get dirty() {
      return fieldArray.getDirty();
    },
  };
}
