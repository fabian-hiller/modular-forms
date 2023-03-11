import { DocsLayout } from '~/components';
import { isQwik, isSolid } from '~/utils';

export default function ApiLayout() {
  return (
    <DocsLayout
      items={[
        {
          heading: isSolid() ? 'Primitives' : 'Hooks',
          items: isSolid()
            ? ['createForm', 'useField', 'useFieldArray']
            : ['useForm', 'useFormStore'],
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
            isSolid() ? 'handleSubmit' : undefined,
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
          ].filter((item) => item) as string[],
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
            isSolid() ? 'FieldArrayState' : 'FieldArrayStore',
            'FieldElement',
            isQwik() ? 'FieldElementProps' : undefined,
            isSolid() ? 'FieldState' : 'FieldStore',
            'FieldValue',
            'FieldValues',
            'FormErrors',
            'FormResponse',
            isSolid() ? 'FormState' : 'FormStore',
            'ValidateField',
            'ValidateFieldArray',
          ].filter((item) => item) as string[],
        },
      ]}
    />
  );
}
