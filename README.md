# Ampersand React library

## Overview
Ampersand is a config-first platform for SaaS builders who are creating user-facing integrations, 
starting with Salesforce.

This repository contains the Ampersand React library, a set of React components that allow your
end users to install Ampersand integrations.

## Getting started

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
- `<InstallSalesforce>`: Leads customers through installing Salesforce connection for an integration. Prompts user to connect Salesforce, connecting customer subdomain, OAuth, and integration configuration. 
- `<ReconfigureSalesforce>`: Leads customers through updating an existing integration. Updates OAuth connection to Salesforce and prompts user to update settings.

Both components have the same prop signature: 
- `integration`: `string` - The name of the integration. Usually kebab-case.
- `redirectUrl` (optional): `string`: - URL to redirect to upon successful flow completion.

Example:
```tsx
import { render } from 'react-dom';
import { AmpersandProvider, InstallSalesforce, ReconfigureSalesforce } from '@amp-labs/react';
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

To run the test suie, run:
```sh
npm run test
```

## License

This repository is licensed under the **MIT license**.

To read this license, please see [LICENSE.md](https://github.com/amp-labs/react/blob/main/LICENSE.md).

