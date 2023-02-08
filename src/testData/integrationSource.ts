import { SourceList, IntegrationSource } from '../components/types/configTypes';

export const TestSourceList: SourceList = [
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
            default: 'selected',
          },
          {
            fieldName: 'website',
            displayName: 'Website',
            default: 'selected',
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
          default: 'selected',
        },
        {
          fieldName: 'website',
          displayName: 'Website',
          default: 'selected',
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
