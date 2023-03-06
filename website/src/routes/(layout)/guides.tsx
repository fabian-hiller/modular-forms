import { DocsLayout } from '~/components';
import { isSolid } from '~/utils';

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
            'Create a form',
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
            'Nested fields',
            'Field arrays',
          ],
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
