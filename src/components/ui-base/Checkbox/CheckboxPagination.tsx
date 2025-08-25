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
  itemsPerPage?: number;
  showSelectAll?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
}

export function CheckboxPagination({
  items,
  onItemChange,
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

  // Handle select all for filtered items only
  const handleSelectAllChange = (checked: boolean) => {
    // Only change the checked state of filtered items
    filteredItems.forEach((item) => {
      onItemChange(item.id, checked);
    });
  };

  // Calculate if all filtered items are checked
  const areAllFilteredItemsChecked =
    filteredItems.length > 0 && filteredItems.every((item) => item.isChecked);

  // Calculate if some filtered items are checked (for indeterminate state)
  const areSomeFilteredItemsChecked = filteredItems.some(
    (item) => item.isChecked,
  );

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

      {/* Select all checkbox */}
      {/* // Render the "Select all" checkbox, which allows users to select or deselect all currently filtered items.
      // This checkbox appears only if the `showSelectAll` prop is true and there are at least 2 items.
      // The checked and indeterminate states reflect the selection state of the filtered items. */}
      {showSelectAll && items.length >= 2 && (
        <SelectAllCheckbox
          id="select-all-fields"
          isChecked={areAllFilteredItemsChecked}
          label={`Select all ${filteredItems.length} ${searchTerm ? "matching " : ""}fields`}
          onCheckedChange={handleSelectAllChange}
          isIndeterminate={
            areSomeFilteredItemsChecked && !areAllFilteredItemsChecked
          }
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

      {filteredItems.length === 0 && searchTerm && (
        <div className={styles.noResults}>
          No fields found matching &quot;{searchTerm}&quot;
        </div>
      )}
    </CheckboxGroup>
  );
}
