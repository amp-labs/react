import { useState } from "react";
import { MetadataItemInput, ProviderInfo } from "@generated/api/src";
import { AuthErrorAlert } from "src/components/auth/AuthErrorAlert/AuthErrorAlert";
import { FormComponent } from "src/components/form";
import { Button } from "src/components/ui-base/Button";
import { useProvider } from "src/hooks/useProvider";
import {
  AuthCardLayout,
  AuthTitle,
} from "src/layout/AuthCardLayout/AuthCardLayout";
import { capitalize } from "src/utils";

import { DocsHelperText } from "components/Docs/DocsHelperText";

import { useProviderMetadata } from "../useProviderMetadata";

import { IFormType, LandingContentProps } from "./LandingContentProps";

type ApiKeyAuthFormProps = {
  provider: string;
  providerInfo: ProviderInfo;
  handleSubmit: (form: IFormType) => void;
  isButtonDisabled?: boolean;
  buttonVariant?: "ghost";
  submitButtonType?: "submit" | "button";
  requiredProviderMetadata?: MetadataItemInput[];
};

type ApiKeyFormData = {
  apiKey: string;
  [key: string]: string;
};

export function ApiKeyAuthForm({
  provider,
  providerInfo,
  handleSubmit,
  isButtonDisabled,
  buttonVariant,
  submitButtonType,
  requiredProviderMetadata = [],
}: ApiKeyAuthFormProps) {
  const [show, setShow] = useState(false);
  const onToggleShowHide = () => setShow((prevShow) => !prevShow);
  const [formData, setFormData] = useState<ApiKeyFormData>({ apiKey: "" });
  const { getProviderMetadata, error, isProviderMetadataValid } = useProviderMetadata(
    formData,
    requiredProviderMetadata,
  );

  const handleChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.currentTarget;
    setFormData((prevData) => ({ ...prevData, [name]: value.trim() }));
  };

  const { apiKey } = formData;
  const { providerName } = useProvider(provider);

  const isApiKeyValid = apiKey.length > 0;
  const isMetadataValid = requiredProviderMetadata.length === 0 || isProviderMetadataValid();

  const isSubmitDisabled =
    isButtonDisabled || !isApiKeyValid || !isMetadataValid;
  const docsURL = providerInfo.apiKeyOpts?.docsURL;

  const onHandleSubmit = () => {
    const metadataResult = getProviderMetadata();
    handleSubmit({
      apiKey,
      providerMetadata: metadataResult?.providerMetadata,
    });
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        flexDirection: "column",
        marginTop: "1rem",
      }}
    >
      {docsURL && (
        <DocsHelperText
          url={docsURL}
          providerDisplayName={providerName || capitalize(provider)}
          credentialName="API key"
        />
      )}
      <div style={{ display: "flex", gap: ".5rem" }}>
        <FormComponent.Input
          id="apiKey"
          name="apiKey"
          type={show ? "text" : "password"}
          placeholder="API Key"
          onChange={handleChange}
        />
        <Button
          type="button"
          style={{ height: "2.5rem", width: "5rem" }}
          onClick={onToggleShowHide}
          variant={buttonVariant}
        >
          {show ? "Hide" : "Show"}
        </Button>
      </div>
      {requiredProviderMetadata.map((metadata) => (
        <div key={metadata.name}>
          {metadata.docsURL && (
            <DocsHelperText
              url={metadata.docsURL}
              providerDisplayName={providerName || capitalize(provider)}
              credentialName={metadata.displayName || metadata.name}
            />
          )}
          <FormComponent.Input
            id={metadata.name}
            name={metadata.name}
            type="text"
            placeholder={metadata.displayName || metadata.name}
            onChange={handleChange}
          />
        </div>
      ))}
      <AuthErrorAlert error={error} />
      <Button
        style={{ marginTop: "1em", width: "100%" }}
        disabled={isSubmitDisabled}
        type={submitButtonType || "submit"}
        onClick={onHandleSubmit}
        variant={buttonVariant}
      >
        Next
      </Button>
    </div>
  );
}

function ApiKeyAuthContentForm({
  provider,
  providerInfo,
  handleSubmit,
  error,
  isButtonDisabled,
  requiredProviderMetadata,
}: LandingContentProps) {
  const { providerName } = useProvider(provider);

  return (
    <AuthCardLayout>
      <AuthTitle>{`Set up ${providerName} integration`}</AuthTitle>
      <AuthErrorAlert error={error} />
      <ApiKeyAuthForm
        provider={provider}
        providerInfo={providerInfo}
        handleSubmit={handleSubmit}
        isButtonDisabled={isButtonDisabled}
        requiredProviderMetadata={requiredProviderMetadata}
      />
    </AuthCardLayout>
  );
}

/**
 * bridge for Chakra UI / native form
 * @param param0
 * @returns
 */
export function ApiKeyAuthContent({ ...props }: LandingContentProps) {
  return <ApiKeyAuthContentForm {...props} />;
}
