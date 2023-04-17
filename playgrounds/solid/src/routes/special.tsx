import { createForm } from '@modular-forms/solid';
import { For } from 'solid-js';
import {
  FormHeader,
  FormFooter,
  TextInput,
  Checkbox,
  FileInput,
  Slider,
  Select,
  Title,
} from '~/components';

type SpecialForm = {
  number: number;
  range: number;
  checkbox: {
    array: string[];
    boolean: boolean;
  };
  select: {
    array: string[];
    string: string;
  };
  file: {
    list: File[];
    item: File;
  };
};

export default function SpecialPage() {
  // Create special form
  const [specialForm, { Form, Field }] = createForm<SpecialForm>();

  return (
    <>
      <Title>Special form</Title>

      <Form
        class="space-y-12 md:space-y-14 lg:space-y-16"
        onSubmit={(values) => alert(JSON.stringify(values, null, 4))}
      >
        <FormHeader of={specialForm} heading="Special form" />
        <div class="space-y-8 md:space-y-10 lg:space-y-12">
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
            <For
              each={[
                { label: 'Option 1', value: 'option_1' },
                { label: 'Option 2', value: 'option_2' },
                { label: 'Option 3', value: 'option_3' },
              ]}
            >
              {({ label, value }) => (
                <Field name="checkbox.array" type="string[]">
                  {(field, props) => (
                    <Checkbox
                      {...props}
                      label={label}
                      value={value}
                      checked={field.value?.includes(value)}
                      error={field.error}
                      padding="none"
                    />
                  )}
                </Field>
              )}
            </For>
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
        </div>
        <FormFooter of={specialForm} />
      </Form>
    </>
  );
}
