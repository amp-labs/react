import { expect, test } from '@jest/globals';
import { IntegrationConfig, IntegrationSource } from '../../src/components/types/configTypes';
import { TestSourceList } from '../../src/testData/integrationSource';
import {
  findSourceFromList,
  findObjectInIntegrationConfig,
  getDefaultConfigForSource,
} from '../../src/utils/index';

const testReadAccountsAndContactsFromSalesforce = TestSourceList[0] as IntegrationSource;
const [
  targetAccountsObject,
  targetContactObject,
] = testReadAccountsAndContactsFromSalesforce.objects;
const targetIntegrationConfig = [
  {
    objectName: 'account',
    selectedOptionalFields: {
      website: true,
      annualRevenue: true,
    },
    selectedFieldMapping: {},
    requiredFields: {
      name: true,
      industry: true,
    },
  },
  {
    objectName: 'contact',
    selectedOptionalFields: {},
    selectedFieldMapping: {},
    requiredFields: {
      firstName: true,
      lastName: true,
      email: true,
    },
  },
] as IntegrationConfig;
const [targetAccountConfig, targetContactConfig] = targetIntegrationConfig;

test('getDefaultConfigForSource creates correct default config from source', () => {
  expect(
    getDefaultConfigForSource(testReadAccountsAndContactsFromSalesforce.objects),
  ).toMatchObject(
    targetIntegrationConfig,
  );
});

test('findObjectInIntegrationConfig finds right object in config', () => {
  expect(
    findObjectInIntegrationConfig(targetContactObject, targetIntegrationConfig),
  ).toMatchObject(targetContactConfig);

  expect(
    findObjectInIntegrationConfig(targetAccountsObject, targetIntegrationConfig),
  ).toMatchObject(targetAccountConfig);
});

test('findSourceFromList finds source in list', () => {
  expect(
    findSourceFromList('read-accounts-and-contacts-from-salesforce', TestSourceList),
  ).toMatchObject(testReadAccountsAndContactsFromSalesforce);
});
