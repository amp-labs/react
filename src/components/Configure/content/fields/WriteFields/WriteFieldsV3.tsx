import {
  CheckboxField, CheckboxFieldsContainer,
  CheckboxGroup,
} from 'components/ui-base/Checkbox';
import { useInstallIntegrationProps } from 'context/InstallIntegrationContextProvider';
import { getProviderName } from 'src/utils';

import { useSelectedConfigureState } from '../../useSelectedConfigureState';
import { FieldHeader } from '../FieldHeader';

export function WriteFieldsV3() {
  const {
    appName, selectedObjectName, configureState,
  } = useSelectedConfigureState();

  const { provider } = useInstallIntegrationProps();
  const providerName = getProviderName(provider);

  const onCheckboxChange = (checked: boolean) => {
    if (selectedObjectName && configureState) {
      if (checked) {
        console.log('support write for', selectedObjectName);
      } else {
        console.log('remove write support for', selectedObjectName);
      }
    }
  };

  const label = `${appName} creates and updates ${selectedObjectName} in ${providerName}`;

  return (
    <>
      <FieldHeader string={label} />
      <CheckboxGroup>
        <CheckboxFieldsContainer>
          <CheckboxField
            key={`${selectedObjectName}-write`}
            id={`${selectedObjectName}-write`}
            onCheckedChange={(checked) => onCheckboxChange(checked)}
        //   isChecked={!!selectedWriteFields?.[field.objectName]}
            label={`Allow create and update ${selectedObjectName}`}
          />
        </CheckboxFieldsContainer>
      </CheckboxGroup>
    </>
  );
}
