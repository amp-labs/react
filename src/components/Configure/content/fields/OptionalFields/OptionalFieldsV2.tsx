import {
  CheckboxField, CheckboxFieldsContainer, CheckboxGroup, SelectAllCheckbox,
} from 'components/ui-base/Checkbox';

import { isIntegrationFieldMapping } from '../../../utils';
import { useSelectedConfigureState } from '../../useSelectedConfigureState';
import { FieldHeader } from '../FieldHeader';

import { setOptionalField } from './setOptionalField';

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
        <CheckboxGroup>
          {(readOptionalFields?.length || 0) >= 2 && (
            <SelectAllCheckbox
              id="select-all-fields"
              isChecked={isAllChecked}
              label="Select all"
              onCheckedChange={onSelectAllCheckboxChange}
              isIndeterminate={isIndeterminate}
            />
          )}
          <CheckboxFieldsContainer>
            {readOptionalFields.map((field) => {
              if (!isIntegrationFieldMapping(field)) {
                return (
                  <CheckboxField
                    key={field.fieldName}
                    id={field.fieldName}
                    isChecked={!!selectedOptionalFields?.[field?.fieldName]}
                    label={field.displayName}
                    onCheckedChange={(checked) => onCheckboxChange(checked, field.fieldName)}
                  />
                );
              }
              return null;
            })}
          </CheckboxFieldsContainer>
        </CheckboxGroup>
      </>
    )
  );
}
