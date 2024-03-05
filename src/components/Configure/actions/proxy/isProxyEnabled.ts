import { HydratedRevision } from '../../../../services/api';

export function getIsProxyEnabled(hydratedRevision: HydratedRevision) {
  return hydratedRevision.content.proxy?.enabled;
}
