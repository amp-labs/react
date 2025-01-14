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
