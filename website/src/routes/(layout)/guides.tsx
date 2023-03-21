import { DocsLayout } from '~/components';
import { isQwik, isSolid } from '~/utils';

export default function GuidesLayout() {
  return (
    <DocsLayout
      items={[
        {
          heading: 'Get started',
          items: ['Introduction', 'Philosophy', 'Installation'],
        },
        {
          heading: 'Main concepts',
          items: [
            'Define your form',
            'Create your form',
            'Add fields to form',
            'Validate your fields',
            'Input components',
            'Handle submission',
            'Form methods',
          ],
        },
        {
          heading: 'Advanced guides',
          items: [
            'Controlled fields',
            'Special inputs',
            isQwik() ? 'Enhanced forms' : undefined,
            'Nested fields',
            'Field arrays',
          ].filter((item) => item) as string[],
        },
        {
          heading: 'Others',
          items: [
            'TypeScript',
            isSolid() ? 'Kobalte' : undefined,
            'FAQ',
          ].filter((item) => item) as string[],
        },
      ]}
      lowerCase
    />
  );
}
