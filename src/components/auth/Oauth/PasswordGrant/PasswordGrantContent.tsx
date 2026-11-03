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

import { MetadataInput } from "components/auth/MetadataInput";

import {
  getProviderMetadata,
  isProviderMetadataValid,
} from "../../providerMetadata";

import { PasswordGrantCreds } from "./PasswordGrantCreds";

type PasswordGrantFormProps = {
  handleSubmit: (creds: PasswordGrantCreds) => void;
  isButtonDisabled?: boolean;
  explicitScopesRequired?: boolean;
  buttonVariant?: "ghost";
  buttonText?: string;
  metadataInputs: MetadataItemInput[];
};

type PasswordGrantFormData = {
  username: string;
  password: string;
  clientId: string;
  clientSecret: string;
  scopes: string;
  [key: string]: string; // Allow dynamic metadata fields
};

/**
 * Form for providers that sign in with the OAuth 2.0 password grant: the user's
 * username and password, the provider's metadata (for example the instance URL),
 * and, only if the provider needs them, client credentials.
 */
export function PasswordGrantForm({
  handleSubmit,
  isButtonDisabled,
  explicitScopesRequired,
  buttonVariant,
  buttonText = "Next",
  metadataInputs,
}: PasswordGrantFormProps) {
  const [formData, setFormData] = useState<PasswordGrantFormData>({
    username: "",
    password: "",
    clientId: "",
    clientSecret: "",
    scopes: "",
  });

  const handleChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.currentTarget;
    // Passwords may legitimately start or end with spaces.
    const nextValue = name === "password" ? value : value.trim();
    setFormData((prevData) => ({ ...prevData, [name]: nextValue }));
  };

  const { username, password, clientId, clientSecret, scopes } = formData;

  const isSubmitDisabled =
    isButtonDisabled ||
    username.length === 0 ||
    password.length === 0 ||
    !isProviderMetadataValid(metadataInputs, formData);

  const onHandleSubmit = () => {
    const req: PasswordGrantCreds = {
      username,
      password,
      clientId,
      clientSecret,
      providerMetadata: getProviderMetadata(metadataInputs, formData),
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
          id="username"
          name="username"
          type="text"
          placeholder="Username"
          onChange={handleChange}
        />
        <FormComponent.PasswordInput
          id="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
        {metadataInputs.map((metadata) => (
          <MetadataInput
            key={metadata.name}
            metadata={metadata}
            onChange={handleChange}
          />
        ))}
        {explicitScopesRequired && (
          <FormComponent.Textarea
            name="scopes"
            placeholder="Scopes separated by new line"
            onChange={handleChange}
          />
        )}
        <FormComponent.Input
          id="clientId"
          name="clientId"
          type="text"
          placeholder="Client ID (optional)"
          onChange={handleChange}
        />
        <FormComponent.PasswordInput
          id="clientSecret"
          name="clientSecret"
          placeholder="Client Secret (optional)"
          onChange={handleChange}
        />
      </div>
      <br />
      <Button
        style={{ width: "100%" }}
        disabled={isSubmitDisabled}
        type="button"
        onClick={onHandleSubmit}
        variant={buttonVariant}
      >
        {buttonText}
      </Button>
    </>
  );
}

type PasswordGrantContentProps = {
  handleSubmit: (creds: PasswordGrantCreds) => void;
  error: string | null;
  explicitScopesRequired?: boolean;
  isButtonDisabled?: boolean;
  providerName?: string;
  metadataInputs: MetadataItemInput[];
};

export function PasswordGrantContent({
  handleSubmit,
  error,
  isButtonDisabled,
  providerName,
  explicitScopesRequired,
  metadataInputs,
}: PasswordGrantContentProps) {
  return (
    <AuthCardLayout>
      <AuthTitle>{`Set up ${providerName} integration`}</AuthTitle>
      <AuthErrorAlert error={error} />
      <br />
      <PasswordGrantForm
        handleSubmit={handleSubmit}
        isButtonDisabled={isButtonDisabled}
        explicitScopesRequired={explicitScopesRequired}
        metadataInputs={metadataInputs}
      />
    </AuthCardLayout>
  );
}
