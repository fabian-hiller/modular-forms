import { DocsLayout, NavItemProps } from '~/components';
import { isQwik, isSolid } from '~/utils';

export default function ApiLayout() {
  return (
    <DocsLayout
      items={
        [
          isQwik()
            ? {
                heading: 'Actions',
                items: ['formAction$'],
              }
            : undefined,
          {
            heading: isSolid() ? 'Primitives' : 'Hooks',
            items: isSolid()
              ? ['createForm', 'createFormStore']
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
              'getError',
              'getValue',
              'getValues',
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
              'setValues',
              'swap',
              'validate',
            ],
          },
          {
            heading: 'Validation',
            items: [
              isSolid() ? 'custom' : 'custom$',
              'email',
              'maxLength',
              'maxRange',
              'maxSize',
              'maxTotalSize',
              'mimeType',
              'minLength',
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
            items: isSolid()
              ? ['zodField', 'zodForm']
              : ['zodField$', 'zodForm$'],
          },
          {
            heading: 'Types',
            items: [
              'FieldArrayStore',
              'FieldElement',
              'FieldElementProps',
              'FieldStore',
              'FieldValue',
              'FieldValues',
              isQwik() ? 'FormActionResult' : undefined,
              isQwik() ? 'FormActionStore' : undefined,
              'FormErrors',
              'FormOptions',
              'FormResponse',
              'FormStore',
              'ResponseData',
              'SubmitHandler',
              'ValidateField',
              'ValidateFieldArray',
              'ValidateForm',
            ].filter((item) => item) as string[],
          },
        ].filter((item) => item) as NavItemProps[]
      }
    />
  );
}
