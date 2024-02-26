import { LoadingIcon } from '../../../assets/LoadingIcon';
import { useHydratedRevision } from '../state/HydratedRevisionContext';

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
  const isProxy = !hydratedRevision?.content.read && hydratedRevision?.content.write;

  if (loading) return <LoadingIcon />;
  if (isProxy) return <div>Proxy Success</div>;

  return (
    <div>
      {children}
    </div>
  );
}
