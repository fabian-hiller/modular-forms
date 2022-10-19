import { DocsLayout } from '~/components';

export default function GuidesLayout() {
  return (
    <DocsLayout
      items={[
        {
          heading: 'Get started',
          items: ['Introduction', 'Installation'],
        },
        {
          heading: 'Main concepts',
          items: [
            'Create a form',
            'Add fields to form',
            'Validate your fields',
            'Input components',
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
          items: ['TypeScript', 'FAQ'],
        },
      ]}
    />
  );
}
