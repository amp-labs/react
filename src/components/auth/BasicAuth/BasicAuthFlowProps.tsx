import {
  Connection,
  MetadataItemInput,
  ProviderInfo,
} from "@generated/api/src";

export type BasicAuthFlowProps = {
  provider: string;
  providerInfo: ProviderInfo;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
  children: JSX.Element;
  selectedConnection: Connection | null;
  setSelectedConnection: (connection: Connection | null) => void;
  metadataFields: MetadataItemInput[];
};
