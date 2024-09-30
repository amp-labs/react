import { Connection } from '@generated/api/src';

import { isChakraRemoved } from 'src/components/ui-base/constant';

import { NoWorkspaceOauthClientCredsFlow } from './deprecated/NoWorkspaceOauthClientCredsFlow';
import { WorkspaceOauthClientCredsFlow } from './deprecated/WorkspaceOauthClientCredsFlow';
import { ClientCredsContainer } from './ClientCredentialsContainer';

interface ClientCredsFlowProps {
  provider: string;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  providerName?: string;
  explicitScopesRequired?: boolean;
  explicitWorkspaceRequired: boolean;
  selectedConnection: Connection | null;
  setSelectedConnection: (connection: Connection | null) => void;
}
export function ClientCredentials({ ...props }: ClientCredsFlowProps) {
  if (isChakraRemoved) {
    return <ClientCredsContainer {...props} />;
  }

  if (props.explicitWorkspaceRequired) {
    return (<WorkspaceOauthClientCredsFlow {...props} />);
  }
  return (<NoWorkspaceOauthClientCredsFlow {...props} />);
}
