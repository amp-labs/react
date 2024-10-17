import { getEnvVariable } from 'src/utils';

/**
 * feature flag to remove chakra-ui
 * components should work with and without chakra-ui, and the imported styles
 *
 * To test with css modules, you must import the variable.css file into the parent app.
 * In the root component of the parent app you must add the following css import; then you
 * can turn this flag on to see the swapped component (non-chakra-ui).
 * ```
 * import '@amp-labs/react/styles
 * ```
 *
 */

// parent app my turn on or off the chakra-ui components with this flag
export const isChakraRemoved = getEnvVariable('REACT_APP_ENABLE_CSS', false);
