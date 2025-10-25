/**
 * ContextualHelp Component
 *
 * Provides contextual help tooltips and information panels for fields.
 * Uses pattern recognition to provide relevant help based on field type.
 *
 * Features:
 * - Smart help text based on field patterns
 * - Examples for common field types
 * - Inline tooltips
 * - Expandable help panels
 */

import { useState } from "react";
import { HydratedIntegrationField } from "@generated/api/src";

import { getFieldHelp } from "./utils/smartSuggestions";

interface ContextualHelpProps {
  field: HydratedIntegrationField;
  /** Display mode: 'tooltip' or 'panel' */
  mode?: "tooltip" | "panel";
  /** Optional custom className */
  className?: string;
}

export function ContextualHelp({
  field,
  mode = "tooltip",
  className = "",
}: ContextualHelpProps) {
  const [isOpen, setIsOpen] = useState(false);
  const help = getFieldHelp(field);

  if (mode === "tooltip") {
    return (
      <HelpTooltip
        help={help}
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        className={className}
      />
    );
  }

  return <HelpPanel help={help} className={className} />;
}

interface HelpTooltipProps {
  help: { title: string; description: string; examples?: string[] };
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

function HelpTooltip({
  help,
  isOpen,
  onToggle,
  className = "",
}: HelpTooltipProps) {
  return (
    <div
      className={`contextual-help-tooltip ${className}`}
      style={{ position: "relative", display: "inline-block" }}
    >
      <button
        type="button"
        onClick={onToggle}
        onMouseEnter={() => onToggle()}
        onMouseLeave={() => onToggle()}
        style={{
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          border: "1px solid #cbd5e1",
          background: "#f8fafc",
          color: "#64748b",
          fontSize: "12px",
          fontWeight: "bold",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        }}
        aria-label="Help"
      >
        ?
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            width: "280px",
            padding: "12px",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "6px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
          }}
        >
          {/* Tooltip arrow */}
          <div
            style={{
              position: "absolute",
              top: "-6px",
              left: "50%",
              width: "12px",
              height: "12px",
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRight: "none",
              borderBottom: "none",
              transform: "translateX(-50%) rotate(45deg)",
            }}
          />

          <div style={{ position: "relative" }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#1e293b",
                marginBottom: "6px",
              }}
            >
              {help.title}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#475569",
                lineHeight: "1.5",
                marginBottom: help.examples ? "8px" : 0,
              }}
            >
              {help.description}
            </div>
            {help.examples && help.examples.length > 0 && (
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#64748b",
                    marginBottom: "4px",
                  }}
                >
                  Examples:
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#64748b",
                    fontFamily: "monospace",
                    background: "#f1f5f9",
                    padding: "6px",
                    borderRadius: "4px",
                  }}
                >
                  {help.examples.map((example, i) => (
                    <div key={i}>{example}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface HelpPanelProps {
  help: { title: string; description: string; examples?: string[] };
  className?: string;
}

function HelpPanel({ help, className = "" }: HelpPanelProps) {
  return (
    <div
      className={`contextual-help-panel ${className}`}
      style={{
        padding: "12px",
        background: "#f8fafc",
        borderRadius: "6px",
        border: "1px solid #e2e8f0",
        marginTop: "8px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "8px",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0891b2"
          strokeWidth="2"
          style={{ flexShrink: 0, marginTop: "2px" }}
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#1e293b",
              marginBottom: "4px",
            }}
          >
            {help.title}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "#475569",
              lineHeight: "1.5",
              marginBottom: help.examples ? "8px" : 0,
            }}
          >
            {help.description}
          </div>
          {help.examples && help.examples.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#64748b",
                  marginBottom: "4px",
                }}
              >
                Examples:
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#64748b",
                  fontFamily: "monospace",
                  background: "#ffffff",
                  padding: "6px",
                  borderRadius: "4px",
                }}
              >
                {help.examples.map((example, i) => (
                  <div key={i}>{example}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * ErrorHelp - Contextual help for validation errors
 */
interface ErrorHelpProps {
  errorMessage: string;
  suggestion?: string;
  className?: string;
}

export function ErrorHelp({
  errorMessage,
  suggestion,
  className = "",
}: ErrorHelpProps) {
  return (
    <div
      className={`error-help ${className}`}
      style={{
        padding: "10px 12px",
        background: "#fef2f2",
        borderRadius: "6px",
        border: "1px solid #fecaca",
        marginTop: "8px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "8px",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#dc2626"
          strokeWidth="2"
          style={{ flexShrink: 0, marginTop: "2px" }}
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "12px",
              color: "#991b1b",
              marginBottom: suggestion ? "6px" : 0,
            }}
          >
            {errorMessage}
          </div>
          {suggestion && (
            <div
              style={{
                fontSize: "12px",
                color: "#475569",
                padding: "8px",
                background: "#ffffff",
                borderRadius: "4px",
                borderLeft: "2px solid #0891b2",
              }}
            >
              <strong style={{ color: "#0e7490" }}>Suggestion:</strong>{" "}
              {suggestion}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * QuickTip - Lightweight inline tip
 */
interface QuickTipProps {
  message: string;
  type?: "info" | "success" | "warning";
  className?: string;
}

export function QuickTip({
  message,
  type = "info",
  className = "",
}: QuickTipProps) {
  const colors = {
    info: {
      bg: "#eff6ff",
      border: "#bfdbfe",
      text: "#1e40af",
      icon: "#3b82f6",
    },
    success: {
      bg: "#f0fdf4",
      border: "#bbf7d0",
      text: "#166534",
      icon: "#22c55e",
    },
    warning: {
      bg: "#fffbeb",
      border: "#fde68a",
      text: "#92400e",
      icon: "#f59e0b",
    },
  };

  const color = colors[type];

  return (
    <div
      className={`quick-tip ${className}`}
      style={{
        padding: "8px 10px",
        background: color.bg,
        borderRadius: "4px",
        border: `1px solid ${color.border}`,
        fontSize: "12px",
        color: color.text,
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color.icon}
        strokeWidth="2"
        style={{ flexShrink: 0 }}
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
      {message}
    </div>
  );
}
