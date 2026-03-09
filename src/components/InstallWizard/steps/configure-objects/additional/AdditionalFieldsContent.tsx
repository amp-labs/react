import type { CheckboxItem } from "components/ui-base/Checkbox/CheckboxPagination";
import { CheckboxPagination } from "components/ui-base/Checkbox/CheckboxPagination";

import { SectionHeader } from "../../../components/SectionHeader";

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
      <SectionHeader
        title="Additional Fields"
        description={`Would you like to share any optional ${providerDisplayName} fields with ${appName}?`}
      />
      <CheckboxPagination
        items={optionalFieldItems}
        onItemChange={onItemChange}
      />
    </>
  );
}
