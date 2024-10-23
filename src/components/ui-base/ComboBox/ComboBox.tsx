import { useEffect, useState } from 'react';
import { useCombobox } from 'downshift';

import styles from './combobox.module.css'; // CSS Modules

// Define the type for the option items
interface Option {
  id: string;
  label: string;
  value: string;
}

// Define the props for the ComboBox component
interface ComboBoxProps {
  items: Option[];
  selectedValue: string | null;
  onSelectedItemChange: (item: Option | null) => void;
  placeholder: string;
}

function getOptionsFilter(inputValue: string) {
  const lowerCasedInputValue = inputValue.toLowerCase();

  return function optionsFilter(option: Option) {
    return (
      !inputValue
      || option.label.toLowerCase().includes(lowerCasedInputValue)
      || option.value.toLowerCase().includes(lowerCasedInputValue)
    );
  };
}

export function ComboBox({
  items,
  selectedValue,
  onSelectedItemChange,
  // label,
  placeholder,
}: ComboBoxProps) {
  const [filteredItems, setFilteredItems] = useState<Option[]>(items);

  // Update the filtered items when the items prop changes
  useEffect(() => setFilteredItems(items), [items]);

  const onInputValueChange = (_inputValue: string) => {
    setFilteredItems(items.filter(getOptionsFilter(_inputValue)));
  };

  const {
    isOpen,
    getToggleButtonProps,
    // getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox<Option>({
    items: filteredItems,
    selectedItem: selectedValue ? items.find((item) => item.value === selectedValue) : null,
    itemToString: (item) => item?.label || '',
    onInputValueChange: ({ inputValue: _inputValue }) => onInputValueChange(_inputValue),
    onSelectedItemChange: ({ selectedItem: newSelectedItem }) => onSelectedItemChange(newSelectedItem),
  });

  return (
    <div>
      <div className={styles.comboboxContainer}>
        {/* input  */}
        <div className={styles.inputContainer}>
          <input
            placeholder={placeholder}
            className={styles.input}
            {...getInputProps()}
          />
          <button
            aria-label="toggle menu"
            className={styles.toggleButton}
            type="button"
            {...getToggleButtonProps()}
          >
            {isOpen ? <>&#8593;</> : <>&#8595;</>}
          </button>
        </div>
      </div>
      {/* menu */}
      <ul
        className={`${styles.menu} ${isOpen && items.length ? '' : styles.hidden}`}
        {...getMenuProps()}
      >
        {isOpen
          && filteredItems.map((item, index) => (
            <li
              className={`${styles.menuItem} ${
                highlightedIndex === index ? styles.highlighted : ''
              } ${selectedValue === item?.value ? styles.selected : ''}`}
              key={item.id}
              {...getItemProps({ item, index })}
            >
              <span>{item.label}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}
