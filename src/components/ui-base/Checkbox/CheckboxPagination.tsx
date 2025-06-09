import { useState } from "react";

import { Button } from "components/ui-base/Button";

import {
  CheckboxField,
  CheckboxFieldsContainer,
  CheckboxGroup,
  SelectAllCheckbox,
} from "./index";

import styles from "./checkboxPagination.module.css";

export interface CheckboxItem {
  id: string;
  label: string;
  isChecked: boolean;
}

interface CheckboxPaginationProps {
  items: CheckboxItem[];
  onItemChange: (id: string, checked: boolean) => void;
  onSelectAllChange: (checked: boolean) => void;
  isAllChecked?: boolean;
  isIndeterminate?: boolean;
  itemsPerPage?: number;
  showSelectAll?: boolean;
}

export function CheckboxPagination({
  items,
  onItemChange,
  onSelectAllChange,
  isAllChecked = false,
  isIndeterminate = false,
  itemsPerPage = 8,
  showSelectAll = true,
}: CheckboxPaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageItems = items.slice(startIndex, endIndex);

  return (
    <CheckboxGroup>
      {totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <Button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            variant="ghost"
          >
            &lt;
          </Button>
          <span className={styles.pageInfo}>
            {currentPage} of {totalPages}
          </span>
          <Button
            type="button"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            variant="ghost"
          >
            &gt;
          </Button>
        </div>
      )}
      {showSelectAll && items.length >= 2 && (
        <SelectAllCheckbox
          id="select-all-fields"
          isChecked={isAllChecked}
          label={`Select all ${items.length} fields`}
          onCheckedChange={onSelectAllChange}
          isIndeterminate={isIndeterminate}
        />
      )}

      <CheckboxFieldsContainer>
        {currentPageItems.map((item) => (
          <CheckboxField
            key={item.id}
            id={item.id}
            isChecked={item.isChecked}
            label={item.label}
            onCheckedChange={(checked) =>
              onItemChange(item.id, checked === true)
            }
          />
        ))}
      </CheckboxFieldsContainer>
    </CheckboxGroup>
  );
}
