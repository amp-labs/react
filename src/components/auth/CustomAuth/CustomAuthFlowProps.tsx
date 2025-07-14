import { Connection, ProviderInfo, MetadataItemInput } from "@generated/api/src";

export type CustomAuthFlowProps = {
  providerInfo: ProviderInfo;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  children: JSX.Element;
  selectedConnection: Connection | null;
  setSelectedConnection: (connection: Connection | null) => void;
  providerName?: string;
  onDisconnectSuccess?: (connection: Connection) => void;
  metadataFields: MetadataItemInput[];
};
