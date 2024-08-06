import r2wc from '@r2wc/react-to-web-component';

import { InstallIntegration } from 'components/Configure/InstallIntegration';
import {
  AmpersandProvider,
} from 'context/AmpersandContextProvider';

/**
* This component is a web component that wraps the InstallIntegration component from the @amp-labs/react library.
* AmpersandProvider is used to provide the apiKey and projectId to the InstallIntegration component.
* InstallIntegration is used to install an integration in the Ampersand platform.
*
* The wrapper breaks when using camelCase for the props,
* so the props are passed in as lowercase and then converted to camelCase in the component
* note: reason is unknown, may need to investigate further
*/
interface AmpersandIntallIntegrationProps {
  apikey: string
  projectid: string
  integration: string,
  username: string,
  userid: string,
  groupid: string,
  groupname: string
  // todo: add onInstall callback, add onInstallError callback
}

function AmpersandIntallIntegration({
  apikey, projectid, integration, username, userid, groupid, groupname,
}: AmpersandIntallIntegrationProps) {
  return (
    <AmpersandProvider options={{ apiKey: apikey, projectId: projectid }}>
      <InstallIntegration
        integration={integration}
        consumerName={username}
        consumerRef={userid}
        groupRef={groupid}
        groupName={groupname}
      />
    </AmpersandProvider>
  );
}

const WebAmpersandIntallIntegration = r2wc(AmpersandIntallIntegration, {
  props: {
    apikey: 'string',
    projectid: 'string',
    integration: 'string',
    username: 'string',
    userid: 'string',
    groupid: 'string',
    groupname: 'string',
  },
});

customElements.define('web-ampersand-install-integration', WebAmpersandIntallIntegration);
