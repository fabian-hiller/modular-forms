import { DocsLayout } from '~/components';

export default function ApiLayout() {
  return (
    <DocsLayout
      items={[
        {
          heading: 'Primitives',
          items: ['createForm', 'useField', 'useFieldArray'],
        },
        {
          heading: 'Components',
          items: ['Form', 'Field', 'FieldArray'],
        },
        {
          heading: 'Form methods',
          items: ['handleSubmit', 'reset', 'setResponse'],
        },
        {
          heading: 'Field methods',
          items: [
            'focus',
            'getValue',
            'getValues',
            'reset',
            'setError',
            'setValue',
            'validate',
          ],
        },
        {
          heading: 'Array methods',
          items: [
            'getArrayValues',
            'insert',
            'move',
            'remove',
            'replace',
            'reset',
            'setError',
            'swap',
            'validate',
          ],
        },
        {
          heading: 'Validation',
          items: [
            'custom',
            'email',
            'maxFiles',
            'maxLength',
            'maxNumber',
            'maxRange',
            'maxSize',
            'maxTotalSize',
            'mimeType',
            'minFiles',
            'minLength',
            'minNumber',
            'minRange',
            'minSize',
            'minTotalSize',
            'pattern',
            'required',
            'url',
            'value',
          ],
        },
        {
          heading: 'Types',
          items: [
            'ModularForm',
            'ModularField',
            'ModularFieldArray',
            'ModularValue',
            'ModularValues',
          ],
        },
      ]}
    />
  );
}
