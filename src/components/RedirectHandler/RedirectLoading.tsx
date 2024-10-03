import { LoadingCentered } from 'components/Loading';

import { Container } from '../ui-base/Container/Container';

export function RedirectLoading() {
  return (
    <Container style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
    }}
    >
      <LoadingCentered />
      <p>Redirecting</p>
    </Container>
  );
}
