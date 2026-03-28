<br/>
<div align="center">
    <a href="https://www.withampersand.com/?utm_source=github&utm_medium=readme&utm_campaign=react&utm_content=logo">
    <img src="https://res.cloudinary.com/dycvts6vp/image/upload/v1723671980/ampersand-logo-black.svg" height="30" align="center" alt="Ampersand logo" >
    </a>
<br/>
<br/>

<div align="center">

[![Star us on GitHub](https://img.shields.io/github/stars/amp-labs/react?color=FFD700&label=Stars&logo=Github)](https://github.com/amp-labs/react) [![Discord](https://img.shields.io/badge/Join%20The%20Community-black?logo=discord)](https://discord.gg/BWP4BpKHvf) [![Documentation](https://img.shields.io/badge/Read%20our%20Documentation-black?logo=book)](https://docs.withampersand.com) ![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg) <img src="https://img.shields.io/static/v1?label=license&message=MIT&color=white" alt="License">
</div>

</div>

# Ampersand React library

## Overview

[Ampersand](https://withampersand.com?trk=readme-github-react) is a declarative platform for SaaS builders who are creating product integrations. 

This repository contains the Ampersand React library, a set of React components that allow your end users to install and manage Ampersand integrations.

## Prerequisites
- React version 18+

### Next.js App Router

This library uses React hooks, browser APIs, and client-side dependencies throughout, making it a client-side library. When using Next.js App Router (v13+), ensure that components importing from `@amp-labs/react` are within a client boundary.

The library includes the `'use client'` directive at its entry points, so it should work automatically in most cases. If you encounter SSR-related errors, wrap your usage in a client component:

```tsx
'use client';

import { AmpersandProvider, ConnectProvider } from '@amp-labs/react';

export function MyIntegrationComponent() {
  return (
    <AmpersandProvider options={options}>
      <ConnectProvider /* ... */ />
    </AmpersandProvider>
  );
}
```

### Legacy (@amp-labs/react 1.x.x)
Requires 
- Chakra 2.4.4 - 2.10 (https://chakra-ui.com/getting-started)
- Chakra peer dependencies: @emotion/react, @emotion/styled, framer-motion
 
## Installation

In your repo, use `npm` or `yarn` to install the package [`@amp-labs/react`](https://www.npmjs.com/package/@amp-labs/react):

```sh
npm install @amp-labs/react
```

```sh
yarn add @amp-labs/react
```

### Migrating to @amp-labs/react 2.0+ from 1.x.x
@amp-labs/react 2.0+ no longer requires chakra as a dependency. Chakra dependencies (@chakra-ui/react @emotion/react @emotion/styled framer-motion) 
are no longer required. 

@amp-labs/react now ships with its own stylesheet which also allows users to override colors, 
fonts, and other css variables. See [Usage changes](#changes-with-2.0)


### Legacy (@amp-labs/react 1.x.x)
If you are using yarn, you'll have to also install the peer dependencies.
```
yarn add @amp-labs/react @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

## Usage

Please visit [our documentation](https://docs.withampersand.com/v1.0/docs/embeddable-ui-components) to learn more about how to use this library.

### Changes with 2.0
In addition to importing components, the default stylesheet must also be imported. You may also override 
`--amp` css variables from default [styles](https://github.com/amp-labs/react/blob/main/src/styles/variables.css) by importing your own stylesheet.

```
import { AmpersandProvider } from '@amp-labs/react';
import '@amp-labs/react/styles'; // amp-labs style sheet
import './App.css'; // optional: your own css override 

const options = {
  project: 'PROJECT', // Your Ampersand project name or ID.
  apiKey: 'API_KEY',// Your Ampersand API key.
};

function App() {
  return (
    // Wrap all your components inside AmpersandProvider.
    // You can either do this at the App level,
    // or further down in the component tree.
    <AmpersandProvider options={options}>
        // You can use any of the Ampersand components here.
        ...
    </AmpersandProvider>
  )
}
```

## License

This repository is licensed under the **MIT license**.

To read this license, please see [LICENSE.md](https://github.com/amp-labs/react/blob/main/LICENSE.md).


## Local Development

Please see [CONTRIBUTING.md](https://github.com/amp-labs/react/blob/main/CONTRIBUTING.md).

# AmpersandProvider with JWT Token Support

The `AmpersandProvider` now supports both API key and JWT token authentication methods.

## Usage

### API Key Authentication (Existing)

```tsx
import { AmpersandProvider } from './AmpersandContextProvider';

function App() {
  return (
    <AmpersandProvider
      options={{
        apiKey: "your-api-key-here",
        project: "your-project-id"
      }}
    >
      {/* Your app components */}
    </AmpersandProvider>
  );
}
```

### JWT Token Authentication (New)

```tsx
import { AmpersandProvider } from './AmpersandContextProvider';

function App() {
  const getToken = async (consumerRef: string, groupRef: string): Promise<string> => {
    // Your custom token retrieval logic here
    // This could involve calling your auth service, checking sessionStorage, etc.
    const response = await fetch('/api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ consumerRef, groupRef }),
    });
    
    const data = await response.json();
    return data.token;
  };

  return (
    <AmpersandProvider
      options={{
        getToken,
        project: "your-project-id"
      }}
    >
      {/* Your app components */}
    </AmpersandProvider>
  );
}
```

## Features

### JWT Token Caching

The JWT token provider automatically caches tokens in both memory and sessionStorage:

- **Memory Cache**: Fast access for the current session
- **sessionStorage**: Persistence across browser tabs/windows within the same session
- **Automatic Expiration**: Tokens are automatically refreshed when they expire
- **Cache Key**: Tokens are cached using the pattern `{consumerRef}:{groupRef}`

### Authentication Methods

The provider supports two mutually exclusive authentication methods:

1. **API Key**: Traditional API key authentication
2. **JWT Token**: Dynamic token retrieval with caching

You cannot use both methods simultaneously - the provider will throw an error if both `apiKey` and `getToken` are provided.

### Error Handling

- If neither `apiKey` nor `getToken` is provided, the provider will throw an error
- If both are provided, the provider will throw an error
- JWT token retrieval failures are properly handled and logged

## API Service Integration

The `useAPI` hook automatically detects which authentication method is available and configures the API service accordingly:

- **API Key**: Uses `X-Api-Key` header
- **JWT Token**: Uses `Authorization: Bearer {token}` header

The API service will automatically retrieve fresh tokens when needed, handling the caching and refresh logic transparently.