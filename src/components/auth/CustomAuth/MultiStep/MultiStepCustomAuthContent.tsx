import { useState } from "react";
import {
  CustomAuthInput,
  CustomAuthInputFieldTypeEnum,
  MetadataItemInput,
  ProviderInfo,
} from "@generated/api/src";
import { AuthErrorAlert } from "src/components/auth/AuthErrorAlert/AuthErrorAlert";
import { FormComponent } from "src/components/form";
import { Select } from "src/components/form/Select";
import { Button } from "src/components/ui-base/Button";
import {
  AuthCardLayout,
  AuthTitle,
} from "src/layout/AuthCardLayout/AuthCardLayout";

import { MetadataInput } from "components/auth/MetadataInput";
import { DocsHelperTextHeader } from "components/Docs/DocsHelperTextMinimal";

import {
  getProviderMetadata,
  isProviderMetadataValid,
} from "../../providerMetadata";
import { CustomAuthFormData } from "../LandingContentProps";

type CustomInputChangeHandler = (
  event: React.FormEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >,
) => void;

// Renders a single custom-auth input by its fieldType. Defaults to a masked
// password field when fieldType is absent.
function CustomInputField({
  input,
  value,
  onChange,
}: {
  input: CustomAuthInput;
  value: string;
  onChange: CustomInputChangeHandler;
}) {
  switch (input.fieldType) {
    case CustomAuthInputFieldTypeEnum.FieldTypeSelect:
      return (
        <Select
          id={input.name}
          name={input.name}
          value={value}
          onChange={onChange}
        >
          <option value="" disabled>
            Select an option
          </option>
          {(input.options || []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      );
    case CustomAuthInputFieldTypeEnum.FieldTypeText:
      return (
        <FormComponent.Input
          id={input.name}
          name={input.name}
          type="text"
          onChange={onChange}
          placeholder=""
        />
      );
    default:
      return (
        <FormComponent.PasswordInput
          id={input.name}
          name={input.name}
          onChange={onChange}
          placeholder=""
        />
      );
  }
}

type MultiStepCustomAuthFormProps = {
  providerInfo: ProviderInfo;
  handleSubmit: (form: CustomAuthFormData) => void;
  isButtonDisabled?: boolean;
  metadataInputs: MetadataItemInput[];
};

function MultiStepCustomAuthForm({
  providerInfo,
  handleSubmit,
  isButtonDisabled,
  metadataInputs,
}: MultiStepCustomAuthFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange: CustomInputChangeHandler = (event) => {
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
        <div
          key={input.name}
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          <DocsHelperTextHeader
            url={input.docsURL}
            prompt={input.prompt}
            inputName={input.displayName}
          />
          <CustomInputField
            input={input}
            value={formData[input.name] || ""}
            onChange={handleChange}
          />
        </div>
      ))}
      {metadataInputs.map((metadata: MetadataItemInput) => (
        <MetadataInput
          key={metadata.name}
          metadata={metadata}
          onChange={handleChange}
        />
      ))}
      <Button
        style={{ marginTop: "1em", width: "100%" }}
        disabled={isSubmitDisabled}
        type="submit"
        onClick={onHandleSubmit}
      >
        Next
      </Button>
    </div>
  );
}

type MultiStepCustomAuthContentProps = {
  providerInfo: ProviderInfo;
  handleSubmit: (form: CustomAuthFormData) => void;
  error: string | null;
  isButtonDisabled?: boolean;
  metadataInputs: MetadataItemInput[];
};

export function MultiStepCustomAuthContent({
  providerInfo,
  handleSubmit,
  error,
  isButtonDisabled,
  metadataInputs,
}: MultiStepCustomAuthContentProps) {
  return (
    <AuthCardLayout>
      <AuthTitle>{`Set up ${providerInfo.displayName} integration`}</AuthTitle>
      <AuthErrorAlert error={error} />
      <MultiStepCustomAuthForm
        providerInfo={providerInfo}
        handleSubmit={handleSubmit}
        isButtonDisabled={isButtonDisabled || !!error}
        metadataInputs={metadataInputs}
      />
    </AuthCardLayout>
  );
}
