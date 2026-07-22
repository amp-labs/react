import { useCallback, useEffect, useRef, useState } from "react";
import {
  CustomAuthConnectResponse,
  CustomAuthConnectResponseOneOf,
  RedirectResponse,
} from "@generated/api/src";
import { useQueryClient } from "@tanstack/react-query";
import { useAmpersandProviderProps } from "src/context/AmpersandContextProvider";
import { useCustomAuthConnectMutation } from "src/hooks/mutation/useCustomAuthConnectMutation";
import { AMP_SERVER } from "src/services/api";
import { handleServerError } from "src/utils/handleServerError";

import { CustomAuthFlowProps } from "../CustomAuthFlowProps";
import { CustomAuthFormData } from "../LandingContentProps";

import { MultiStepCustomAuthContent } from "./MultiStepCustomAuthContent";

const POPUP_WIDTH = 600; // px
const POPUP_HEIGHT = 600; // px

// The message source the custom-auth callback (served by the API) posts to
// window.opener; we ignore any message that doesn't carry it.
const CALLBACK_MESSAGE_SOURCE = "ampersand-custom-auth";

// The custom-auth callback (served by the API) posts this to window.opener. It
// is intentionally dumb: params are the raw query/body params the provider sent,
// which we forward to /custom-auth/connect to resume the flow.
type CustomAuthCallbackMessage = {
  source: typeof CALLBACK_MESSAGE_SOURCE;
  params: Record<string, string>;
};

/**
 * Drives a multi-step custom auth flow: submit the form to /custom-auth/connect,
 * and while the server returns a redirect, open it in a popup and resume with the
 * params the callback forwards, until the server returns a successfully created Connection.
 */
export function MultiStepCustomAuthFlow({
  providerInfo,
  consumerRef,
  consumerName,
  groupRef,
  groupName,
  children,
  selectedConnection,
  metadataInputs,
  moduleError,
}: CustomAuthFlowProps) {
  const { projectIdOrName } = useAmpersandProviderProps();
  const queryClient = useQueryClient();
  const { mutateAsync: customAuthConnectAsync, isPending } =
    useCustomAuthConnectMutation();
  const popupRef = useRef<Window | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const [error, setError] = useState<string | null>(moduleError || null);

  const openPopup = (url: string) => {
    const left = window.screenX + (window.outerWidth - POPUP_WIDTH) / 2;
    const top = window.screenY + (window.outerHeight - POPUP_HEIGHT) / 2.5;
    const dimensions = `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},left=${left},top=${top}`;
    popupRef.current = window.open(url, "CustomAuthPopup", dimensions);
  };

  const handleResult = useCallback(
    (res: CustomAuthConnectResponse) => {
      const redirect: RedirectResponse | undefined = (
        res as CustomAuthConnectResponseOneOf
      ).redirect;

      if (redirect) {
        sessionIdRef.current = redirect.sessionId;
        openPopup(redirect.url);
        return;
      }

      // A connection means the flow is complete; refresh the cached list.
      sessionIdRef.current = null;
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["amp", "connections"] });
    },
    [queryClient],
  );

  // One-time listener: the callback popup forwards the provider's params here.
  useEffect(() => {
    const onMessage = (ev: MessageEvent<CustomAuthCallbackMessage>) => {
      // Accept only messages from the API origin (where the callback is served).
      if (ev.origin !== AMP_SERVER) return;
      if (ev.data?.source !== CALLBACK_MESSAGE_SOURCE) return;

      const sessionId = sessionIdRef.current;
      popupRef.current?.close();
      if (!sessionId) return;

      customAuthConnectAsync({
        customAuthConnectParams: {
          projectIdOrName,
          sessionId,
          callbackParams: ev.data.params,
        },
      })
        .then(handleResult)
        .catch((err) => handleServerError(err, setError));
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [projectIdOrName, customAuthConnectAsync, handleResult]);

  const onNext = useCallback(
    (form: CustomAuthFormData) => {
      setError(null);
      customAuthConnectAsync({
        customAuthConnectParams: {
          projectIdOrName,
          provider: providerInfo.name,
          groupRef,
          groupName,
          consumerRef,
          consumerName,
          customAuth: form.customAuth,
          ...(form.providerMetadata && {
            providerMetadata: form.providerMetadata,
          }),
        },
      })
        .then(handleResult)
        .catch((err) => handleServerError(err, setError));
    },
    [
      projectIdOrName,
      providerInfo.name,
      groupRef,
      groupName,
      consumerRef,
      consumerName,
      customAuthConnectAsync,
      handleResult,
    ],
  );

  if (selectedConnection === null) {
    return (
      <MultiStepCustomAuthContent
        providerInfo={providerInfo}
        handleSubmit={onNext}
        error={error}
        isButtonDisabled={isPending}
        metadataInputs={metadataInputs}
      />
    );
  }

  return children;
}
