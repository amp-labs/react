import { capitalize } from '../../utils';

// reconfigure content
export const content = {
  reconfigureIntro: (
    appName: string,
    apiProvider: string,
    workspace: string,
  ) => (
    // eslint-disable-next-line max-len
    <>{capitalize(apiProvider)} integration: <b>{workspace}</b>.</>
  ),
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
