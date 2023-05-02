import {
  useForm,
  remove,
  insert,
  move,
  swap,
  replace,
} from '@modular-forms/preact';
import { FormHeader, FormFooter, TextInput, ColorButton } from '../components';

type NestedForm = {
  items: {
    label: string;
    options: string[];
  }[];
};

const initialValues = {
  items: [
    {
      label: 'Item 1',
      options: ['Option 1', 'Option 2'],
    },
    {
      label: 'Item 2',
      options: ['Option 1', 'Option 2'],
    },
  ],
};

export default function NestedPage() {
  // Create nested form
  const [nestedForm, { Form, Field, FieldArray }] = useForm<NestedForm>({
    initialValues,
  });

  return (
    <Form
      class="space-y-12 md:space-y-14 lg:space-y-16"
      onSubmit={(values) => console.log(values)}
    >
      <FormHeader of={nestedForm} heading="Nested form" />

      <div class="space-y-5 px-8 lg:px-10">
        <FieldArray name="items">
          {(fieldArray) => (
            <>
              {fieldArray.items.value.map((_, index) => (
                <div class="flex-1 space-y-5 rounded-2xl border-2 border-slate-200 bg-slate-100/25 py-6 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/10 dark:hover:border-slate-700">
                  <div class="flex space-x-5 px-6">
                    <Field name={`${fieldArray.name}.${index}.label`}>
                      {(field, props) => (
                        <TextInput
                          {...props}
                          class="flex-1 !p-0"
                          value={field.value}
                          error={field.error}
                          type="text"
                          placeholder="Enter item"
                        />
                      )}
                    </Field>

                    <ColorButton
                      color="red"
                      label="Delete"
                      width="auto"
                      onClick={() =>
                        remove(nestedForm, fieldArray.name, { at: index })
                      }
                    />
                  </div>

                  <div
                    class="border-t-2 border-t-slate-200 dark:border-t-slate-800"
                    role="separator"
                  />

                  <FieldArray name={`${fieldArray.name}.${index}.options`}>
                    {(fieldArray) => (
                      <div class="space-y-5 px-6">
                        {fieldArray.items.value.map((_, index) => (
                          <div class="flex space-x-5">
                            <Field name={`${fieldArray.name}.${index}`}>
                              {(field, props) => (
                                <TextInput
                                  {...props}
                                  class="flex-1 !p-0"
                                  value={field.value}
                                  error={field.error}
                                  type="text"
                                  placeholder="Enter option"
                                />
                              )}
                            </Field>

                            <ColorButton
                              color="red"
                              label="Delete"
                              width="auto"
                              onClick={() =>
                                remove(nestedForm, fieldArray.name, {
                                  at: index,
                                })
                              }
                            />
                          </div>
                        ))}

                        <div class="flex flex-wrap gap-4">
                          <ColorButton
                            color="green"
                            label="Add option"
                            onClick={() =>
                              insert(nestedForm, fieldArray.name, {
                                value: '',
                              })
                            }
                          />
                          <ColorButton
                            color="yellow"
                            label="Move first to end"
                            onClick={() =>
                              move(nestedForm, fieldArray.name, {
                                from: 0,
                                to: fieldArray.items.value.length - 1,
                              })
                            }
                          />
                          <ColorButton
                            color="purple"
                            label="Swap first two"
                            onClick={() =>
                              swap(nestedForm, fieldArray.name, {
                                at: 0,
                                and: 1,
                              })
                            }
                          />
                        </div>
                      </div>
                    )}
                  </FieldArray>
                </div>
              ))}

              <div class="flex flex-wrap gap-4">
                <ColorButton
                  color="green"
                  label="Add item"
                  onClick={() =>
                    insert(nestedForm, fieldArray.name, {
                      value: { label: '', options: [''] },
                    })
                  }
                />
                <ColorButton
                  color="yellow"
                  label="Move first to end"
                  onClick={() =>
                    move(nestedForm, fieldArray.name, {
                      from: 0,
                      to: fieldArray.items.value.length - 1,
                    })
                  }
                />
                <ColorButton
                  color="purple"
                  label="Swap first two"
                  onClick={() =>
                    swap(nestedForm, fieldArray.name, { at: 0, and: 1 })
                  }
                />
                <ColorButton
                  color="blue"
                  label="Replace first"
                  onClick={() =>
                    replace(nestedForm, fieldArray.name, {
                      at: 0,
                      value: { label: '', options: [''] },
                    })
                  }
                />
              </div>
            </>
          )}
        </FieldArray>
      </div>

      <FormFooter of={nestedForm} />
    </Form>
  );
}
