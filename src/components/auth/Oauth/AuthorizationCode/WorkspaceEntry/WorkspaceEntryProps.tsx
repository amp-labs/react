import { MetadataItemInput } from "@generated/api/src";

export type WorkspaceEntryProps = {
  handleSubmit: () => void;
  setFormData: (metadata: string, value: string) => void;
  error: string | null;
  isButtonDisabled?: boolean;
  providerName?: string;
  metadataInputs: MetadataItemInput[];
};
