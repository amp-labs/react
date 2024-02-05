import React, { useEffect } from 'react';
import { Box } from '@chakra-ui/react';

import { LoadingIcon } from '../../assets/LoadingIcon';

type RedirectHandlerProps = {
  redirectURL?: string;
  children: React.ReactNode;
};

/**
 * RedirectHandler is a component that redirects to a specified URL when mounted or
 * will render the childen if no redirect URL is present.
 *
 * @param redirectURL
 * @param children
 * @returns
 */
export function RedirectHandler({ redirectURL, children } : RedirectHandlerProps) {
  useEffect(() => {
    // Check if a redirect URL is present
    if (redirectURL) {
      // Redirect to the specified URL
      window.location.replace(redirectURL);
    }
  }, [redirectURL]);

  // show a loading message if a redirect URL is present
  if (redirectURL) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center">
        <LoadingIcon message="Redirecting..." />
      </Box>
    );
  }

  // render children if no redirect URL is present
  return children;
}
