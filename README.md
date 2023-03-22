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
import { AmpersandProvider, ConnectSalesforce, InstallSalesforce, ReconfigureSalesforce } from '@amp-labs/react';
import { Routes, Route } from 'react-router-dom';

const projectId = 'my-project-id'; // your project ID
const apiKey = 'my-api-key';       // your API key

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
  const integration = 'read-accounts-and-contacts-from-salesforce'; // name of the integration you'd like to install

  return (
    <Routes>
      <Route path='/install' element=
        {<InstallSalesforce 
          integration={integration}
          redirectUrl={'/next-step'}
        />}
      />
      <Route path='/reconfigure' element=
        {<ReconfigureSalesforce integration={integration}/>}
      >
      <Route path='/connect' element=
        {<ConnectSalesforce />}
      >
    </Route>
  )
}

```

## Development
To build this repo for development with hot reload, run:
```sh
npm run watch
```

To build this repo for production, run:
```sh
npm run build
```

To run the test suite, run:
```sh
npm run test
```

## License

This repository is licensed under the **MIT license**.

To read this license, please see [LICENSE.md](https://github.com/amp-labs/react/blob/main/LICENSE.md).

