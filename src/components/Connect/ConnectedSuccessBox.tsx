import { useProjectQuery } from "src/hooks/query";
import { useProvider } from "src/hooks/useProvider";
import { Connection } from "src/services/api";

import { SuccessTextBox } from "../SuccessTextBox/SuccessTextBox";

import { ManageConnectionSection } from "./ManageConnectionSection";

interface ConnectedSuccessBoxProps {
  resetComponent: () => void; // reset the ConnectProvider component
  provider: string;
  onDisconnectSuccess?: (connection: Connection) => void;
}
export function ConnectedSuccessBox({
  provider,
  onDisconnectSuccess,
  resetComponent,
}: ConnectedSuccessBoxProps) {
  const { appName } = useProjectQuery();
  const { providerName } = useProvider(provider);

  const text = `You have successfully connected your ${providerName} account to ${appName}.`;
  return (
    <SuccessTextBox text={text}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "100%",
        }}
      >
        <ManageConnectionSection
          resetComponent={resetComponent}
          onDisconnectSuccess={onDisconnectSuccess}
          provider={provider}
        />
      </div>
    </SuccessTextBox>
  );
}
