import { $, component$ } from '@builder.io/qwik';
import {
  Form as ActionForm,
  globalAction$,
  routeLoader$,
  z,
  type DocumentHead,
} from '@builder.io/qwik-city';
import {
  insert,
  type InitialValues,
  move,
  remove,
  replace,
  swap,
  useForm,
  zodForm$,
  formAction$,
  getValues,
} from '@modular-forms/qwik';
import {
  TextInput,
  InputLabel,
  ColorButton,
  InputError,
  FormHeader,
  FormFooter,
  Response,
} from '~/components';

const todoSchema = z.object({
  heading: z.string().min(1, 'Please enter a heading.'),
  todos: z
    .array(
      z.object({
        label: z.string().min(1, 'Please enter a label.'),
        deadline: z
          .string()
          .min(1, 'Please enter a deadline.')
          .regex(
            /^([0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])$/,
            'The specified date is invalid.'
          ),
      })
    )
    .min(1, 'Please add at least one todo.')
    .max(4, 'You can add a maximum of 4 todos.'),
});

type TodoForm = z.input<typeof todoSchema>;

const getInitFormValues = (): InitialValues<TodoForm> => ({
  heading: 'Shopping list',
  todos: [
    {
      label: '3 cucumbers',
      deadline: new Date(Date.now() + 864e5).toISOString().split('T')[0],
    },
    {
      label: '5 Tomatoes',
      deadline: new Date(Date.now() + 1728e5).toISOString().split('T')[0],
    },
  ],
});

// Note: State is kept in local variable for demo purposes
let todoFormValues: InitialValues<TodoForm> = getInitFormValues();

export const useFormLoader = routeLoader$<InitialValues<TodoForm>>(
  () => todoFormValues
);

export const useDeleteTodoAction = globalAction$((values) => {
  const index = parseInt(values.index as string);
  if (todoFormValues.todos.length >= 1 && index < todoFormValues.todos.length) {
    todoFormValues.todos.splice(index, 1);
  }
});

export const useAddTodoAction = globalAction$(() => {
  todoFormValues.todos.push({ label: '', deadline: '' });
});

export const useMoveTodoAction = globalAction$(() => {
  if (todoFormValues.todos.length >= 2) {
    todoFormValues.todos.splice(
      todoFormValues.todos.length - 1,
      0,
      todoFormValues.todos.splice(0, 1)[0]
    );
  }
});

export const useSwapTodoAction = globalAction$(() => {
  if (todoFormValues.todos.length >= 2) {
    const firstTodo = todoFormValues.todos[0];
    todoFormValues.todos[0] = todoFormValues.todos[1];
    todoFormValues.todos[1] = firstTodo;
  }
});

export const useReplaceTodoAction = globalAction$(() => {
  if (todoFormValues.todos.length >= 1) {
    todoFormValues.todos[0] = {
      label: '',
      deadline: '',
    };
  }
});

export const useResetFormAction = globalAction$(() => {
  todoFormValues = getInitFormValues();
});

export const useFormAction = formAction$<TodoForm>(
  (values) => {
    // Runs on server
    console.log(values);
    todoFormValues = values;
  },
  {
    validate: zodForm$(todoSchema),
    arrays: ['todos'],
  }
);

export default component$(() => {
  // Use todo form
  const [todoForm, { Form, Field, FieldArray }] = useForm<TodoForm>({
    loader: useFormLoader(),
    action: useFormAction(),
    validate: zodForm$(todoSchema),
    fieldArrays: ['todos'],
  });

  // Use todo and form actions
  const deleteTodoAction = useDeleteTodoAction();
  const addTodoAction = useAddTodoAction();
  const moveTodoAction = useMoveTodoAction();
  const swapTodoAction = useSwapTodoAction();
  const replaceTodoAction = useReplaceTodoAction();
  const resetFormAction = useResetFormAction();

  return (
    <div class="space-y-12 md:space-y-14 lg:space-y-16">
      <FormHeader
        of={todoForm}
        form="todo-form"
        heading="Todo form"
        resetAction={resetFormAction}
      />

      <div class="space-y-5">
        <div class="space-y-8 md:space-y-10 lg:space-y-12">
          <Form
            id="todo-form"
            onSubmit$={(values) => {
              // Runs on client
              console.log(values);
            }}
          >
            <Field name="heading">
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
          </Form>

          <FieldArray name="todos">
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
                    {fieldArray.items.map((item, index) => (
                      <div
                        key={item}
                        class="flex flex-wrap gap-5 rounded-2xl border-2 border-slate-200 bg-slate-100/25 p-5 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/10 dark:hover:border-slate-700"
                      >
                        <Field name={`todos.${index}.label`}>
                          {(field, props) => (
                            <TextInput
                              {...props}
                              class="w-full !p-0 md:w-auto md:flex-1"
                              form="todo-form"
                              value={field.value}
                              error={field.error}
                              type="text"
                              placeholder="Enter task"
                              required
                            />
                          )}
                        </Field>

                        <Field name={`todos.${index}.deadline`}>
                          {(field, props) => (
                            <TextInput
                              {...props}
                              class="flex-1 !p-0"
                              form="todo-form"
                              type="date"
                              value={field.value}
                              error={field.error}
                              required
                            />
                          )}
                        </Field>

                        <ActionForm action={deleteTodoAction}>
                          <input type="hidden" name="index" value={index} />
                          <ColorButton
                            type="submit"
                            color="red"
                            label="Delete"
                            width="auto"
                            // TODO: Remove $() once bug is fixed
                            onClick$={$(() =>
                              remove(todoForm, 'todos', { at: index })
                            )}
                          />
                        </ActionForm>
                      </div>
                    ))}
                  </div>
                  <InputError name={fieldArray.name} error={fieldArray.error} />
                </div>
              </div>
            )}
          </FieldArray>
        </div>

        <div class="flex flex-wrap gap-5 px-8 lg:px-10">
          <ActionForm action={addTodoAction}>
            <ColorButton
              type="submit"
              color="green"
              label="Add new"
              onClick$={() =>
                insert(todoForm, 'todos', {
                  value: { label: '', deadline: '' },
                })
              }
            />
          </ActionForm>
          <ActionForm action={moveTodoAction}>
            <ColorButton
              type="submit"
              color="yellow"
              label="Move first to end"
              onClick$={() =>
                move(todoForm, 'todos', {
                  from: 0,
                  to: getValues(todoForm, 'todos').length! - 1,
                })
              }
            />
          </ActionForm>
          <ActionForm action={swapTodoAction}>
            <ColorButton
              type="submit"
              color="purple"
              label="Swap first two"
              onClick$={() => swap(todoForm, 'todos', { at: 0, and: 1 })}
            />
          </ActionForm>
          <ActionForm action={replaceTodoAction}>
            <ColorButton
              type="submit"
              color="blue"
              label="Replace first"
              onClick$={() =>
                replace(todoForm, 'todos', {
                  at: 0,
                  value: { label: 'test', deadline: '' },
                })
              }
            />
          </ActionForm>
        </div>

        <Response class="pt-8 md:pt-10 lg:pt-12" of={todoForm} />
      </div>

      <FormFooter
        of={todoForm}
        resetAction={resetFormAction}
        form="todo-form"
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Todo form',
};
