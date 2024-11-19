import { AuthCardLayoutTemplate } from 'components/auth/AuthCardLayoutTemplate';

import { LandingContentProps } from './LandingContentProps';

/**
 * This flow is only used as for a mock provider. This flow is used for testing only.
 * @param param0
 * @returns
 */
export function NoAuthContent({ ...props }: LandingContentProps) {
  return <AuthCardLayoutTemplate {...props} />;
}
