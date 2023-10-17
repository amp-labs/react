// reconfigure content
export const content = {
  reconfigureRequiredFields: (
    appName: string,
    objectName: string,
  ) => <>{appName} reads the following <b>{objectName}</b> fields</>,
  customMappingText: (
    objectName: string,
    customField: string,
    // eslint-disable-next-line max-len
  ) => <>Which of your custom fields from <b>{objectName}</b> should be mapped to <b>{customField}</b>?</>,
};
