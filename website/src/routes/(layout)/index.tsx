import { ActionButton, ButtonGroup, Description, Title } from '~/components';
import { getFramework } from '~/contexts';
import { LogoIcon } from '~/icons';

export default function HomePage() {
  return (
    <>
      <Title>Modular Forms: The modular and type-safe form library</Title>
      <Description>
        Modular Forms is a JavaScript library built on SolidJS and Qwik to
        validate and handle various types of forms.
      </Description>

      <main class="flex h-full flex-1 flex-col items-center space-y-8 py-32 md:space-y-12 md:py-40 lg:justify-center lg:space-y-16">
        <h1 class="flex items-center text-2xl font-medium text-slate-900 dark:text-slate-200 md:text-[28px] lg:text-4xl">
          <LogoIcon class="mr-3 h-9 md:mr-4 md:h-10 lg:mr-6 lg:h-[52px]" />
          Modular Forms
        </h1>
        <p class="max-w-[400px] px-4 text-center text-lg leading-loose md:max-w-[440px] md:text-xl md:leading-loose lg:max-w-[640px] lg:text-3xl lg:leading-loose">
          The modular and type-safe form library for SolidJS and Qwik
        </p>

        <ButtonGroup class="justify-center">
          <ActionButton
            variant="primary"
            label="Get started"
            type="link"
            href={`/${getFramework()}/guides`}
          />
          <ActionButton
            variant="secondary"
            label="Playground"
            type="link"
            href={`/${getFramework()}/playground`}
          />
        </ButtonGroup>
      </main>
    </>
  );
}
