import {
  createForm,
  Field,
  FieldArray,
  Form,
  insert,
  move,
  remove,
  replace,
  required,
  swap,
} from '@modular-forms/solid';
import clsx from 'clsx';
import { For, onMount } from 'solid-js';
import { Title } from 'solid-start';
import { FormHeader, FormFooter, TextInput } from '~/components';
import { InputError } from '~/components/InputError';
import { useForm } from '~/contexts';

type TodoForm = {
  heading: string;
  todos: {
    label: string;
    deadline: string;
  }[];
};

const initialValues = {
  todos: [
    { label: '3 cucumbers' },
    { label: '5 Tomatoes' },
    { label: '1 Peppers' },
  ],
};

export default function TodosPage() {
  // Create todo form
  const todoForm = createForm<TodoForm>({ initialValues });

  // Set todo form in form context
  onMount(() => useForm().set(todoForm));

  return (
    <>
      <Title>Todos Playground | Modular Forms</Title>

      <Form
        class="space-y-12 md:space-y-14 lg:space-y-16"
        of={todoForm}
        onSubmit={(values) => alert(JSON.stringify(values, null, 4))}
      >
        <FormHeader of={todoForm} heading="Todo form" />
        <div class="space-y-8 md:space-y-10 lg:space-y-12">
          <Field
            of={todoForm}
            name="heading"
            validate={required('Please enter a heading.')}
          >
            {(field) => (
              <TextInput
                {...field.props}
                value={field.value}
                error={field.error}
                type="text"
                label="Heading"
                placeholder="Shopping list"
                required
              />
            )}
          </Field>

          <FieldArray of={todoForm} name="todos">
            {(fieldArray) => (
              <div class="space-y-4" id={fieldArray.name}>
                <div>
                  <label
                    class="block px-8 font-medium md:text-lg lg:px-10 lg:text-xl"
                    for={fieldArray.name}
                  >
                    Todos
                  </label>
                  <InputError name={fieldArray.name} error={fieldArray.error} />
                </div>

                <For each={fieldArray.items}>
                  {(item, index) => (
                    <div
                      class="flex flex-wrap gap-4 px-8 lg:px-10"
                      date-item={item}
                    >
                      <Field
                        of={todoForm}
                        name={`todos.${index()}.label`}
                        validate={required('Please enter a label.')}
                      >
                        {(field) => (
                          <TextInput
                            {...field.props}
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
                        of={todoForm}
                        name={`todos.${index()}.deadline`}
                        validate={required('Please enter a deadline.')}
                      >
                        {(field) => (
                          <TextInput
                            {...field.props}
                            class="flex-1"
                            type="date"
                            value={field.value}
                            error={field.error}
                            padding="none"
                            required
                          />
                        )}
                      </Field>

                      <Button
                        class="border-red-600/10 text-red-600 hover:bg-red-600/10 dark:border-red-400/10 dark:text-red-400 dark:hover:bg-red-400/10"
                        label="Delete"
                        onClick={() =>
                          remove(todoForm, 'todos', { at: index() })
                        }
                      />
                    </div>
                  )}
                </For>

                <div class="flex flex-wrap gap-4 px-8 lg:px-10">
                  <Button
                    class="border-emerald-600/10 text-emerald-600 hover:bg-emerald-600/10 dark:border-emerald-400/10 dark:text-emerald-400 dark:hover:bg-emerald-400/10"
                    label="Add new"
                    onClick={() => insert(todoForm, 'todos')}
                  />
                  <Button
                    class="border-yellow-600/10 text-yellow-600 hover:bg-yellow-600/10 dark:border-amber-300/10 dark:text-amber-300 dark:hover:bg-amber-300/10"
                    label="Move first to end"
                    onClick={() =>
                      move(todoForm, 'todos', {
                        from: 0,
                        to: fieldArray.length - 1,
                      })
                    }
                  />
                  <Button
                    class="border-purple-600/10 text-purple-600 hover:bg-purple-600/10 dark:border-purple-400/10 dark:text-purple-400 dark:hover:bg-purple-400/10"
                    label="Swap first two"
                    onClick={() => swap(todoForm, 'todos', { at: 0, and: 1 })}
                  />
                  <Button
                    class="border-sky-600/10 text-sky-600 hover:bg-sky-600/10 dark:border-sky-400/10 dark:text-sky-400 dark:hover:bg-sky-400/10"
                    label="Replace first"
                    onClick={() => replace(todoForm, 'todos', { at: 0 })}
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

type ButtonProps = {
  class: string;
  label: string;
  onClick: () => void;
};

function Button(props: ButtonProps) {
  return (
    <button
      class={clsx(
        'h-14 rounded-2xl border-2 px-5 font-medium md:h-16 md:text-lg lg:h-[70px] lg:px-6 lg:text-xl',
        props.class
      )}
      type="button"
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
}
