import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon, DividerHorizontalIcon } from '@radix-ui/react-icons';

import { isIntegrationFieldMapping } from '../../../utils';
import { useSelectedConfigureState } from '../../useSelectedConfigureState';
import { FieldHeader } from '../FieldHeader';

import { setOptionalField } from './setOptionalField';

import styles from './optionalFields.module.css'; // CSS module for styling

const selectAllID = 'selectAll';

export function OptionalFieldsV2() {
  const {
    appName, configureState, setConfigureState, selectedObjectName,
  } = useSelectedConfigureState();
  const selectedOptionalFields = configureState?.read?.selectedOptionalFields;

  const onCheckboxChange = (checked: boolean | 'indeterminate', name: string) => {
    if (checked === 'indeterminate') {
      return;
    }

    if (selectedObjectName && configureState) {
      setOptionalField(selectedObjectName, setConfigureState, name, checked);
    }
  };

  const readOptionalFields = configureState?.read?.optionalFields;

  const onSelectAllCheckboxChange = (checked: boolean) => {
    if (selectedObjectName && readOptionalFields) {
      readOptionalFields.forEach((field) => {
        if (!isIntegrationFieldMapping(field)) {
          setOptionalField(selectedObjectName, setConfigureState, field.fieldName, checked);
        }
      });
    }
  };

  const shouldRender = !!(readOptionalFields && readOptionalFields.length > 0);
  const isAllChecked = Object.keys(selectedOptionalFields || {}).length === readOptionalFields?.length;
  const isIndeterminate = !isAllChecked && Object.keys(selectedOptionalFields || {}).length > 0;

  return (
    shouldRender && (
      <>
        <FieldHeader string={`${appName} reads the following optional fields`} />
        <div className={styles.checkboxGroupContainer}>
          {(readOptionalFields?.length || 0) >= 2 && (
          <div className={styles.selectAllContainer}>
            <Checkbox.Root
              className={styles.checkbox}
              id={selectAllID}
              onCheckedChange={onSelectAllCheckboxChange}
            >
              <Checkbox.Indicator id={selectAllID}>
                {isIndeterminate && <DividerHorizontalIcon />}
                {isAllChecked === true && <CheckIcon />}
              </Checkbox.Indicator>
            </Checkbox.Root>
            {/* fix eslint issue with custom checkbox label */}
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor={selectAllID}>Select all</label>
          </div>
          )}
          <div className={styles.stack}>
            {readOptionalFields.map((field) => {
              if (!isIntegrationFieldMapping(field)) {
                return (
                  <div key={field.fieldName} className={styles.fieldContainer}>
                    <Checkbox.Root
                      className={styles.checkbox}
                      id={field.fieldName}
                      checked={!!selectedOptionalFields?.[field?.fieldName]}
                      onCheckedChange={(checked) => onCheckboxChange(checked, field.fieldName)}
                    >
                      <Checkbox.Indicator>
                        <CheckIcon />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    <label htmlFor={field.fieldName}>{field.displayName}</label>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </>
    )
  );
}
