import { MetadataItemInput } from "@generated/api/src";

import { DocsHelperTextHeader } from "components/Docs/DocsHelperTextMinimal";
import { FormComponent } from "components/form";

import styles from "./MetadataInput.module.css";

type MetadataInputProps = {
  metadata: MetadataItemInput;
  onChange: (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  defaultValue?: string;
};

export function MetadataInput({
  metadata,
  onChange,
  defaultValue,
}: MetadataInputProps) {
  return (
    <div className={styles.metadataInputWrapper}>
      <DocsHelperTextHeader
        url={metadata.docsURL}
        prompt={metadata.prompt}
        inputName={metadata.displayName || metadata.name}
      />
      <FormComponent.Input
        id={metadata.name}
        name={metadata.name}
        type="text"
        placeholder={metadata.defaultValue}
        defaultValue={defaultValue}
        onChange={onChange}
      />
    </div>
  );
}
