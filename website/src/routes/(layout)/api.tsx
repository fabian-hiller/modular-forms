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
              isSolid() ? 'custom' : 'custom$',
              'email',
              isSolid() ? 'maxFiles' : undefined,
              'maxLength',
              isSolid() ? 'maxNumber' : undefined,
              'maxRange',
              'maxSize',
              'maxTotalSize',
              'mimeType',
              isSolid() ? 'minFiles' : undefined,
              'minLength',
              isSolid() ? 'minNumber' : undefined,
              'minRange',
              'minSize',
              'minTotalSize',
              'pattern',
              'required',
              'url',
              'value',
            ].filter((item) => item) as string[],
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
              isSolid() ? 'FieldArrayState' : 'FieldArrayStore',
              'FieldElement',
              isQwik() ? 'FieldElementProps' : undefined,
              isSolid() ? 'FieldState' : 'FieldStore',
              'FieldValue',
              'FieldValues',
              isQwik() ? 'FormActionResult' : undefined,
              isQwik() ? 'FormActionStore' : undefined,
              'FormErrors',
              'FormResponse',
              isSolid() ? 'FormState' : 'FormStore',
              isQwik() ? 'ResponseData' : undefined,
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
