import { useTheme } from '~/contexts';
import { NightIcon, SunIcon } from '~/icons';
import { SystemIcon } from './SystemIcon';

/**
 * Button for switching the color theme. Depending on the status, a sun or
 * night icon is displayed.
 */
export function ThemeToggle() {
  const [getTheme, setTheme] = useTheme();
  return (
    <SystemIcon
      type="button"
      label={`Change theme to ${getTheme() === 'dark' ? 'light' : 'dark'}`}
      onClick={() => setTheme((theme) => (theme === 'dark' ? 'light' : 'dark'))}
    >
      <SunIcon class="hidden h-full dark:block" />
      <NightIcon class="h-full dark:hidden" />
    </SystemIcon>
  );
}
