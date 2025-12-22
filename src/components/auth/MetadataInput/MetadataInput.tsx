import { MetadataItemInput } from "@generated/api/src";
import { capitalize } from "src/utils";

import { DocsHelperText } from "components/Docs/DocsHelperText";
import { DocsHelperTextHeader } from "components/Docs/DocsHelperTextMinimal";
import { FormComponent } from "components/form";

import styles from "./MetadataInput.module.css";

type MetadataInputProps = {
  metadata: MetadataItemInput;
  onChange: (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  providerName?: string;
  variant?: "standard" | "header";
};

export function MetadataInput({
  metadata,
  onChange,
  providerName,
  variant = "standard",
}: MetadataInputProps) {
  return (
    <div className={styles.metadataInputWrapper}>
      {metadata.docsURL && variant === "standard" && (
        <DocsHelperText
          url={metadata.docsURL}
          providerDisplayName={providerName || ""}
          credentialName={
            metadata.displayName || capitalize(metadata.name.toLowerCase())
          }
          prompt={metadata.prompt}
        />
      )}
      {variant === "header" && (
        <DocsHelperTextHeader
          url={metadata.docsURL}
          prompt={metadata.prompt}
          inputName={metadata.displayName || metadata.name}
        />
      )}
      <FormComponent.Input
        id={metadata.name}
        name={metadata.name}
        type="text"
        placeholder={metadata.displayName || metadata.name}
        onChange={onChange}
      />
    </div>
  );
}
