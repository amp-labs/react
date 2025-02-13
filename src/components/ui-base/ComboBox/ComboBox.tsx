import {
  useCallback,
  useEffect, useMemo, useRef, useState,
} from 'react';
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
  disabled?: boolean;
  style?: React.CSSProperties;
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
  onSelectedItemChange: _onSelectedItemChange,
  // label,
  placeholder,
  disabled,
  style,
}: ComboBoxProps) {
  const [filteredItems, setFilteredItems] = useState<Option[]>(items);
  const inputRef = useRef<HTMLInputElement | null>(null); // Ref to the input element

  // Update the filtered items when the items prop changes
  useEffect(() => setFilteredItems(items), [items]);

  // updates menu items when user types in the input
  const onInputValueChange = useCallback((_inputValue: string) => {
    if (_inputValue?.length > 0) {
      setFilteredItems(items.filter(getOptionsFilter(_inputValue)));
    } else {
      // reset the filtered items to the full list when the input is empty
      setFilteredItems(items);
    }
  }, [items]);

  const {
    isOpen,
    getToggleButtonProps,
    // getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    setInputValue,
    selectedItem,
  } = useCombobox<Option>({
    items: filteredItems,
    selectedItem: selectedValue ? items.find((item) => item.value === selectedValue) : null,
    itemToString: (item) => item?.label || '',
    onInputValueChange: ({ inputValue: _inputValue }) => onInputValueChange(_inputValue),
    onSelectedItemChange: ({ selectedItem: newSelectedItem }) => {
      _onSelectedItemChange(newSelectedItem); // Call the parent's onSelectedItemChange
      inputRef.current?.blur(); // unselects the input when an option is selected so that handleBlur is called
      // handle blur updates InputValue
    },
  });

  const resetInput = () => {
    setInputValue('');
    setFilteredItems(items);
  };

  // Reset the input to show the full list when opened
  const handleFocus = () => resetInput();

  const selectedValueLabel = useMemo(
    () => items.find((item) => item.value === selectedValue)?.label,
    [items, selectedValue],
  );

  // reset the input value when the input is blurred
  const handleBlur = () => {
    if (selectedValue && selectedValueLabel && selectedValue !== selectedItem?.value) {
      setInputValue(selectedValueLabel || '');
    }
  };

  return (
    <div style={{ position: 'relative', ...style }}>
      <div className={styles.comboboxContainer}>
        {/* input  */}
        <div className={styles.inputContainer}>
          <input
            style={{ border: 'none' }}
            disabled={disabled}
            placeholder={placeholder}
            className={styles.input}
            {...getInputProps({ onFocus: handleFocus, onBlur: handleBlur, ref: inputRef })}
          />
          <button
            style={{ border: 'none' }}
            disabled={disabled}
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
