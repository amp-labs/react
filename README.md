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

Currently, we offer these components to set up your Salesforce integration:
- `<InstallSalesforce>`: Leads customers through installing Salesforce connection for an integration. Prompt users to provide their Salesforce credentials and guide them through the configuration of this integration. If the user had previously provided their Salesforce credentials already, this component will skip to the configuration step directly.
  - Prop signature:
    - `integration`: `string` - The name of the integration, as defined in `amp.yaml`.
    - `redirectUrl` (optional): `string`: - URL to redirect to upon successful flow completion.
- `<ReconfigureSalesforce>`: Allows users to view their existing configuration for a Salesforce integration, and offer them the ability to update the configuration. 
  - Prop signature:
    - `integration`: `string` - The name of the integration, as defined in `amp.yaml`.
    - `redirectUrl` (optional): `string`: - URL to redirect to upon successful flow completion.
- `<ConnectSalesforce>`: Prompts user to connect Salesforce, connecting subdomain and OAuth.

Both components have the same prop signature: 

Example:
```tsx
import { render } from 'react-dom';
import { AmpersandProvider, ConnectSalesforce, InstallIntegration, ReconfigureIntegration } from '@amp-labs/react';
import { Routes, Route } from 'react-router-dom';

const projectId = 'PROJECT_ID'; // Your Ampersand project ID
const apiKey = 'API_KEY';       // Your Ampersand API key

render (
  // Wrap your app with AmpersandProvider
  <AmpersandProvider
    apiKey={apiKey}
    projectId={projectId}
  >
    <App />
  </AmpersandProvider>,
  document.getElementById('root');
)

function App() {
  // Name of the integration that you've defined in amp.yaml
  const integration = 'read-accounts-and-contacts-from-salesforce';
  // The ID that your app uses to identify this end user.
  const userId = 'USER_ID'; 
  // The ID that your app uses to identify a company, team, or workspace.
  // All member of the group has access to its integrations, and only
  // one member needs to install the integration.
  const groupId = 'GROUP_ID'; 

  return (
    <Routes>
      <Route path = '/install' element =
        {<InstallIntegration 
          integration = {integration}
          userId = {userId}
          groupId = {groupId}
          redirectUrl = '/next-step' // Optional.
        />}
      />
      <Route path = '/reconfigure' element =
        {<ReconfigureIntegration 
          integration = {integration}
          userId = {userId}
          groupId = {groupId}
          redirectUrl = '/next-step' // Optional.
        />}
      >
      <Route path = '/connect' element =
        {<ConnectSalesforce 
          userId = {userId}
          groupId = {groupId}
          redirectUrl = '/salesforce-integrations' // Optional.
        />}
      >
    </Route>
  )
}

```

## License

This repository is licensed under the **MIT license**.

To read this license, please see [LICENSE.md](https://github.com/amp-labs/react/blob/main/LICENSE.md).

