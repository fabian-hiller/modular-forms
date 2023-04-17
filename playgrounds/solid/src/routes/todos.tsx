import {
  createForm,
  insert,
  maxLength,
  move,
  remove,
  replace,
  required,
  swap,
} from '@modular-forms/solid';
import { For } from 'solid-js';
import {
  FormHeader,
  FormFooter,
  TextInput,
  Title,
  ColorButton,
  InputLabel,
  InputError,
} from '~/components';

type TodoForm = {
  heading: string;
  todos: {
    label: string;
    deadline: string;
  }[];
};

const initialValues = {
  todos: [
    {
      label: '3 cucumbers',
      deadline: new Date(Date.now() + 864e5).toISOString().split('T')[0],
    },
    {
      label: '5 Tomatoes',
      deadline: new Date(Date.now() + 1728e5).toISOString().split('T')[0],
    },
    {},
  ],
};

export default function TodosPage() {
  // Create todo form
  const [todoForm, { Form, Field, FieldArray }] = createForm<TodoForm>({
    initialValues,
  });

  return (
    <>
      <Title>Todo form</Title>

      <Form
        class="space-y-12 md:space-y-14 lg:space-y-16"
        onSubmit={(values) => alert(JSON.stringify(values, null, 4))}
      >
        <FormHeader of={todoForm} heading="Todo form" />

        <div class="space-y-8 md:space-y-10 lg:space-y-12">
          <Field name="heading" validate={required('Please enter a heading.')}>
            {(field, props) => (
              <TextInput
                {...props}
                value={field.value}
                error={field.error}
                type="text"
                label="Heading"
                placeholder="Shopping list"
                required
              />
            )}
          </Field>

          <FieldArray
            name="todos"
            validate={[
              required('Please add at least one todo.'),
              maxLength(4, 'You can add a maximum of 4 todos.'),
            ]}
          >
            {(fieldArray) => (
              <div class="space-y-5 px-8 lg:px-10" id={fieldArray.name}>
                <InputLabel
                  name={fieldArray.name}
                  label="Todos"
                  margin="none"
                  required
                />

                <div>
                  <div class="space-y-5">
                    <For each={fieldArray.items}>
                      {(_, index) => (
                        <div class="flex flex-wrap gap-5 rounded-2xl border-2 border-slate-200 bg-slate-100/25 p-5 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/10 dark:hover:border-slate-700">
                          <Field
                            name={`todos.${index()}.label`}
                            validate={required('Please enter a label.')}
                          >
                            {(field, props) => (
                              <TextInput
                                {...props}
                                class="w-full md:w-auto md:flex-1"
                                value={field.value}
                                error={field.error}
                                type="text"
                                placeholder="Enter task"
                                padding="none"
                                required
                              />
                            )}
                          </Field>

                          <Field
                            name={`todos.${index()}.deadline`}
                            validate={required('Please enter a deadline.')}
                          >
                            {(field, props) => (
                              <TextInput
                                {...props}
                                class="flex-1"
                                type="date"
                                value={field.value}
                                error={field.error}
                                padding="none"
                                required
                              />
                            )}
                          </Field>

                          <ColorButton
                            color="red"
                            label="Delete"
                            width="auto"
                            onClick={() =>
                              remove(todoForm, 'todos', { at: index() })
                            }
                          />
                        </div>
                      )}
                    </For>
                  </div>
                  <InputError name={fieldArray.name} error={fieldArray.error} />
                </div>

                <div class="flex flex-wrap gap-5">
                  <ColorButton
                    color="green"
                    label="Add new"
                    onClick={() =>
                      insert(todoForm, 'todos', {
                        value: { label: '', deadline: '' },
                      })
                    }
                  />
                  <ColorButton
                    color="yellow"
                    label="Move first to end"
                    onClick={() =>
                      move(todoForm, 'todos', {
                        from: 0,
                        to: fieldArray.items.length - 1,
                      })
                    }
                  />
                  <ColorButton
                    color="purple"
                    label="Swap first two"
                    onClick={() => swap(todoForm, 'todos', { at: 0, and: 1 })}
                  />
                  <ColorButton
                    color="blue"
                    label="Replace first"
                    onClick={() =>
                      replace(todoForm, 'todos', {
                        at: 0,
                        value: { label: '', deadline: '' },
                      })
                    }
                  />
                </div>
              </div>
            )}
          </FieldArray>
        </div>

        <FormFooter of={todoForm} />
      </Form>
    </>
  );
}
