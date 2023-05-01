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
          heading: 'Transformation',
          items: [isSolid() ? 'toCustom' : 'toCustom$'],
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
            isQwik() && 'MaybeQRL',
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
