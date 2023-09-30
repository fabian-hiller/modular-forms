import { DocsLayout } from '~/components';
import { isQwik, isSolid } from '~/contexts';

export default function ApiLayout() {
  return (
    <DocsLayout
      items={[
        isQwik() && {
          heading: 'Actions',
          items: ['formAction$'],
        },
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
            'getErrors',
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
            'submit',
            'swap',
            'validate',
          ],
        },
        {
          heading: 'Validation',
          items: [
            isQwik() ? 'custom$' : 'custom',
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
          heading: 'Transformation',
          items: [
            isQwik() ? 'toCustom$' : 'toCustom',
            'toLowerCase',
            'toTrimmed',
            'toUpperCase',
          ],
        },
        {
          heading: 'Exceptions',
          items: ['FormError'],
        },
        {
          heading: 'Adapters',
          items: isQwik()
            ? ['valiField$', 'valiForm$', 'zodField$', 'zodForm$']
            : ['valiField', 'valiForm', 'zodField', 'zodForm'],
        },
        {
          heading: 'Types',
          items: [
            'FieldArrayStore',
            'FieldElement',
            'FieldElementProps',
            'FieldEvent',
            'FieldStore',
            'FieldValue',
            'FieldValues',
            isQwik() && 'FormActionResult',
            isQwik() && 'FormActionStore',
            'FormErrors',
            'FormOptions',
            'FormResponse',
            'FormStore',
            isQwik() && 'InitialValues',
            'Maybe',
            'MaybeArray',
            isQwik() && 'MaybeFunction',
            'MaybePromise',
            'MaybeValue',
            'PartialValues',
            'ResponseData',
            'SubmitHandler',
            'TransformField',
            'ValidateField',
            'ValidateFieldArray',
            'ValidateForm',
          ],
        },
      ]}
    />
  );
}
