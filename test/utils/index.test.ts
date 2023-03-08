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
  testAccountsObject,
  testContactObject,
] = testReadAccountsAndContactsFromSalesforce.objects;
const testIntegrationConfig = [
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
const [testAccountConfig, testContactConfig] = testIntegrationConfig;

test('getDefaultConfigForSource creates correct default config from source', () => {
  expect(
    getDefaultConfigForSource(testReadAccountsAndContactsFromSalesforce.objects),
  ).toMatchObject(
    testIntegrationConfig,
  );
});

test('findObjectInIntegrationConfig finds right object in config', () => {
  expect(
    findObjectInIntegrationConfig(testContactObject, testIntegrationConfig),
  ).toMatchObject(testContactConfig);

  expect(
    findObjectInIntegrationConfig(testAccountsObject, testIntegrationConfig),
  ).toMatchObject(testAccountConfig);
});

test('findSourceFromList finds source in list', () => {
  expect(
    findSourceFromList('read-accounts-and-contacts-from-salesforce', TestSourceList),
  ).toMatchObject(testReadAccountsAndContactsFromSalesforce);
});
