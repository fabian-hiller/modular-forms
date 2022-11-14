import { reset } from '../methods';
import {
  getElementInput,
  getField,
  getUniqueId,
  getValidateList,
  setInitialValue,
  updateFieldDirty,
  updateFieldInput,
  updateState,
  validateIfNecessary,
} from '../utils';
import {
  FieldState,
  FieldPath,
  FieldPathValue,
  FieldValues,
  FormState,
  Maybe,
  ValidateField,
  FieldStore,
} from '../types';
import { batch, createEffect, onCleanup, untrack } from 'solid-js';

type FieldOptions<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
> = Partial<{
  initialValue: [FieldPathValue<TFieldValues, TFieldName>];
  validate:
    | ValidateField<Maybe<FieldPathValue<TFieldValues, TFieldName>>>
    | ValidateField<Maybe<FieldPathValue<TFieldValues, TFieldName>>>[];
  keepActive: boolean;
  keepState: boolean;
}>;

/**
 * Returns the reactive properties and state of a form field.
 *
 * @param form The form to which the field is connected.
 * @param name The name of the form field.
 * @param options The optional field options.
 *
 * @returns The reactive properties and state of the field.
 */
export function useField<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
>(
  form: FormState<TFieldValues>,
  name: TFieldName,
  options: FieldOptions<TFieldValues, TFieldName> = {}
): FieldState<TFieldValues, TFieldName> {
  // Destructure options and set default values
  const { initialValue, keepActive = false, keepState = true } = options;

  // Create validate list
  const validate = getValidateList(options.validate);

  // Create field variable
  let field: FieldStore<TFieldValues, TFieldName>;

  // Create unique consumer ID
  const consumer = getUniqueId();

  // Sync state updates and prevent unnecessary recalculation
  batch(() => {
    // Get specified field
    field = getField(form, name, { initialValue, validate });

    // Add consumer to field
    field.consumers.add(consumer);

    // Set initial value if specified and update dirty state
    if (initialValue) {
      setInitialValue(form, name, initialValue[0]);
      field.setInitialInput(() => initialValue[0]);
      updateFieldDirty(form, field);
    }

    // Mark field as active, valdiate it and update form state if necessary
    if (!untrack(field.getActive)) {
      field.setActive(true);
      validateIfNecessary(form, name, { on: 'input' });
      updateState(form);
    }
  });

  // On cleanup, remove consumer from field
  onCleanup(() => {
    field.consumers.delete(consumer);

    // Mark field as inactive if there is no other consumer
    if (!keepActive && !field.consumers.size) {
      // Sync state updates and prevent unnecessary recalculation
      batch(() => {
        field.setActive(false);

        // Reset state if it is not to be kept
        if (!keepState) {
          reset(form, name);

          // Otherwise just update form state
        } else {
          updateState(form);
        }
      });
    }

    // Remove unmounted elements
    setTimeout(() =>
      field.setElements((elements) =>
        elements.filter((element) => element.isConnected)
      )
    );
  });

  // Return field props and state
  return {
    props: {
      name,
      ref(element) {
        // Sync state updates and prevent unnecessary recalculation
        batch(() => {
          // Set element of field
          field.setElements((elements) => [...elements, element]);

          // Create effect that replaces initial input and input of field with
          // initial input of element if both is "undefined", so that dirty
          // state also resets to "false" when user removes input
          createEffect(() => {
            if (
              field.getInitialInput() === undefined &&
              untrack(field.getInput) === undefined &&
              element.type !== 'file'
            ) {
              const input = getElementInput(element, field);
              field.setInitialInput(() => input);
              field.setInput(() => input);
            }
          });
        });
      },
      onInput(event) {
        // Update input state
        updateFieldInput(
          form,
          field,
          name,
          getElementInput(event.currentTarget, field)
        );
      },
      onChange() {
        // Validate value if necessary
        validateIfNecessary(form, name, { on: 'change' });
      },
      onBlur(event) {
        // Destructure current target
        const { type, value } = event.currentTarget;

        // Set input to "NaN" if type is "number" and value is emtpy
        if (type === 'number' && value === '') {
          updateFieldInput(
            form,
            field,
            name,
            NaN as FieldPathValue<TFieldValues, TFieldName>
          );

          // Otheriwse, just update touched state
        } else {
          batch(() => {
            field.setTouched(true);
            form.internal.setTouched(true);
          });
        }
      },
    },
    name,
    get value() {
      return field.getInput();
    },
    get error() {
      return field.getError();
    },
    get active() {
      return field.getActive();
    },
    get touched() {
      return field.getTouched();
    },
    get dirty() {
      return field.getDirty();
    },
  };
}
