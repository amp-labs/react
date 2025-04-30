import { Connection } from "@generated/api/src";

import { ClientCredsContainer } from "./ClientCredentialsContainer";

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
  return <ClientCredsContainer {...props} />;
}
