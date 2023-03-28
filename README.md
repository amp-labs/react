# Ampersand React library

## Overview
Ampersand is a config-first platform for SaaS builders who are creating user-facing integrations, 
starting with Salesforce.

This repository contains the Ampersand React library, a set of React components that allow your
end users to install and manage Ampersand integrations.

## Prerequisites
- React version 16+
 
## Installation

In your repo, use `npm` to install the package:

```sh
npm install @amp-labs/react
```

## Usage

This library requires your application to be wrapped in the `<AmpersandProvider/>` context. 
`<AmpersandProvider />` takes these props:
- `apiKey`: an API key to access Ampersand services. Please contact the team to obtain a key.
- `projectID`: your project ID. Please contact the team to obtain your project ID.

Currently, we offer two primary components:
- `<InstallIntegration>`: Leads customers through installing Salesforce connection for an integration. Prompt users to provide their Salesforce credentials and guide them through the configuration of this integration. If the user had previously provided their Salesforce credentials already, this component will skip to the configuration step directly.
- `<ReconfigureIntegration>`: Allows users to view their existing configuration for a Salesforce integration, and offer them the ability to update the configuration. This component also handles any breaking changes between versions of you integration. If you added new fields in a new version of an integration, you should guide users to this page to update their configuration for the new fields.

Example:
```tsx
import { render } from 'react-dom';
import { AmpersandProvider, InstallIntegration, ReconfigureIntegration } from '@amp-labs/react';
import { Routes, Route } from 'react-router-dom';

const projectId = 'PROJECT_ID'; // Your Ampersand project ID.
const apiKey = 'API_KEY';       // Your Ampersand API key.

render (
  // Wrap your app with AmpersandProvider.
  <AmpersandProvider
    apiKey={apiKey}
    projectId={projectId}
  >
    <App />
  </AmpersandProvider>,
  document.getElementById('root');
)

function App() {
  // Name of the integration that you've defined in amp.yaml.
  const integration = 'sync-accounts-and-contacts-from-salesforce';
  // The ID that your app uses to identify this end user.
  const userId = 'USER_ID'; 
  // The ID that your app uses to identify a company, team, or workspace.
  // All member of the group has access to its integrations, and only
  // one member needs to install the integration.
  const groupId = 'GROUP_ID'; 

  return (
    <Routes>
      <Route path = '/install' element =
        // Connect credentials and configure integration.
        {<InstallIntegration 
          integration = {integration}
          userId = {userId}
          groupId = {groupId}
          redirectUrl = '/next-step' // Optional.
        />}
      />
      <Route path = '/manage' element =
        // View and edit configuration.
        {<ReconfigureIntegration 
          integration = {integration}
          userId = {userId}
          groupId = {groupId}
          redirectUrl = '/next-step' // Optional.
        />}
      >
    </Route>
  )
}
```

### Multiple Integrations

If you have multiple integrations using the same API (e.g. Salesforce), but only want to ask your users to connect their credentials once, you can set up a 2-step flow where the connection step and the configuration step are separated.

```tsx
import { ConnectSalesforce, InstallIntegration } from '@amp-labs/react';

function App() {
  const userId = 'USER_ID'; 
  const groupId = 'GROUP_ID'; 

  return (
    <Routes>
      <Route path = '/step-1' element =
        {<ConnectSalesforce 
          userId = {userId}
          groupId = {groupId}
          redirectUrl = '/choose-integration' // Optional.
        />}
      />
      <Route path = '/choose-integration' element =
        // Your own component to list integrations.
        {<ListOfSalesforceIntegrations />}
      />
      <Route path = '/integration-a' element =
        // Will bypass connection step if user has already connected Salesforce.
        {<InstallIntegration 
          integration = 'sync-accounts-from-salesforce'
          userId = {userId}
          groupId = {groupId}
        />}
      />
      <Route path = '/integration-b' element =
        // Will bypass connection step if user has already connected Salesforce.
        {<InstallIntegration 
          integration = 'sync-contacts-from-salesforce'
          userId = {userId}
          groupId = {groupId}
        />}
      />
    </Route>
  )
}
```

### Customizing the Style

This library was created with [Chakra UI](https://chakra-ui.com/). As a result if you would like to override the style of any of the components, you can wrap them in a `ChakraProvider` component and inject a Chakra theme object. Please see the [Chakra docs](https://chakra-ui.com/docs/styled-system/customize-theme) for how to do this. If your app is already using Chakra UI, then your themes and global overrides should automatically apply.

```tsx
import { ChakraProvider, extendTheme, withDefaultColorScheme } from '@chakra-ui/react';
import { InstallIntegration } from '@amp-labs/react';

const theme = extendTheme({
  fonts: {
    body: "system-ui, sans-serif",
    heading: "Georgia, serif",
  },
}, withDefaultColorScheme({
  colorScheme: 'blue',
  components: ['Button'],
}));

function MyComponent() {
  return (
    <ChakraProvider theme={theme}>
      <InstallIntegration 
        integration={integration}
        userId={userId}
        groupId={groupId}
      />
    </ChakraProvider>
  );
}
```

## License

This repository is licensed under the **MIT license**.

To read this license, please see [LICENSE.md](https://github.com/amp-labs/react/blob/main/LICENSE.md).
