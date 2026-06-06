import { TextLink } from './TextLink';

/**
 * Banner that informs visitors that the library is in maintenance mode and
 * recommends Formisch as its successor.
 */
export function Banner() {
  return (
    <div class="bg-yellow-100 px-4 py-2 text-center text-sm text-slate-700 md:text-base lg:py-2.5 dark:bg-yellow-400/10 dark:text-slate-300">
      Modular Forms is in maintenance mode. We recommend{' '}
      <TextLink href="https://formisch.dev/" target="_blank" colored underlined>
        Formisch
      </TextLink>
      , its official successor, for new projects.
    </div>
  );
}
