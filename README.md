# Ampersand React library

## Overview
Ampersand is a config-first platform for SaaS builders who are creating user-facing integrations, starting with Salesforce.

This repository contains the Ampersand React library, a set of React components that allow your end users to install and manage Ampersand integrations.

## Prerequisites
- React version 18+
- Chakra 2.4.4+ (https://chakra-ui.com/getting-started)
- Chakra peer dependencies: @emotion/react, @emotion/styled, framer-motion
 
## Installation

In your repo, use `npm` to install the package:

```sh
npm install @amp-labs/react
```

If you do not have Chakra installed you may need to install chakra and it's dependencies 

```
npm i @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

## Usage

This library requires your application to be wrapped in the `<AmpersandProvider/>` context. 
`<AmpersandProvider />` takes these props:
- `apiKey`: an API key to access Ampersand services. Please contact the team to obtain a key.
- `projectId`: your project ID. Please contact the team to obtain your project ID.

Currently, we offer the following component(s):
- `<InstallIntegration>`: Leads customers through installing Salesforce connection for an integration. Prompt users to provide their Salesforce credentials and guide them through the configuration of this integration. If the user had previously provided their Salesforce credentials already, this component will skip to the configuration step directly.


This library was created with [Chakra UI](https://chakra-ui.com/). 

```

Here's a full example
:
```tsx
import { AmpersandProvider, InstallIntegration } from '@amp-labs/react';
import { Routes, Route } from 'react-router-dom';

const options = {
  projectId: 'PROJECT_ID', // Your Ampersand project ID.
  apiKey: 'API_KEY',// Your Ampersand API key.
};


function App() {
  // Name of the integration that you've defined in amp.yaml.
  const integration = 'read-accounts-and-contacts-from-salesforce';
  // The ID/REF that your app uses to identify this end user.
  const consumerRef = 'CONSUMER_REF'; 
  // The ID/REF that your app uses to identify a company, team, or workspace.
  // All member of the group has access to its integrations, and only
  // one member needs to install the integration.
  const groupRef = 'GROUP_REF'; 
  const groupName = 'GROUP_NAME';

  return (
    // Wrap your app with AmpersandProvider.
    <AmpersandProvider options={options}>
        <Routes>
          <Route path = '/install' element =
            // Connect credentials and configure integration.
            {<InstallIntegration
              integration={integration}
              consumerName={userName}
              consumerRef={consumerRef}
              groupRef={groupRef}
              groupName={groupName}
            />}
          />
        </Routes>
    </AmpersandProvider>
  )
}
```

## License

This repository is licensed under the **MIT license**.

To read this license, please see [LICENSE.md](https://github.com/amp-labs/react/blob/main/LICENSE.md).


## Local Development

### Repo Setup
To generate the server api sdk from the swagger spec:

#### Java
java is required for sdk generation (```yarn generate-api```)

To install java on Mac 
```
brew install java
```

Then check your installation by running

```
java -version
```

if you see this: 

```
The operation couldn’t be completed. Unable to locate a Java Runtime.
Please visit http://www.java.com for information on installing Java.
```

Then you need to create a symlink for the system Java wrappers to find this JDK:

```
sudo ln -sfn /opt/homebrew/opt/openjdk/libexec/openjdk.jdk \
     /Library/Java/JavaVirtualMachines/openjdk.jdk
```

[https://stackoverflow.com/a/65601197](https://stackoverflow.com/a/65601197)

#### clone server repo
We need to first clone the `server` repo as a sibliing directory [https://github.com/amp-labs/server](https://github.com/amp-labs/server)
```
- amp-labs
-- server
-- react
```

#### to generate an updated sdk 
cd into `react` directory and generate open-api from sdk 

```yarn generate-api```
