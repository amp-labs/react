## Scripts

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

## Linting

To run the linter, run:
```sh
npm run lint
```

To integrate VSCode with this repo's `eslint` settings, please install the "ESLint" Extension. The rules in the `.vscode/settings.json` file of this repo defines the behavior of the extension on this workspace.

## SDK generation

### Repo Setup
To generate the SDK from the openapi spec in the server repo, follow these steps:

#### Install Java
java is required for sdk generation

To install java on Mac
```
brew install java
```

Then check your installation by running

```
java -version
```

If you see this:

```
The operation couldn’t be completed. Unable to locate a Java Runtime.
Please visit http://www.java.com for information on installing Java.
```

Then you need to create a symlink for the system Java wrappers to find this JDK:

```
sudo ln -sfn /opt/homebrew/opt/openjdk/libexec/openjdk.jdk \
     /Library/Java/JavaVirtualMachines/openjdk.jdk
```

More info at [https://stackoverflow.com/a/65601197](https://stackoverflow.com/a/65601197)

#### Clone server repo
We need to clone the [server repo](https://github.com/amp-labs/server) as a sibling directory, meaning that it lives in the same nesting level as this repo, here is an example directory structure:
```
- amp-labs
-- server
-- react
```

#### Generate the SDK
cd into `react` directory and run the following:

```yarn generate-api```
