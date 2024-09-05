import { Box, Stack } from '@chakra-ui/react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon, DividerHorizontalIcon } from '@radix-ui/react-icons';

import { isIntegrationFieldMapping } from '../../../../utils';
import { useSelectedConfigureState } from '../../../useSelectedConfigureState';
import { FieldHeader } from '../../FieldHeader';
import { setOptionalField } from '../setOptionalField';

import classes from './style.module.css';

export function OptionalFields() {
  const {
    appName, configureState, setConfigureState, selectedObjectName,
  } = useSelectedConfigureState();
  const selectedOptionalFields = configureState?.read?.selectedOptionalFields;

  const onCheckboxChange = (e: React.FormEvent<HTMLButtonElement>) => {
    console.log('onCheckboxChange', e);
    // const { name, value: checked } = e;

    // if (selectedObjectName && configureState) {
    //   setOptionalField(selectedObjectName, setConfigureState, name, checked);
    // }
  };

  const readOptionalFields = configureState?.read?.optionalFields;

  const onSelectAllCheckboxChange = (event: React.FormEvent<HTMLButtonElement>) => {
    console.log('onSelectAllCheckboxChange', event);
    // const { checked } = e.target;

    // if (selectedObjectName && readOptionalFields) {
    //   readOptionalFields.forEach((field) => {
    //     if (!isIntegrationFieldMapping(field)) {
    //       setOptionalField(selectedObjectName, setConfigureState, field.fieldName, checked);
    //     }
    //   });
    // }
  };

  const shouldRender = !!(readOptionalFields && readOptionalFields.length > 0);
  const isAllChecked = Object.keys(selectedOptionalFields || {}).length === readOptionalFields?.length;
  const isIndeterminate = !isAllChecked && Object.keys(selectedOptionalFields || {}).length > 0;

  return (
    shouldRender && (
      <>
        <FieldHeader string={`${appName} reads the following optional fields`} />
        <Stack
          marginBottom={10}
          maxHeight={300}
          overflowY="scroll"
          border="2px solid #EFEFEF"
          borderRadius={8}
          gap={0}
        >
          {/* {(readOptionalFields?.length || 0) >= 2 && (
            <Box backgroundColor="gray.50" paddingX={4} paddingY={2}>
              <Checkbox.Root className={classes.Root} onChange={onSelectAllCheckboxChange}>
                <Checkbox.Indicator>
                  {isIndeterminate && <DividerHorizontalIcon />}
                  {isAllChecked && <CheckIcon />}
                </Checkbox.Indicator>
              </Checkbox.Root>
              {/* <Checkbox

                name="selectAll"
                id="selectAll"
                onChange={onSelectAllCheckboxChange}
                isIndeterminate={isIndeterminate}
                isChecked={isAllChecked}
              >
                Select all
              </Checkbox>
            </Box>
          )} */}
          {readOptionalFields.map((field) => {
            if (!isIntegrationFieldMapping(field)) {
              return (
                <Box key={field.fieldName} paddingX={4} paddingY={2} borderBottom="1px" borderColor="gray.100">
                  <Checkbox.Root
                  //   all: unset;
    // background-color: white;
    // width: 25px;
    // height: 25px;
    // border-radius: 4px;
    // display: flex;
    // align-items: center;
    // justify-content: center;
    // box-shadow: 0 2px 10px var(black);
                    style={{
                      display: 'flex',
                      height: '20px',
                      width: '20px',
                      borderRadius: '4px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 10px black)',
                    }}
                    defaultChecked
                    name={field.fieldName}
                    className={classes.root}
                    onChange={onCheckboxChange}
                    // onCheckedChange={onCheckboxChange}
                    checked={!!selectedOptionalFields?.[field?.fieldName]}
                    id={field.fieldName}
                  >
                    <Checkbox.Indicator className={classes.indicator}>
                      <CheckIcon />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <label className={classes.label} htmlFor={field.fieldName}>
                    {field.displayName}
                  </label>
                  {/* <Checkbox
                    name={field.fieldName}
                    id={field.fieldName}
                    isChecked={!!selectedOptionalFields?.[field?.fieldName]}
                    onChange={onCheckboxChange}
                  >
                    {field.displayName}
                  </Checkbox> */}
                </Box>
              );
            }
            return null; // fallback for customed mapped fields
          })}
        </Stack>
      </>
    )
  );
}
