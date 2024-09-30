import { AuthCardLayoutTemplate } from 'components/auth/AuthCardLayoutTemplate';
import { isChakraRemoved } from 'src/components/ui-base/constant';

import { ChakraLandingContent } from './ChakraLandingContent';
import { LandingContentProps } from './LandingContentProps';

export function NoAuthContent({ ...props }: LandingContentProps) {
  if (!isChakraRemoved) {
    return <ChakraLandingContent {...props} />;
  }

  return <AuthCardLayoutTemplate {...props} />;
}
