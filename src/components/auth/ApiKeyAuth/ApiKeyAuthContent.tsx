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

import { DocsHelperText, MetadataHelperText } from "components/Docs/DocsHelperText";

import {
  getProviderMetadata,
  isProviderMetadataValid,
} from "../providerMetadata";

import { IFormType, LandingContentProps } from "./LandingContentProps";

type ApiKeyAuthFormProps = {
  provider: string;
  providerInfo: ProviderInfo;
  handleSubmit: (form: IFormType) => void;
  isButtonDisabled?: boolean;
  buttonVariant?: "ghost";
  submitButtonType?: "submit" | "button";
  metadataInputs: MetadataItemInput[];
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
  metadataInputs,
}: ApiKeyAuthFormProps) {
  const [formData, setFormData] = useState<ApiKeyFormData>({ apiKey: "" });

  const handleChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.currentTarget;
    setFormData((prevData) => ({ ...prevData, [name]: value.trim() }));
  };

  const { apiKey } = formData;
  const { providerName } = useProvider(provider);

  const isApiKeyValid = apiKey.length > 0;
  const isMetadataValid = isProviderMetadataValid(metadataInputs, formData);
  const isSubmitDisabled =
    isButtonDisabled || !isApiKeyValid || !isMetadataValid;
  const docsURL = providerInfo.apiKeyOpts?.docsURL;

  const onHandleSubmit = () => {
    const metadata = getProviderMetadata(metadataInputs, formData);

    handleSubmit({
      apiKey,
      providerMetadata: metadata,
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
      <FormComponent.PasswordInput
        id="apiKey"
        name="apiKey"
        placeholder="API Key"
        onChange={handleChange}
      />
      {metadataInputs.map((metadata: MetadataItemInput) => (
        <div key={metadata.name}>
          {metadata.docsURL && (
            <MetadataHelperText
              url={metadata.docsURL}
              fieldName={metadata.displayName || metadata.name}
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
  metadataInputs,
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
        isButtonDisabled={isButtonDisabled || !!error}
        metadataInputs={metadataInputs}
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
