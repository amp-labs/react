import { useState } from "react";
import { MetadataItemInput, ProviderInfo, ProviderMetadataInfo } from "@generated/api/src";
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

import { BasicCreds, LandingContentProps } from "./LandingContentProps";

type BasicAuthFormProps = {
  provider: string;
  providerInfo: ProviderInfo;
  handleSubmit: (form: BasicCreds) => void;
  isButtonDisabled?: boolean;
  buttonVariant?: "ghost";
  requiredProviderMetadata?: MetadataItemInput[];
};

type FormData = {
  username: string;
  password: string;
  [key: string]: string;
};

export function BasicAuthForm({
  provider,
  providerInfo,
  handleSubmit,
  isButtonDisabled,
  buttonVariant,
  requiredProviderMetadata = [],
}: BasicAuthFormProps) {
  const [show, setShow] = useState(false);
  const onToggleShowHide = () => setShow((prevShow) => !prevShow);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const { username, password } = formData;
  const { providerName } = useProvider(provider);
  const { getProviderMetadata, error } = useProviderMetadata(
    formData,
    requiredProviderMetadata,
  );

  const handleChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.currentTarget;
    setFormData((prevData) => ({ ...prevData, [name]: value.trim() }));
  };

  // This is a workaround for the fact that some providers use Basic Auth
  // to actually represent API key based auth.
  // TODO(ENG-1424): Uncomment the following line when we handle this properly.
  // const isPassValid = password.length > 0;
  // const isSubmitDisabled = isButtonDisabled || !isUserValid || !isPassValid;
  const isUserValid = username.length > 0;
  const isPassValid = password.length > 0;

  // Check if metadata is valid by trying to get it
  const metadataResult = getProviderMetadata();
  const isMetadataValid = requiredProviderMetadata.length === 0 || !!metadataResult;

  const isSubmitDisabled =
    isButtonDisabled ||
    !isUserValid ||
    !isPassValid ||
    !isMetadataValid;

  const onHandleSubmit = () => {
    handleSubmit({
      user: username,
      pass: password,
      providerMetadata: metadataResult?.providerMetadata,
    });
  };

  const docsURL = providerInfo.basicOpts?.docsURL;

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
          credentialName="credentials"
        />
      )}
      <FormComponent.Input
        id="username"
        name="username"
        type="text"
        placeholder="Username"
        onChange={handleChange}
      />
      <div style={{ display: "flex", gap: ".5rem" }}>
        <FormComponent.Input
          id="password"
          name="password"
          type={show ? "text" : "password"}
          placeholder="Password"
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
        type="button"
        onClick={onHandleSubmit}
        variant={buttonVariant}
      >
        Next
      </Button>
    </div>
  );
}

function BasicAuthContentForm({
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
      <BasicAuthForm
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
export function BasicAuthContent({ ...props }: LandingContentProps) {
  return <BasicAuthContentForm {...props} />;
}
