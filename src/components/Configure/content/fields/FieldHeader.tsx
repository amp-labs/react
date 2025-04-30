import { Divider } from "src/components/ui-base/Divider";

interface FieldHeaderProps {
  string: string;
}

export function FieldHeader({ string }: FieldHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        paddingTop: "1rem",
        paddingBottom: ".5rem",
      }}
    >
      <h3
        style={{
          color: "var(--amp-colors-text-muted)",
          fontSize: "1rem",
          fontWeight: "400",
        }}
      >
        {string}
      </h3>
      <div
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Divider style={{ width: "100%", marginLeft: "1rem" }} />
      </div>
    </div>
  );
}
