import { IntegrationSource } from '../components/types/configTypes';

const TestSalesforceIntegrationSource: IntegrationSource = {
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

export default TestSalesforceIntegrationSource;
