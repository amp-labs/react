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

This library was created with [Chakra UI](https://chakra-ui.com/). You will need to wrap components in a `ChakraProvider` component and can optionally inject a Chakra theme object. Please see the [Chakra docs](https://chakra-ui.com/docs/styled-system/customize-theme) for how to to define a theme. If your app is already using Chakra UI, then your entire app is likely already wrapped in a `ChakraProvider`, then your themes and global overrides should automatically apply. If you&#39;re not using Chakra UI, then you&#39;ll likely want to wrap individual components in their own `ChakraProvider` like this:

```tsx
<ChakraProvider>  
  <InstallIntegration>
    integration = {integration}
    userId = {userId}
    groupId = {groupId}
    redirectUrl = '/next-step' // Optional.
  />
</ChakraProvider>

```

Here's a full example
:
```tsx
import { ChakraProvider, extendTheme, withDefaultColorScheme } from '@chakra-ui/react';
import { AmpersandProvider, InstallIntegration, ReconfigureIntegration } from '@amp-labs/react';
import { Routes, Route } from 'react-router-dom';

const options = {
  projectId:'test-project-id', // Your Ampersand project ID.
  apiKey:'AIzaSyAjpBTtaMPgavSTh1pDXaMLDzhtxEDaC7o',// Your Ampersand API key.
};

const theme = extendTheme({
  fonts: {
    body: "system-ui, sans-serif",
    heading: "Arial, serif",
  },
}, withDefaultColorScheme({
  colorScheme: 'blue',
  components: ['Button'],
}));

function App() {
  // Name of the integration that you've defined in amp.yaml.
  const integration = 'read-accounts-and-contacts-from-salesforce';
  // The ID that your app uses to identify this end user.
  const userId = 'USER_ID'; 
  // The ID that your app uses to identify a company, team, or workspace.
  // All member of the group has access to its integrations, and only
  // one member needs to install the integration.
  const groupId = 'GROUP_ID'; 

  return (
    // Wrap your app with AmpersandProvider.
    <AmpersandProvider options={options}>
      // Wrap the app in ChakraProvider if you're also using it to style
      // the rest of your app, otherwise wrap individual components.
      <ChakraProvider theme={theme}>
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
        </Routes>
      </ChakraProvider>
    </AmpersandProvider>
  )
}
```

## License

This repository is licensed under the **MIT license**.

To read this license, please see [LICENSE.md](https://github.com/amp-labs/react/blob/main/LICENSE.md).
