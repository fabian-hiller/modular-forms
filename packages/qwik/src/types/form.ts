import type { NoSerialize, Signal } from '@builder.io/qwik';
import type { ActionStore } from '@builder.io/qwik-city';
import type {
  FieldValues,
  FormResponse,
  Maybe,
  ResponseData,
  ValidationMode,
  FormErrors,
  PartialValues,
  ValidateForm,
  InitialValues,
} from '@modular-forms/shared';
import type { TypeInfoPath } from './path';

/**
 * Value type of the form data info.
 */
export type FormDataInfo<TFieldValues extends FieldValues> = Partial<{
  arrays: TypeInfoPath<TFieldValues, any[]>[];
  booleans: TypeInfoPath<TFieldValues, boolean>[];
  dates: TypeInfoPath<TFieldValues, Date>[];
  files: TypeInfoPath<TFieldValues, NoSerialize<Blob> | NoSerialize<File>>[];
  numbers: TypeInfoPath<TFieldValues, number>[];
}>;

/**
 * Value type of the form action store.
 */
export type FormActionStore<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
> = {
  values: PartialValues<TFieldValues>;
  errors: FormErrors<TFieldValues>;
  response: FormResponse<TResponseData>;
};

/**
 * Value type of the form options.
 */
export type FormOptions<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData
> = {
  loader: Signal<InitialValues<TFieldValues>>;
  action?: Maybe<
    ActionStore<
      FormActionStore<TFieldValues, TResponseData>,
      PartialValues<TFieldValues>,
      true
    >
  >;
  validate?: Maybe<ValidateForm<TFieldValues>>;
  validateOn?: Maybe<ValidationMode>;
  revalidateOn?: Maybe<ValidationMode>;
};
