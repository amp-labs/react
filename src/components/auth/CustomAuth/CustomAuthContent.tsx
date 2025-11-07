import { useState } from "react";
import { MetadataItemInput, ProviderInfo } from "@generated/api/src";
import { AuthErrorAlert } from "src/components/auth/AuthErrorAlert/AuthErrorAlert";
import { FormComponent } from "src/components/form";
import { Button } from "src/components/ui-base/Button";
import {
  AuthCardLayout,
  AuthTitle,
} from "src/layout/AuthCardLayout/AuthCardLayout";

import { DocsHelperTextHeader } from "components/Docs/DocsHelperTextMinimal";

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
  metadataInputs: MetadataItemInput[];
};

export function CustomAuthForm({
  providerInfo,
  handleSubmit,
  isButtonDisabled,
  buttonVariant,
  metadataInputs,
}: CustomAuthFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.currentTarget;
    setFormData((prevData) => ({ ...prevData, [name]: value.trim() }));
  };

  const isMetadataValid = isProviderMetadataValid(metadataInputs, formData);
  const isSubmitDisabled = isButtonDisabled || !isMetadataValid;
  const customInputs = providerInfo.customOpts?.inputs || [];

  const onHandleSubmit = () => {
    const metadata = getProviderMetadata(metadataInputs, formData);
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
          <DocsHelperTextHeader
            url={input.docsURL}
            prompt={input.prompt}
            inputName={input.displayName}
          />
          <FormComponent.PasswordInput
            id={input.name}
            name={input.name}
            onChange={handleChange}
            placeholder={""}
          />
        </div>
      ))}
      {/* do we support metadata fields and custom auth at the same time? */}
      {metadataInputs.map((metadata: MetadataItemInput) => (
        <div key={metadata.name}>
          {metadata.docsURL && (
            <DocsHelperTextHeader
              url={metadata.docsURL}
              prompt={metadata.displayName || metadata.name}
              inputName={metadata.displayName || metadata.name}
            />
          )}
          <FormComponent.Input
            id={metadata.name}
            name={metadata.name}
            type="text"
            placeholder={""}
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
  metadataInputs,
}: LandingContentProps) {
  return (
    <AuthCardLayout>
      <AuthTitle>{`Set up ${providerInfo.displayName} integration`}</AuthTitle>
      <AuthErrorAlert error={error} />
      <CustomAuthForm
        providerInfo={providerInfo}
        handleSubmit={handleSubmit}
        isButtonDisabled={isButtonDisabled || !!error}
        metadataInputs={metadataInputs}
      />
    </AuthCardLayout>
  );
}
