# Ampersand React library

## Overview
Ampersand is a config-first platform for SaaS builders who are creating user-facing integrations, starting with Salesforce and Hubspot

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
- `apiKey`
- `projectID`
- optional: a `styles` object

```tsx
import { render } from 'react-dom';
import { AmpersandProvider } from '@amp-labs/react';

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
  return (
    <>
      <>
    </>
  )
}

```

## Security

We've tried our best to follow security best practices, but we can't assure the security of your or your users' data. `@amp-labs/react` is provided **"as is"** without any **warranty**. 

## License

This repository is licensed under the **MIT license**.

To read this license, please see [LICENSE.md](https://github.com/amp-labs/react/blob/main/LICENSE.md).

