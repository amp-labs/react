import { useState } from "react";
import { AuthErrorAlert } from "src/components/auth/AuthErrorAlert/AuthErrorAlert";
import { FormComponent } from "src/components/form";
import { Button } from "src/components/ui-base/Button";
import {
  AuthCardLayout,
  AuthTitle,
} from "src/layout/AuthCardLayout/AuthCardLayout";
import { convertTextareaToArray } from "src/utils";

import { ClientCredentialsCredsContent } from "./ClientCredentialsCredsContent";

type ClientCredentialsFormProps = {
  handleSubmit: (creds: ClientCredentialsCredsContent) => void;
  isButtonDisabled?: boolean;
  explicitScopesRequired?: boolean;
  explicitWorkspaceRequired?: boolean;
  buttonVariant?: "ghost";
};

export function ClientCredentialsForm({
  handleSubmit,
  isButtonDisabled,
  explicitScopesRequired,
  explicitWorkspaceRequired,
  buttonVariant,
}: ClientCredentialsFormProps) {
  const [show, setShow] = useState(false);

  const [formData, setFormData] = useState({
    clientSecret: "",
    clientId: "",
    workspace: "",
    scopes: "",
  });

  const onToggleShowHide = () => setShow((prevShow) => !prevShow);

  const handleChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.currentTarget;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const { clientSecret, clientId, workspace, scopes } = formData;

  const isClientSecretValid = clientSecret.length > 0;
  const isClientIdValid = clientId.length > 0;
  const isWorkspaceValid = explicitWorkspaceRequired
    ? workspace.length > 0
    : true;
  const isSubmitDisabled =
    isButtonDisabled ||
    !isClientSecretValid ||
    !isClientIdValid ||
    !isWorkspaceValid;

  const onHandleSubmit = () => {
    const req: ClientCredentialsCredsContent = {
      clientId,
      clientSecret,
    };

    if (explicitWorkspaceRequired) {
      req.workspace = workspace;
    }

    if (explicitScopesRequired && scopes.length > 0) {
      req.scopes = convertTextareaToArray(scopes);
    }

    handleSubmit(req);
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
        {explicitWorkspaceRequired && (
          <FormComponent.Input
            id="workspace"
            name="workspace"
            type="text"
            placeholder="MyWorkspace"
            onChange={(event) => handleChange(event)}
          />
        )}
        <FormComponent.Input
          id="clientId"
          name="clientId"
          type="text"
          placeholder="Client ID"
          onChange={(event) => handleChange(event)}
        />
        <div style={{ display: "flex", gap: ".5rem" }}>
          <FormComponent.Input
            id="clientSecret"
            name="clientSecret"
            type={show ? "text" : "password"}
            placeholder="Client Secret"
            onChange={(event) => handleChange(event)}
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
            onChange={(event) => handleChange(event)}
          />
        )}
      </div>
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
  explicitWorkspaceRequired?: boolean;
  isButtonDisabled?: boolean;
  providerName?: string;
};

export function ClientCredentialsContent({
  handleSubmit,
  error,
  isButtonDisabled,
  providerName,
  explicitScopesRequired,
  explicitWorkspaceRequired,
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
        explicitWorkspaceRequired={explicitWorkspaceRequired}
      />
    </AuthCardLayout>
  );
}
