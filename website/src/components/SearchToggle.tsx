import { useSearch } from '~/contexts';
import { SearchIcon } from '~/icons';
import { SystemIcon } from './SystemIcon';

/**
 * Icon button to open the search interface of the website.
 */
export function SearchToggle() {
  const [, setOpen] = useSearch();
  return (
    <SystemIcon
      label="Open search"
      icon={SearchIcon}
      type="button"
      onClick={() => setOpen(true)}
    />
  );
}
