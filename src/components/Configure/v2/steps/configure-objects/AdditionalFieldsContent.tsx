import type { CheckboxItem } from "components/ui-base/Checkbox/CheckboxPagination";
import { CheckboxPagination } from "components/ui-base/Checkbox/CheckboxPagination";

import sharedStyles from "./configureObjectsStep.module.css";

interface AdditionalFieldsContentProps {
  providerDisplayName: string;
  appName: string;
  optionalFieldItems: CheckboxItem[];
  onItemChange: (fieldName: string, selected: boolean) => void;
}

export function AdditionalFieldsContent({
  providerDisplayName,
  appName,
  optionalFieldItems,
  onItemChange,
}: AdditionalFieldsContentProps) {
  return (
    <>
      <h3 className={sharedStyles.sectionTitle}>Additional Fields</h3>
      <p className={sharedStyles.helperText}>
        Would you like to share any optional {providerDisplayName} fields
        with {appName}?
      </p>
      <CheckboxPagination
        items={optionalFieldItems}
        onItemChange={onItemChange}
      />
    </>
  );
}
