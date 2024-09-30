export type WorkspaceEntryProps = {
  handleSubmit: () => void;
  setWorkspace: (workspace: string) => void;
  error: string | null;
  isButtonDisabled?: boolean;
  providerName?: string;
};
