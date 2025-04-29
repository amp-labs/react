import { getEnvVariable } from "src/utils";

const VITE_ENABLE_CSRF = getEnvVariable("VITE_AMP_ENABLE_CSRF", false);
const NEXT_ENABLE_CSRF = getEnvVariable("NEXT_AMP_ENABLE_CSRF", false);
const REACT_APP_ENABLE_CSRF = getEnvVariable(
  "REACT_APP_AMP_ENABLE_CSRF",
  false,
);
export const enableCSRFProtection =
  !!VITE_ENABLE_CSRF || !!NEXT_ENABLE_CSRF || !!REACT_APP_ENABLE_CSRF;
