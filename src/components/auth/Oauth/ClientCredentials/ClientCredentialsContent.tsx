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

import { useProviderMetadata } from "../../useProviderMetadata";

import { ClientCredentialsCredsContent } from "./ClientCredentialsCredsContent";

type ClientCredentialsFormProps = {
  handleSubmit: (creds: ClientCredentialsCredsContent) => void;
  isButtonDisabled?: boolean;
  explicitScopesRequired?: boolean;
  buttonVariant?: "ghost";
  requiredProviderMetadata?: MetadataItemInput[];
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
  requiredProviderMetadata = [],
}: ClientCredentialsFormProps) {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState<ClientCredentialsFormData>({
    clientSecret: "",
    clientId: "",
    scopes: "",
  });
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { getProviderMetadata, error, isProviderMetadataValid } =
    useProviderMetadata(formData, requiredProviderMetadata);

  const onToggleShowHide = () => setShow((prevShow) => !prevShow);

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
  const isScopesValid = explicitScopesRequired ? scopes.length > 0 : true;
  const isMetadataValid = isProviderMetadataValid();

  const isSubmitDisabled =
    isButtonDisabled ||
    !isClientSecretValid ||
    !isClientIdValid ||
    !isScopesValid ||
    !isMetadataValid;

  const onHandleSubmit = () => {
    const metadataResult = getProviderMetadata();

    if (requiredProviderMetadata.length > 0 && !isProviderMetadataValid()) {
      setSubmitError(error || "Please fill in all required fields.");
      return;
    }

    setSubmitError(null);

    const req: ClientCredentialsCredsContent = {
      clientId,
      clientSecret,
      providerMetadata: metadataResult?.providerMetadata,
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
        <div style={{ display: "flex", gap: ".5rem" }}>
          <FormComponent.Input
            id="clientSecret"
            name="clientSecret"
            type={show ? "text" : "password"}
            placeholder="Client Secret"
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
        {explicitScopesRequired && (
          <FormComponent.Textarea
            name="scopes"
            placeholder="Scopes separated by new line"
            onChange={handleChange}
          />
        )}

        {/* Metadata fields */}
        {requiredProviderMetadata.map((metadata) => (
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
  requiredProviderMetadata?: MetadataItemInput[];
};

export function ClientCredentialsContent({
  handleSubmit,
  error,
  isButtonDisabled,
  providerName,
  explicitScopesRequired,
  requiredProviderMetadata,
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
        requiredProviderMetadata={requiredProviderMetadata}
      />
    </AuthCardLayout>
  );
}
