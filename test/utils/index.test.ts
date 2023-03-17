import { expect, test } from '@jest/globals';
import { IntegrationConfig, IntegrationSource, ObjectConfig } from '../../src/components/types/configTypes';
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
const targetIntegrationConfig : IntegrationConfig = [
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
  } as ObjectConfig,
  {
    objectName: 'contact',
    selectedOptionalFields: {},
    selectedFieldMapping: {},
    requiredFields: {
      firstName: true,
      lastName: true,
      email: true,
    },
  } as ObjectConfig,
];
const [targetAccountConfig, targetContactConfig] = targetIntegrationConfig;

test('getDefaultConfigForSource creates correct default config from source', () => {
  expect(
    getDefaultConfigForSource(testReadAccountsAndContactsFromSalesforce.objects),
  ).toEqual(targetIntegrationConfig);
});

test('findObjectInIntegrationConfig finds right object in config', () => {
  expect(
    findObjectInIntegrationConfig(targetContactObject, targetIntegrationConfig),
  ).toEqual(targetContactConfig);

  expect(
    findObjectInIntegrationConfig(targetAccountsObject, targetIntegrationConfig),
  ).toEqual(targetAccountConfig);
});

test('findSourceFromList finds source in list', () => {
  expect(
    findSourceFromList('read-accounts-and-contacts-from-salesforce', TestSourceList),
  ).toEqual(testReadAccountsAndContactsFromSalesforce);
});
