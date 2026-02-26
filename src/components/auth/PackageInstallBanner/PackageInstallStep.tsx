// Salesforce-specific: this step is shown for Salesforce External Client App providers
// that require a managed package installation before OAuth authorization.
import { Box } from "src/components/ui-base/Box/Box";
import { Button } from "src/components/ui-base/Button";

import { Stepper } from "./Stepper";

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  marginBottom: "0.25rem",
};

const iconContainerStyle: React.CSSProperties = {
  width: "2.5rem",
  height: "2.5rem",
  borderRadius: "50%",
  backgroundColor: "#EBF5FF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const titleStyle: React.CSSProperties = {
  fontWeight: 600,
  fontSize: "1.15rem",
  lineHeight: 1.2,
  margin: 0,
};

const subtitleStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  color: "#6b7280",
  margin: 0,
};

const infoBoxStyle: React.CSSProperties = {
  backgroundColor: "#EBF5FF",
  borderColor: "#BFD9F2",
  padding: "0.75rem 1rem",
  fontSize: "0.85rem",
  lineHeight: "1.5",
  color: "#1a1a1a",
};

const helperTextStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  color: "#6b7280",
  textAlign: "center",
  margin: "0.5rem 0 0",
};

const skipLinkStyle: React.CSSProperties = {
  color: "#6b7280",
  fontSize: "0.85rem",
  textDecoration: "none",
  cursor: "pointer",
  background: "none",
  border: "none",
  padding: 0,
  fontFamily: "inherit",
};

// Salesforce cloud icon SVG path
const SF_CLOUD_PATH = [
  "M10.05 5.12a4.79 4.79 0 0 1 3.6-1.62",
  "4.86 4.86 0 0 1 4.34 2.72",
  "5.6 5.6 0 0 1 2.26-.48C22.88 5.74 25 7.9 25 10.56",
  "a4.86 4.86 0 0 1-4.75 4.94H5.28",
  "A4.28 4.28 0 0 1 1 11.2a4.28 4.28 0 0 1 3.46-4.2",
  "4.6 4.6 0 0 1 5.59-1.88Z",
].join(" ");

const salesforceIcon = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d={SF_CLOUD_PATH}
      fill="#00A1E0"
      transform="scale(0.92) translate(0.5, 2)"
    />
  </svg>
);

const externalLinkIcon = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{ verticalAlign: "middle" }}
  >
    <path
      d="M3.5 1.5H10.5V8.5M10.5 1.5L1.5 10.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface PackageInstallStepProps {
  packageInstallUrl: string;
  providerName?: string;
  onSkip: () => void;
}

export function PackageInstallStep({
  packageInstallUrl,
  providerName,
  onSkip,
}: PackageInstallStepProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={headerStyle}>
        <div style={iconContainerStyle}>{salesforceIcon}</div>
        <div>
          <p style={titleStyle}>Connect {providerName}</p>
          <p style={subtitleStyle}>External Client App</p>
        </div>
      </div>

      <Stepper currentStep={1} />

      <Box style={infoBoxStyle}>
        <p style={{ margin: 0 }}>
          Your Salesforce admin needs to install a managed package before you
          can connect. This is a one-time setup per Salesforce org.
        </p>
      </Box>

      <a
        href={packageInstallUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
      >
        <Button type="button" style={{ width: "100%" }}>
          {externalLinkIcon}
          <span style={{ marginLeft: "0.5rem" }}>
            Install Salesforce Package
          </span>
        </Button>
      </a>

      <p style={helperTextStyle}>
        Opens in a new tab &middot; Requires Salesforce admin access
      </p>

      <div style={{ textAlign: "left", marginTop: "0.25rem" }}>
        <button type="button" style={skipLinkStyle} onClick={onSkip}>
          Already installed? Skip to authorization &rarr;
        </button>
      </div>
    </div>
  );
}
