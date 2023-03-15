# Ampersand React library

## Overview
Ampersand is a config-first platform for SaaS builders who are creating user-facing integrations, 
starting with Salesforce.

This repository contains the Ampersand React library.

## Getting started

## Prerequisites
- React version 16+
 
## Setup

Clone the repository:

```sh
npm install @amp-labs/react
```

### Build


## Usage
This library requires your application to be wrapped in the `<AmpersandProvider/>` context. 

`<AmpersandProvider />` takes these props:
- `apiKey`: an API key to access Ampersand services. Please contact the team to obtain a key.
- `projectID`: your project ID. Please contact the team to obtain your project ID.

```tsx
import { render } from 'react-dom';
import { AmpersandProvider, ConfigureSalesforce } from '@amp-labs/react';

render (
  <AmpersandProvider
    apiKey={apiKey}
    projectId={}
    styles={}
  >
    <App />
  </AmpersandProvider>,
  document.getElementById('root');
)

function App() {
  const projectID = 'my-project-id'; // your project ID
  const apiKey = 'my-api-key';       // your API key
  const integration = 'read-accounts-and-contacts-from-salesforce'; // name of the integration you'd like to install
  const provider = 'salesforce';            // the API you'd like to integrate with
  const subdomain = 'my-salesforce-domain'; // your Salesforce My Domain

  return (
    <AmpersandProvider options={{
        apiKey,
        projectID,
      }}>
      <Routes>
        <Route path='/configure' element=
        // Embedding Ampersand's Configuration component
          {<ConfigureSalesforce 
            integration={integration}
          />}
        />
        <Route path='/connect' element=
        // Embedding Ampersand's Configuration component
          {<ConnectSalesforce />}
        />
      </Route>
    </AmpersandProvider>
  )
}

```

## License

This repository is licensed under the **MIT license**.

To read this license, please see [LICENSE.md](https://github.com/amp-labs/react/blob/main/LICENSE.md).

