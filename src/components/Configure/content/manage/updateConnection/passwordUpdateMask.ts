import type { UpdateConnectionRequestUpdateMaskEnum } from "@generated/api/src";
import type { PasswordGrantCreds } from "src/components/auth/Oauth/PasswordGrant/PasswordGrantCreds";

/**
 * The update mask for the credentials from the password grant update form: the
 * username and password, and the client ID and secret only when either is filled
 * in. Client credentials are never returned, so the form cannot show them; fields
 * the mask leaves out keep the connection's stored values.
 */
export function passwordUpdateMask(
  creds: Pick<PasswordGrantCreds, "clientId" | "clientSecret">,
): UpdateConnectionRequestUpdateMaskEnum[] {
  const mask = [
    "oauth2PasswordCredentials.username",
    "oauth2PasswordCredentials.password",
  ];

  if (creds.clientId || creds.clientSecret) {
    mask.push(
      "oauth2PasswordCredentials.clientId",
      "oauth2PasswordCredentials.clientSecret",
    );
  }

  // The generated client's enum does not list the single-field masks until it is
  // regenerated from amp-labs/openapi#455; the cast can go then.
  return mask as UpdateConnectionRequestUpdateMaskEnum[];
}
