import { useEffect } from 'react';

import { LoadingIcon } from '../../../../assets/LoadingIcon';
import { useHydratedRevision } from '../../state/HydratedRevisionContext';

import { InstalledSuccessBox } from './InstalledSuccessBox';

interface ConditionalProxyLayoutProps {
  children: React.ReactNode;
}

/**
 * if the hydratedRevision does not have read or write,
 * then it will not render the ConfigureInstallation
 * @returns
 */
export function ConditionalProxyLayout({ children }: ConditionalProxyLayoutProps) {
  const { hydratedRevision, loading } = useHydratedRevision();
  const provider = hydratedRevision?.content?.provider;

  // // TMP remove read and write
  // if (hydratedRevision) {
  //   hydratedRevision.content.read = undefined;
  //   hydratedRevision.content.write = undefined;
  // }

  const isProxy = !hydratedRevision?.content.read && !hydratedRevision?.content.write;

  useEffect(() => {
    if (isProxy) {
      console.warn('trigger createInstallation not implmented yet');
    }
  }, [hydratedRevision, isProxy]);

  if (loading) return <LoadingIcon />;
  if (isProxy && provider) return <InstalledSuccessBox provider={provider} />;

  return (
    <div>
      {children}
    </div>
  );
}
