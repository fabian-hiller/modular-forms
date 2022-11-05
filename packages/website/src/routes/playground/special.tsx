import { createForm, Field, Form } from '@modular-forms/solid';
import { For, onMount } from 'solid-js';
import { Title } from 'solid-start';
import {
  FormHeader,
  FormFooter,
  TextInput,
  Checkbox,
  FileInput,
  Slider,
  Select,
} from '~/components';
import { useForm } from '~/contexts';

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
    list: FileList;
    item: File;
  };
};

export default function SpecialPage() {
  // Create special form
  const specialForm = createForm<SpecialForm>();

  // Set special form in form context
  onMount(() => useForm().set(specialForm));

  return (
    <>
      <Title>Special Playground | Modular Forms</Title>

      <Form
        class="space-y-12 md:space-y-14 lg:space-y-16"
        of={specialForm}
        onSubmit={(values) => alert(JSON.stringify(values, null, 4))}
      >
        <FormHeader of={specialForm} heading="Special form" />
        <div class="space-y-8 md:space-y-10 lg:space-y-12">
          <Field of={specialForm} name="number">
            {(field) => (
              <TextInput
                {...field.props}
                value={field.value}
                error={field.error}
                type="number"
                label="Number"
              />
            )}
          </Field>

          <Field of={specialForm} name="range">
            {(field) => (
              <Slider
                {...field.props}
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
                <Field of={specialForm} name="checkbox.array">
                  {(field) => (
                    <Checkbox
                      {...field.props}
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

          <Field of={specialForm} name="checkbox.boolean">
            {(field) => (
              <Checkbox
                {...field.props}
                checked={field.value}
                error={field.error}
                label="Checkbox boolean"
              />
            )}
          </Field>

          <Field of={specialForm} name="select.array">
            {(field) => (
              <Select
                {...field.props}
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

          <Field of={specialForm} name="select.string">
            {(field) => (
              <Select
                {...field.props}
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

          <Field of={specialForm} name="file.list">
            {(field) => (
              <FileInput
                {...field.props}
                value={field.value}
                error={field.error}
                label="File list"
                multiple
              />
            )}
          </Field>

          <Field of={specialForm} name="file.item">
            {(field) => (
              <FileInput
                {...field.props}
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
