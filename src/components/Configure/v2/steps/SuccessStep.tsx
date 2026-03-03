import { SuccessCheckmarkIcon } from "assets/SuccessIcon";
import { Button } from "src/components/ui-base/Button";

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1.5rem",
  padding: "3rem 2rem",
  textAlign: "center",
};

const titleStyle: React.CSSProperties = {
  fontSize: "1.25rem",
  fontWeight: 600,
  margin: 0,
};

const descriptionStyle: React.CSSProperties = {
  fontSize: "0.9rem",
  color: "#6b7280",
  margin: 0,
};

interface SuccessStepProps {
  onEditConfiguration?: () => void;
}

export function SuccessStep({ onEditConfiguration }: SuccessStepProps) {
  return (
    <div style={containerStyle}>
      <SuccessCheckmarkIcon />
      <h2 style={titleStyle}>Integration Installation Successful</h2>
      <p style={descriptionStyle}>
        Your integration has been configured and is now active.
      </p>
      {onEditConfiguration && (
        <Button type="button" onClick={onEditConfiguration}>
          Edit Configuration
        </Button>
      )}
    </div>
  );
}
