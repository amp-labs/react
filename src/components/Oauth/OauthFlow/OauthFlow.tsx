import { PROVIDER_SALESFORCE } from '../../../constants';
import { NoSubdomainOauthFlow } from '../NoSubdomainEntry/NoSubdomainOauthFlow';
import { SalesforceOauthFlow } from '../Salesforce/SalesforceOauthFlow';
import { WorkspaceOauthFlow } from '../WorkspaceEntry/WorkspaceOauthFlow';

const GENERIC_WORKSPACE_FEATURE_FLAG = false;

type OauthFlowProps = {
  provider: string;
  consumerRef: string;
  consumerName?: string;
  groupRef: string;
  groupName?: string;
};

export function OauthFlow({
  provider, consumerRef, consumerName, groupRef, groupName,
}: OauthFlowProps) {
  if (GENERIC_WORKSPACE_FEATURE_FLAG && provider === PROVIDER_SALESFORCE) {
    return (
      <WorkspaceOauthFlow
        provider={provider}
        consumerRef={consumerRef}
        consumerName={consumerName}
        groupRef={groupRef}
        groupName={groupName}
      />
    );
  }

  if (provider === PROVIDER_SALESFORCE) {
    return (
      <SalesforceOauthFlow
        consumerRef={consumerRef}
        consumerName={consumerName}
        groupRef={groupRef}
        groupName={groupName}
      />
    );
  }

  return (
    <NoSubdomainOauthFlow
      provider={provider}
      consumerRef={consumerRef}
      consumerName={consumerName}
      groupRef={groupRef}
      groupName={groupName}
    />
  );
}
