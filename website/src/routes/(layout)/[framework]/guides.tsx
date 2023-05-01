import { DocsLayout } from '~/components';
import { isQwik, isSolid } from '~/contexts';

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
            'Transform inputs',
            'Special inputs',
            isQwik() && 'Enhanced forms',
            'Nested fields',
            'Field arrays',
          ],
        },
        {
          heading: 'Others',
          items: ['TypeScript', isSolid() && 'Kobalte', 'FAQ'],
        },
      ]}
      lowerCase
    />
  );
}
