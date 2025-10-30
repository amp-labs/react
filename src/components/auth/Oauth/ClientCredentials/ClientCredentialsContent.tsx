import { useState } from "react";
import { MetadataItemInput } from "@generated/api/src";
import { AuthErrorAlert } from "src/components/auth/AuthErrorAlert/AuthErrorAlert";
import { FormComponent } from "src/components/form";
import { Button } from "src/components/ui-base/Button";
import {
  AuthCardLayout,
  AuthTitle,
} from "src/layout/AuthCardLayout/AuthCardLayout";
import { convertTextareaToArray } from "src/utils";

import {
  getProviderMetadata,
  isProviderMetadataValid,
} from "../../providerMetadata";

import { ClientCredentialsCredsContent } from "./ClientCredentialsCredsContent";

type ClientCredentialsFormProps = {
  handleSubmit: (creds: ClientCredentialsCredsContent) => void;
  isButtonDisabled?: boolean;
  explicitScopesRequired?: boolean;
  buttonVariant?: "ghost";
  metadataFields: MetadataItemInput[];
};

type ClientCredentialsFormData = {
  clientSecret: string;
  clientId: string;
  scopes: string;
  [key: string]: string; // Allow dynamic metadata fields
};

export function ClientCredentialsForm({
  handleSubmit,
  isButtonDisabled,
  explicitScopesRequired,
  buttonVariant,
  metadataFields,
}: ClientCredentialsFormProps) {
  const [formData, setFormData] = useState<ClientCredentialsFormData>({
    clientSecret: "",
    clientId: "",
    scopes: "",
  });
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.currentTarget;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value.trim(),
    }));

    setSubmitError(null);
  };

  const { clientSecret, clientId, scopes } = formData;

  const isClientSecretValid = clientSecret.length > 0;
  const isClientIdValid = clientId.length > 0;
  const isMetadataValid = isProviderMetadataValid(metadataFields, formData);

  const isSubmitDisabled =
    isButtonDisabled ||
    !isClientSecretValid ||
    !isClientIdValid ||
    !isMetadataValid;

  const onHandleSubmit = () => {
    const metadata = getProviderMetadata(metadataFields, formData);

    const req: ClientCredentialsCredsContent = {
      clientId,
      clientSecret,
      providerMetadata: metadata,
    };

    if (explicitScopesRequired && scopes.length > 0) {
      req.scopes = convertTextareaToArray(scopes);
    }

    handleSubmit(req);
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
        <FormComponent.Input
          id="clientId"
          name="clientId"
          type="text"
          placeholder="Client ID"
          onChange={handleChange}
        />
        <FormComponent.PasswordInput
          id="clientSecret"
          name="clientSecret"
          placeholder="Client Secret"
          onChange={handleChange}
        />
        {explicitScopesRequired && (
          <FormComponent.Textarea
            name="scopes"
            placeholder="Scopes separated by new line"
            onChange={handleChange}
          />
        )}

        {metadataFields.map((metadata) => (
          <FormComponent.Input
            key={metadata.name}
            id={metadata.name}
            name={metadata.name}
            type="text"
            placeholder={metadata.displayName || metadata.name}
            onChange={handleChange}
          />
        ))}
      </div>
      <AuthErrorAlert error={submitError} />
      <br />
      <Button
        style={{ width: "100%" }}
        disabled={isSubmitDisabled}
        type="button"
        onClick={onHandleSubmit}
        variant={buttonVariant}
      >
        Next
      </Button>
    </>
  );
}

type ClientCredentialsContentProps = {
  handleSubmit: (creds: ClientCredentialsCredsContent) => void;
  error: string | null;
  explicitScopesRequired?: boolean;
  isButtonDisabled?: boolean;
  providerName?: string;
  metadataFields: MetadataItemInput[];
};

export function ClientCredentialsContent({
  handleSubmit,
  error,
  isButtonDisabled,
  providerName,
  explicitScopesRequired,
  metadataFields,
}: ClientCredentialsContentProps) {
  return (
    <AuthCardLayout>
      <AuthTitle>{`Set up ${providerName} integration`}</AuthTitle>
      <AuthErrorAlert error={error} />
      <br />
      <ClientCredentialsForm
        handleSubmit={handleSubmit}
        isButtonDisabled={isButtonDisabled}
        explicitScopesRequired={explicitScopesRequired}
        metadataFields={metadataFields}
      />
    </AuthCardLayout>
  );
}
