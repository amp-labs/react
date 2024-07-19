import { Config } from '@generated/api/src';
import r2wc from '@r2wc/react-to-web-component';

import { InstallIntegration } from 'components/Configure';
import { AmpersandProvider } from 'context/AmpersandContextProvider';

type AmpersandInstallIntegrationProps = {
  apiKey: string;
  projectId: string;
  integration: string;
  consumerRef: string;
  groupName: string;
  userName: string;
  groupId: string;
  onInstallSuccess?: (installationId: string, config: Config) => void;
  onUpdateSuccess?: (installationId: string, config: Config) => void;
};

function AmpersandInstallIntegration({
  apiKey, projectId,
  integration,
  consumerRef, groupName, userName, groupId,
  onInstallSuccess, onUpdateSuccess,
}: AmpersandInstallIntegrationProps) {
  console.log('AmpersandInstallIntegration', {
    apiKey,
    projectId,
    integration,
    consumerRef,
    groupName,
    userName,
    groupId,
    onInstallSuccess,
    onUpdateSuccess,
  });
  return (
    <AmpersandProvider options={{ apiKey, projectId }}>
      <InstallIntegration
        integration={integration}
        consumerName={userName}
        consumerRef={consumerRef}
        groupRef={groupId}
        groupName={groupName}
        onInstallSuccess={onInstallSuccess}
        onUpdateSuccess={onUpdateSuccess}
      />
    </AmpersandProvider>
  );
}

const WebInstallIntegration = r2wc(AmpersandInstallIntegration, {
  shadow: 'open',
  props: {
    apiKey: 'string',
    projectId: 'string',
    integration: 'string',
    consumerRef: 'string',
    groupName: 'string',
    userName: 'string',
    groupId: 'string',
    onInstallSuccess: 'function',
    onUpdateSuccess: 'function',
  },
});

function TestComponent() {
  console.log('TestComponent');
  return <p>this is a test</p>;
}

customElements.define('web-install-integration', WebInstallIntegration);
customElements.define('test-component', r2wc(TestComponent, { shadow: 'open' }));

export { WebInstallIntegration };
