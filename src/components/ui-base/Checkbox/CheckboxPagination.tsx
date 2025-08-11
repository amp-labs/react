import { useState } from "react";

import { Input } from "components/form/Input";
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
  showSearch?: boolean;
  searchPlaceholder?: string;
}

export function CheckboxPagination({
  items,
  onItemChange,
  onSelectAllChange,
  isAllChecked = false,
  isIndeterminate = false,
  itemsPerPage = 8,
  showSelectAll = true,
  showSearch = true,
  searchPlaceholder = "Search fields...",
}: CheckboxPaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter items based on search term
  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Calculate pagination for filtered items
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageItems = filteredItems.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <CheckboxGroup>
      {showSearch && (
        <div className={styles.searchContainer}>
          <Input
            id="field-search"
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleSearchChange(e.target.value)
            }
            className={styles.searchInput}
          />
        </div>
      )}

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

      {showSelectAll && filteredItems.length >= 2 && (
        <SelectAllCheckbox
          id="select-all-fields"
          isChecked={isAllChecked}
          label={`Select all ${filteredItems.length} fields`}
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

      {filteredItems.length === 0 && searchTerm && (
        <div className={styles.noResults}>
          No fields found matching &quot;{searchTerm}&quot;
        </div>
      )}
    </CheckboxGroup>
  );
}
