import { $, type QRL, implicit$FirstArg } from '@builder.io/qwik';
import {
  type RequestEventAction,
  globalActionQrl,
  type Action,
} from '@builder.io/qwik-city';
import type {
  FieldValues,
  FormActionStore,
  FormDataInfo,
  FormErrors,
  FormResponse,
  MaybePromise,
  PartialValues,
  ValidateForm,
} from '../types';
import { getFormDataValues } from '../utils';

export type FormActionResult<TFieldValues extends FieldValues> =
  FormResponse & {
    errors?: FormErrors<TFieldValues>;
  };

type FormActionFunc<TFieldValues extends FieldValues> = (
  values: TFieldValues,
  event: RequestEventAction
) => MaybePromise<FormActionResult<TFieldValues> | void>;

type FormActionArg2<TFieldValues extends FieldValues> =
  | QRL<ValidateForm<TFieldValues>>
  | (FormDataInfo<TFieldValues> & {
      validate?: QRL<ValidateForm<TFieldValues>>;
    });

/**
 * Creates and returns the form action constructor.
 *
 * @param action The server action function.
 * @param arg2 Validation and/or form data info.
 *
 * @returns Form action constructor.
 */
export function formActionQrl<TFieldValues extends FieldValues>(
  action: QRL<FormActionFunc<TFieldValues>>,
  arg2?: FormActionArg2<TFieldValues>
): Action<FormActionStore<TFieldValues>, PartialValues<TFieldValues>, true> {
  return globalActionQrl(
    $(
      async (
        jsonData: unknown,
        event: RequestEventAction
      ): Promise<FormActionStore<TFieldValues>> => {
        // Destructure validate function and form data info
        const { validate, ...formDataInfo } =
          typeof arg2 === 'object' ? arg2 : { validate: arg2 };

        // Get content type of request
        const type = event.request.headers
          .get('content-type')
          ?.split(/[;,]/, 1)[0];

        // Get form values from form or JSON data
        const values: PartialValues<TFieldValues> =
          type === 'application/x-www-form-urlencoded' ||
          type === 'multipart/form-data'
            ? getFormDataValues(await event.request.formData(), formDataInfo)
            : (jsonData as PartialValues<TFieldValues>);

        // Validate values and get errors if necessary
        const errors = validate ? await validate(values) : {};

        // Create form action store object
        const formActionStore: FormActionStore<TFieldValues> = {
          values,
          errors,
          response: {},
        };

        // Try to run submit action if form has no errors
        if (!Object.keys(errors).length) {
          try {
            const result = await action(values as TFieldValues, event);

            // Add result to form action store if necessary
            if (result && typeof result === 'object') {
              if ('errors' in result && result.errors) {
                formActionStore.errors = result.errors;
              }
              if ('status' in result || 'message' in result) {
                formActionStore.response = {
                  status: result.status,
                  message: result.message,
                };
              }
            }

            // If an error occurred, set error response
          } catch (error: any) {
            formActionStore.response = {
              status: 'error',
              message: 'An unknown error has occurred.',
            };
          }
        }

        // Return form action store object
        return formActionStore;
      }
    )
  );
}

/**
 * Creates an action for progressively enhanced forms that handles validation
 * and submission on the server.
 *
 * @param action The server action function.
 * @param arg2 Validation and/or form data info.
 *
 * @returns Form action constructor.
 */
export const formAction$: <TFieldValues extends FieldValues>(
  actionQrl: FormActionFunc<TFieldValues>,
  arg2?: FormActionArg2<TFieldValues>
) => Action<FormActionStore<TFieldValues>, PartialValues<TFieldValues>, true> =
  implicit$FirstArg(formActionQrl);
