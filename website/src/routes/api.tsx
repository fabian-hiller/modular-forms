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
          items: ['Field', 'FieldArray', 'Form'],
        },
        {
          heading: 'Methods',
          items: [
            'clearError',
            'clearResponse',
            'focus',
            'getArrayValues',
            'getError',
            'getValue',
            'getValues',
            'handleSubmit',
            'hasField',
            'hasFieldArray',
            'insert',
            'move',
            'remove',
            'replace',
            'reset',
            'setError',
            'setResponse',
            'setValue',
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
          heading: 'Adapters',
          items: ['zodField', 'zodForm'],
        },
        {
          heading: 'Types',
          items: [
            'FieldArrayState',
            'FieldElement',
            'FieldState',
            'FieldValue',
            'FieldValues',
            'FormErrors',
            'FormState',
            'Response',
            'ValidateField',
            'ValidateFieldArray',
          ],
        },
      ]}
    />
  );
}
