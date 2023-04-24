import { GitHubIcon } from '~/icons';
import { SystemIcon } from './SystemIcon';

/**
 * GitHub icon pointing to our repository.
 */
export function GitHubIconLink() {
  return (
    <SystemIcon
      icon={GitHubIcon}
      label="Open GitHub repository"
      type="link"
      href={import.meta.env.VITE_GITHUB_URL}
      target="_blank"
    />
  );
}
