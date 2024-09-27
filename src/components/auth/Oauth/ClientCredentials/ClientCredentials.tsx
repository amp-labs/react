import { Connection } from '@generated/api/src';

import { NoWorkspaceOauthClientCredsFlow } from './NoWorkspaceOauthClientCredsFlow';
import { WorkspaceOauthClientCredsFlow } from './WorkspaceOauthClientCredsFlow';

interface ClientCredsFlowProps {
  provider: string;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  providerName?: string;
  explicitScopesRequired?: boolean;
  explicitWorkspaceRequired?: boolean;
  selectedConnection: Connection | null;
  setSelectedConnection: (connection: Connection | null) => void;
}
export function ClientCredentials({ ...props }: ClientCredsFlowProps) {
  if (props.explicitWorkspaceRequired) {
    return (<WorkspaceOauthClientCredsFlow {...props} />);
  }
  return (<NoWorkspaceOauthClientCredsFlow {...props} />);
}
