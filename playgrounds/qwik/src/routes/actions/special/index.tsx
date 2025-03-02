import { component$, type NoSerialize } from '@builder.io/qwik';
import {
  type DocumentHead,
  routeLoader$,
  globalAction$,
} from '@builder.io/qwik-city';
import {
  type InitialValues,
  useForm,
  valiForm$,
  formAction$,
} from '@modular-forms/qwik';
import * as v from 'valibot';
import {
  FormHeader,
  TextInput,
  Slider,
  Select,
  FileInput,
  FormFooter,
  Checkbox,
  Response,
} from '~/components';

const isBlob = (input: unknown) => input instanceof Blob;

const SpecialSchema = v.object({
  number: v.number(),
  range: v.number(),
  checkbox: v.object({
    array: v.array(v.string()),
    boolean: v.boolean(),
  }),
  select: v.object({
    array: v.array(v.string()),
    string: v.optional(v.string()),
    number: v.optional(v.number()),
  }),
  file: v.object({
    list: v.array(v.custom<NoSerialize<Blob>>(isBlob)),
    item: v.optional(v.custom<NoSerialize<Blob>>(isBlob)),
  }),
});

type SpecialForm = v.InferInput<typeof SpecialSchema>;

const getInitFormValues = (): InitialValues<SpecialForm> => ({
  number: 0,
  range: 50,
  checkbox: {
    array: [],
    boolean: false,
  },
  select: {
    array: [],
    string: undefined,
    number: undefined,
  },
  file: {
    list: [],
    item: undefined,
  },
});

// Note: State is kept in local variable for demo purposes
let specialFormValues: InitialValues<SpecialForm> = getInitFormValues();

export const useFormLoader = routeLoader$<InitialValues<SpecialForm>>(
  () => specialFormValues
);

export const useResetFormAction = globalAction$(() => {
  specialFormValues = getInitFormValues();
});

export const useFormAction = formAction$<SpecialForm>(
  (values) => {
    // Runs on server
    console.log(values);
  },
  {
    validate: valiForm$(SpecialSchema),
    arrays: ['checkbox.array', 'file.list', 'select.array'],
    booleans: ['checkbox.boolean'],
    files: ['file.item', 'file.list'],
    numbers: ['number', 'range'],
  }
);

export default component$(() => {
  // Use special form
  const [specialForm, { Form, Field }] = useForm<SpecialForm>({
    loader: useFormLoader(),
    action: useFormAction(),
    validate: valiForm$(SpecialSchema),
  });

  // Use reset form action
  const resetFormAction = useResetFormAction();

  return (
    <div class="space-y-12 md:space-y-14 lg:space-y-16">
      <FormHeader
        of={specialForm}
        form="special-form"
        heading="Special form"
        resetAction={resetFormAction}
      />

      <Form
        id="special-form"
        class="space-y-8 md:space-y-10 lg:space-y-12"
        encType="multipart/form-data"
        onSubmit$={(values) => {
          // Runs on client
          console.log(values);
        }}
      >
        <Field name="number" type="number">
          {(field, props) => (
            <TextInput
              {...props}
              value={field.value}
              error={field.error}
              type="number"
              label="Number"
            />
          )}
        </Field>

        <Field name="range" type="number">
          {(field, props) => (
            <Slider
              {...props}
              value={field.value}
              error={field.error}
              label="Range"
            />
          )}
        </Field>

        <label class="block px-8 font-medium md:text-lg lg:mb-5 lg:px-10 lg:text-xl">
          Checkbox array
        </label>

        <div class="mx-8 flex flex-wrap gap-6 rounded-2xl border-2 border-slate-200 p-6 dark:border-slate-800 lg:gap-10 lg:p-10">
          {[
            { label: 'Option 1', value: 'option_1' },
            { label: 'Option 2', value: 'option_2' },
            { label: 'Option 3', value: 'option_3' },
          ].map(({ label, value }) => (
            <Field key={value} name="checkbox.array" type="string[]">
              {(field, props) => (
                <Checkbox
                  {...props}
                  class="!p-0"
                  label={label}
                  value={value}
                  checked={field.value?.includes(value)}
                  error={field.error}
                />
              )}
            </Field>
          ))}
        </div>

        <Field name="checkbox.boolean" type="boolean">
          {(field, props) => (
            <Checkbox
              {...props}
              checked={field.value}
              error={field.error}
              label="Checkbox boolean"
            />
          )}
        </Field>

        <Field name="select.array" type="string[]">
          {(field, props) => (
            <Select
              {...props}
              value={field.value}
              options={[
                { label: 'Option 1', value: 'option_1' },
                { label: 'Option 2', value: 'option_2' },
                { label: 'Option 3', value: 'option_3' },
              ]}
              error={field.error}
              label="Select array"
              multiple
            />
          )}
        </Field>

        <Field name="select.string">
          {(field, props) => (
            <Select
              {...props}
              value={field.value}
              options={[
                { label: 'Option 1', value: 'option_1' },
                { label: 'Option 2', value: 'option_2' },
                { label: 'Option 3', value: 'option_3' },
              ]}
              error={field.error}
              label="Select string"
            />
          )}
        </Field>

        <Field name="select.number" type="number">
          {(field, props) => (
            <Select
              {...props}
              value={field.value}
              options={[
                { label: 'Option 1', value: 1 },
                { label: 'Option 2', value: 2 },
                { label: 'Option 3', value: 3 },
              ]}
              error={field.error}
              label="Select number"
            />
          )}
        </Field>


        <Field name="file.list" type="File[]">
          {(field, props) => (
            <FileInput
              {...props}
              value={field.value}
              error={field.error}
              label="File list"
              multiple
            />
          )}
        </Field>

        <Field name="file.item" type="File">
          {(field, props) => (
            <FileInput
              {...props}
              value={field.value}
              error={field.error}
              label="File item"
            />
          )}
        </Field>

        <Response class="pt-8 md:pt-10 lg:pt-12" of={specialForm} />
      </Form>

      <FormFooter
        of={specialForm}
        form="special-form"
        resetAction={resetFormAction}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Special form',
};
