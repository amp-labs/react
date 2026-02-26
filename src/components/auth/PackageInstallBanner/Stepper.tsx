const steps = ["Install Package", "Authorize"];

const circleBase: React.CSSProperties = {
  width: "1.5rem",
  height: "1.5rem",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.75rem",
  fontWeight: 600,
  flexShrink: 0,
};

const activeCircle: React.CSSProperties = {
  ...circleBase,
  backgroundColor: "#3B82F6",
  color: "#fff",
};

const inactiveCircle: React.CSSProperties = {
  ...circleBase,
  backgroundColor: "#E5E7EB",
  color: "#9CA3AF",
};

const activeLabelStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "#111827",
};

const inactiveLabelStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  fontWeight: 400,
  color: "#9CA3AF",
};

const lineStyle: React.CSSProperties = {
  flex: 1,
  height: "1px",
  backgroundColor: "#D1D5DB",
  margin: "0 0.5rem",
};

interface StepperProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function Stepper({ currentStep, onStepClick }: StepperProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        margin: "1rem 0",
      }}
    >
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;
        const isClickable = onStepClick && isActive && stepNumber < currentStep;
        return (
          <div key={label} style={{ display: "contents" }}>
            {index > 0 && <div style={lineStyle} />}
            <div
              role={isClickable ? "button" : undefined}
              tabIndex={isClickable ? 0 : undefined}
              onClick={isClickable ? () => onStepClick(stepNumber) : undefined}
              onKeyDown={
                isClickable
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ")
                        onStepClick(stepNumber);
                    }
                  : undefined
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                cursor: isClickable ? "pointer" : "default",
              }}
            >
              <div style={isActive ? activeCircle : inactiveCircle}>
                {/* {stepNumber} */}
              </div>
              <span style={isActive ? activeLabelStyle : inactiveLabelStyle}>
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
