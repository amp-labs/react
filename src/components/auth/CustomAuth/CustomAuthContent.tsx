import { useState } from "react";
import { MetadataItemInput, ProviderInfo } from "@generated/api/src";
import { AuthErrorAlert } from "src/components/auth/AuthErrorAlert/AuthErrorAlert";
import { FormComponent } from "src/components/form";
import { Button } from "src/components/ui-base/Button";
import {
  AuthCardLayout,
  AuthTitle,
} from "src/layout/AuthCardLayout/AuthCardLayout";
import { capitalize } from "src/utils";

import { DocsHelperTextMinimal } from "components/Docs/DocsHelperTextMinimal";

import {
  getProviderMetadata,
  isProviderMetadataValid,
} from "../providerMetadata";

import { CustomAuthFormData, LandingContentProps } from "./LandingContentProps";

type CustomAuthFormProps = {
  providerInfo: ProviderInfo;
  handleSubmit: (form: CustomAuthFormData) => void;
  isButtonDisabled?: boolean;
  buttonVariant?: "ghost";
};

export function CustomAuthForm({
  providerInfo,
  handleSubmit,
  isButtonDisabled,
  buttonVariant,
}: CustomAuthFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const metadataFields = providerInfo.metadata?.input || [];

  const handleChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.currentTarget;
    setFormData((prevData) => ({ ...prevData, [name]: value.trim() }));
  };

  const isMetadataValid = isProviderMetadataValid(metadataFields, formData);
  const isSubmitDisabled = isButtonDisabled || !isMetadataValid;
  const customInputs = providerInfo.customOpts?.inputs || [];

  const onHandleSubmit = () => {
    const metadata = getProviderMetadata(metadataFields, formData);
    const customAuthFields = Object.fromEntries(
      customInputs.map((input) => [input.name, formData[input.name]]),
    );

    handleSubmit({
      customAuth: customAuthFields,
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
      {customInputs.map((input) => (
        <div key={input.name}>
          {input.docsURL && (
            <DocsHelperTextMinimal
              url={input.docsURL}
              prompt={input.prompt || input.displayName}
              inputName={input.displayName}
            />
          )}
          <FormComponent.PasswordInput
            id={input.name}
            name={input.name}
            placeholder={input.displayName}
            onChange={handleChange}
          />
        </div>
      ))}
      {/* do we support metadata fields and custom auth at the same time? */}
      {metadataFields.map((metadata: MetadataItemInput) => (
        <div key={metadata.name}>
          {metadata.docsURL && (
            <DocsHelperTextMinimal
              url={metadata.docsURL}
              prompt={metadata.displayName || metadata.name}
              inputName={metadata.displayName}
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
        type="submit"
        onClick={onHandleSubmit}
        variant={buttonVariant}
      >
        Next
      </Button>
    </div>
  );
}

export function CustomAuthContent({
  providerInfo,
  handleSubmit,
  error,
  isButtonDisabled,
}: LandingContentProps) {
  return (
    <AuthCardLayout>
      <AuthTitle>{`Set up ${providerInfo.displayName} integration`}</AuthTitle>
      <AuthErrorAlert error={error} />
      <CustomAuthForm
        providerInfo={providerInfo}
        handleSubmit={handleSubmit}
        isButtonDisabled={isButtonDisabled}
      />
    </AuthCardLayout>
  );
}
