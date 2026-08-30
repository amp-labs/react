import { useIntegrationQuery } from "src/hooks/query/useIntegrationQuery";

import { useInstallationProps } from "../InstallationProvider";

import { useInstallation } from "./useInstallation";

/**
 * Validation hook that checks prerequisites for installation mutations
 * @returns {Object} An object containing:
 *   - `canCreate` (boolean): Whether a new installation can be created
 *   - `canUpdate` (boolean): Whether an existing installation can be updated
 *   - `canDelete` (boolean): Whether an existing installation can be deleted
 *   - `validationErrors` (Object): Detailed validation error information
 */
export function useInstallationValidation() {
  const { integrationNameOrId } = useInstallationProps();
  const { data: integrationObj } = useIntegrationQuery(integrationNameOrId);
  const { installation } = useInstallation();

  const validationErrors = {
    noIntegration: !integrationObj,
    installationExists: !!installation,
    noInstallation: !installation,
  };

  return {
    canCreate: !validationErrors.installationExists && !validationErrors.noIntegration,
    canUpdate: !validationErrors.noInstallation && !validationErrors.noIntegration,
    canDelete: !validationErrors.noInstallation && !validationErrors.noIntegration,
    validationErrors,
    installation,
    integrationObj,
  };
}
