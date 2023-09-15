import {
  IntegrationConfig, IntegrationSource, ObjectConfig,
} from '../types/configTypes';

export const sources: IntegrationSource[] = [
  {
    name: 'read-accounts-and-contacts-from-salesforce',
    type: 'read',
    api: 'salesforce',
    objects: [
      {
        name: {
          objectName: 'account',
          displayName: 'Account',
        },
        requiredFields: [
          {
            fieldName: 'name',
            displayName: 'Name',
          },
          {
            fieldName: 'industry',
            displayName: 'Industry',
          },
        ],
        optionalFields: [
          {
            fieldName: 'annualRevenue',
            displayName: 'Annual Revenue',
            isDefaultSelected: true,
          },
          {
            fieldName: 'website',
            displayName: 'Website',
            isDefaultSelected: true,
          },
        ],
      },
      {
        name: {
          objectName: 'contact',
          displayName: 'Contact',
        },
        requiredFields: [
          {
            fieldName: 'firstName',
            displayName: 'First Name',
          },
          {
            fieldName: 'lastName',
            displayName: 'Last Name',
          },
          {
            fieldName: 'email',
            displayName: 'Email',
          },
        ],
        customFieldMapping: [
          {
            mapToName: 'pronoun',
            mapToDisplayName: 'Pronoun',
            prompt: 'We will use this word when addressing this person in emails we send out.',
            choices: [],
          },
        ],
      },
    ],
  },
  {
    name: 'write-emails-to-salesforce',
    api: 'salesforce',
    type: 'write',
    objects: [
      {
        name: {
          objectName: 'email',
          displayName: 'Email',
        },
      },
    ],
  },
];

export const TestSalesforceIntegrationSource: IntegrationSource = {
  name: 'read-accounts-and-contacts-from-salesforce',
  type: 'read',
  api: 'salesforce',
  objects: [
    {
      name: {
        objectName: 'account',
        displayName: 'Account',
      },
      requiredFields: [
        {
          fieldName: 'name',
          displayName: 'Name',
        },
        {
          fieldName: 'industry',
          displayName: 'Industry',
        },
      ],
      optionalFields: [
        {
          fieldName: 'annualRevenue',
          displayName: 'Annual Revenue',
          isDefaultSelected: true,
        },
        {
          fieldName: 'website',
          displayName: 'Website',
          isDefaultSelected: true,
        },
      ],
    },
    {
      name: {
        objectName: 'contact',
        displayName: 'Contact',
      },
      requiredFields: [
        {
          fieldName: 'firstName',
          displayName: 'First Name',
        },
        {
          fieldName: 'lastName',
          displayName: 'Last Name',
        },
        {
          fieldName: 'email',
          displayName: 'Email',
        },
      ],
      customFieldMapping: [
        {
          mapToName: 'pronoun',
          mapToDisplayName: 'Pronoun',
          prompt: 'This is the word we will use when addressing this contact in emails we send out.',
          choices: [
            {
              fieldName: 'formOfAddress',
              displayName: 'Form of Address',
            },
            {
              fieldName: 'petName',
              displayName: 'Pet Name',
            },
          ],
        },
      ],
    },
  ],
};

// TODO - delete me after config update is done
export const sampleIntegrationConfig : IntegrationConfig = [
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
    selectedFieldMapping: {
      pronoun: 'gender_pronoun',
    },
    requiredFields: {
      firstName: true,
      lastName: true,
      email: true,
    },
  } as ObjectConfig,
];
