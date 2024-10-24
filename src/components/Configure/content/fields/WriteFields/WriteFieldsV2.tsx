import {
  CheckboxField, CheckboxFieldsContainer,
  CheckboxGroup, SelectAllCheckbox,
} from 'components/ui-base/Checkbox';

import { useSelectedConfigureState } from '../../useSelectedConfigureState';
import { FieldHeader } from '../FieldHeader';

import { setNonConfigurableWriteField } from './setNonConfigurableWriteField';

export function WriteFieldsV2() {
  const {
    appName, selectedObjectName, configureState, setConfigureState,
  } = useSelectedConfigureState();
  const selectedWriteFields = configureState?.write?.selectedNonConfigurableWriteFields;
  const writeObjects = configureState?.write?.writeObjects;

  const onCheckboxChange = (checked: boolean | 'indeterminate', name: string) => {
    if (checked === 'indeterminate') {
      return;
    }

    if (selectedObjectName && configureState) {
      setNonConfigurableWriteField(selectedObjectName, setConfigureState, name, checked);
    }
  };

  const onSelectAllCheckboxChange = (checked: boolean) => {
    if (selectedObjectName && configureState) {
      configureState?.write?.writeObjects?.forEach((field) => {
        setNonConfigurableWriteField(selectedObjectName, setConfigureState, field.objectName, checked);
      });
    }
  };

  const shouldRender = !!(writeObjects);
  const isAllChecked = Object.keys(selectedWriteFields || {}).length === configureState?.write?.writeObjects?.length;
  const isIndeterminate = !isAllChecked && Object.keys(selectedWriteFields || {}).length > 0;

  return (
    shouldRender && (
      <>
        <FieldHeader string={`Allow ${appName} to write to these objects`} />
        <CheckboxGroup>

          {(writeObjects?.length || 0) >= 2 && (
            <SelectAllCheckbox
              id="select-all-fields"
              onCheckedChange={onSelectAllCheckboxChange}
              isIndeterminate={isIndeterminate}
              isChecked={isAllChecked}
              label="Select all"
            />
          )}
          <CheckboxFieldsContainer>
            {writeObjects.map((field) => (
              <CheckboxField
                key={field.objectName}
                id={field.objectName}
                onCheckedChange={(checked) => onCheckboxChange(checked, field.objectName)}
                isChecked={!!selectedWriteFields?.[field.objectName]}
                label={field.displayName}
              />
            ))}
          </CheckboxFieldsContainer>
        </CheckboxGroup>
      </>
    )
  );
}
