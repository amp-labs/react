import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ErrorBoundary, useErrorState } from "context/ErrorContextProvider";
import { useInstallIntegrationProps } from "context/InstallIIntegrationContextProvider/InstallIntegrationContextProvider";
import {
  HydratedIntegrationRead,
  HydratedIntegrationWriteObject,
  HydratedRevision,
} from "services/api";
import {
  ComponentContainerError,
  ComponentContainerLoading,
} from "src/components/Configure/ComponentContainer";
import { UpdateConnectionSection } from "src/components/Configure/content/manage/updateConnection/UpdateConnectionSection";
import { RemoveConnectionButton } from "src/components/Connect/RemoveConnectionButton";
import { InnerErrorTextBox } from "src/components/ErrorTextBox/ErrorTextBox";
import { useManifest } from "src/headless/manifest/useManifest";
import { capitalize } from "src/utils";
import { handleServerError } from "src/utils/handleServerError";

interface HydratedRevisionContextValue {
  hydratedRevision: HydratedRevision | null;
  loading: boolean;
  readAction?: HydratedIntegrationRead;
  writeObjects: HydratedIntegrationWriteObject[];
}

export const HydratedRevisionContext =
  createContext<HydratedRevisionContextValue>({
    hydratedRevision: null,
    loading: false,
    readAction: undefined,
    writeObjects: [],
  });

export const useHydratedRevision = () => {
  const context = useContext(HydratedRevisionContext);

  if (!context) {
    throw new Error(
      "useHydratedRevision must be used within a HydratedRevisionProvider",
    );
  }

  return context;
};

type HydratedRevisionProviderProps = {
  children?: React.ReactNode;
  resetComponent: () => void; // optional prop to reset the component on error
};

export function HydratedRevisionProvider({
  children,
  resetComponent,
}: HydratedRevisionProviderProps) {
  const { integrationId, integrationObj } = useInstallIntegrationProps();
  const { isError, removeError, setError } = useErrorState();
  const errorIntegrationIdentifier = integrationObj?.name || integrationId;
  const [readableErrorMsg, setReadableErrorMsg] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const {
    data: hydratedRevision,
    isLoading: isHydratedRevisionLoading,
    isError: isHydratedRevisionError,
    error: hydrateRevisionError,
    isSuccess: isHydratedRevisionSuccess,
  } = useManifest();

  useEffect(() => {
    if (!isHydratedRevisionSuccess && !isHydratedRevisionError) {
      // Do nothing, we are waiting for the query to complete.
    } else if (isHydratedRevisionError) {
      setError(ErrorBoundary.HYDRATED_REVISION, errorIntegrationIdentifier);
      if (hydrateRevisionError)
        handleServerError(hydrateRevisionError, setReadableErrorMsg);
    } else {
      removeError(ErrorBoundary.HYDRATED_REVISION, errorIntegrationIdentifier);
      setReadableErrorMsg(null);
      setConnectionError(null);
    }
  }, [
    isHydratedRevisionError,
    isHydratedRevisionSuccess,
    errorIntegrationIdentifier,
    setError,
    removeError,
    hydrateRevisionError,
    setReadableErrorMsg,
  ]);

  const contextValue = useMemo(
    () => ({
      hydratedRevision: hydratedRevision || null,
      loading: isHydratedRevisionLoading,
      readAction: hydratedRevision?.content?.read,
      writeObjects: hydratedRevision?.content?.write?.objects || [],
    }),
    [hydratedRevision, isHydratedRevisionLoading],
  );

  const providerName = integrationObj?.provider || "provider";

  if (isError(ErrorBoundary.HYDRATED_REVISION, errorIntegrationIdentifier)) {
    const intNameOrId =
      integrationObj?.name || integrationId || "unknown integration";
    const errorMsg = `${
      readableErrorMsg
        ? capitalize(readableErrorMsg)
        : `Error retrieving objects from ${providerName} or integration details for ${intNameOrId}`
    }`;

    return (
      <ComponentContainerError message={errorMsg}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            paddingTop: "1rem",
            width: "100%",
          }}
        >
          <UpdateConnectionSection provider={providerName} />
          <p>
            If authentication is failing, please try reauthenticating using the
            section above before deleting and recreating the connection.
          </p>
          {connectionError && <InnerErrorTextBox message={connectionError} />}
          <RemoveConnectionButton
            buttonText="Delete Connection"
            resetComponent={resetComponent}
            buttonVariant="danger"
            onDisconnectError={(error: string) => setConnectionError(error)}
          />
        </div>
      </ComponentContainerError>
    );
  }

  if (isHydratedRevisionLoading) return <ComponentContainerLoading />;

  return (
    <HydratedRevisionContext.Provider value={contextValue}>
      {children}
    </HydratedRevisionContext.Provider>
  );
}
