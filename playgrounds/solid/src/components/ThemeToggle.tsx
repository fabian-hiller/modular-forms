import { useTheme } from '~/contexts';
import { NightIcon, SunIcon } from '~/icons';

/**
 * Button for switching the color theme. Depending on the status, a sun or
 * night icon is displayed.
 */
export function ThemeToggle() {
  const [getTheme, setTheme] = useTheme();
  return (
    <button
      class="box-content h-5 w-5 p-4 transition-colors hover:text-slate-900 dark:hover:text-slate-200 md:h-[22px] md:w-[22px] lg:h-6 lg:w-6"
      type="button"
      onClick={() => setTheme((theme) => (theme === 'dark' ? 'light' : 'dark'))}
      aria-label={`Change theme to ${getTheme() === 'dark' ? 'light' : 'dark'}`}
    >
      <SunIcon class="hidden dark:block" />
      <NightIcon class="dark:hidden" />
    </button>
  );
}
