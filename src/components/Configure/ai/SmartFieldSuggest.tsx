/**
 * SmartFieldSuggest Component
 *
 * Provides AI-powered field mapping suggestions with visual confidence indicators.
 * Uses client-side pattern matching and heuristics (no external API calls).
 *
 * Features:
 * - Auto-suggest field mappings based on name similarity
 * - Confidence indicators for suggestions
 * - One-click apply suggestions
 * - Visual feedback for high-confidence matches
 */

import { useEffect, useState } from "react";
import { FieldMetadata, HydratedIntegrationField } from "@generated/api/src";

import { suggestFieldMapping } from "./utils/smartSuggestions";

interface SmartFieldSuggestProps {
  /** The required field that needs mapping */
  requiredField: HydratedIntegrationField;
  /** Available fields from the customer's system */
  availableFields: { [key: string]: FieldMetadata };
  /** Current selected field (if any) */
  currentSelection?: string;
  /** Callback when user accepts a suggestion */
  onAcceptSuggestion: (fieldName: string) => void;
  /** Optional custom className for styling */
  className?: string;
}

export function SmartFieldSuggest({
  requiredField,
  availableFields,
  currentSelection,
  onAcceptSuggestion,
  className = "",
}: SmartFieldSuggestProps) {
  const [suggestions, setSuggestions] = useState<
    Array<{ fieldName: string; confidence: number; reason: string }>
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    // Generate suggestions when component mounts or fields change
    const newSuggestions = suggestFieldMapping(requiredField, availableFields);
    setSuggestions(newSuggestions.slice(0, 3)); // Show top 3 suggestions

    // Auto-show if there's a high-confidence suggestion and no current selection
    if (
      !currentSelection &&
      newSuggestions.length > 0 &&
      newSuggestions[0].confidence > 0.85
    ) {
      setShowSuggestions(true);
    }
  }, [requiredField, availableFields, currentSelection]);

  // Don't show if no suggestions or already has selection
  if (suggestions.length === 0) {
    return null;
  }

  const topSuggestion = suggestions[0];
  const isHighConfidence = topSuggestion.confidence > 0.85;

  return (
    <div className={`smart-field-suggest ${className}`}>
      {/* Collapsed view - show hint about available suggestion */}
      {!showSuggestions && (
        <button
          type="button"
          onClick={() => setShowSuggestions(true)}
          className="smart-suggest-hint"
          style={{
            padding: "4px 8px",
            fontSize: "12px",
            color: isHighConfidence ? "#059669" : "#0891b2",
            background: isHighConfidence ? "#d1fae5" : "#cffafe",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          {isHighConfidence ? "Smart match found" : "Suggestions available"}
        </button>
      )}

      {/* Expanded view - show suggestions */}
      {showSuggestions && (
        <div
          className="smart-suggestions-panel"
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
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#475569",
              }}
            >
              Smart Suggestions
            </span>
            <button
              type="button"
              onClick={() => setShowSuggestions(false)}
              style={{
                background: "none",
                border: "none",
                color: "#94a3b8",
                cursor: "pointer",
                padding: "0",
                fontSize: "18px",
              }}
            >
              ×
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {suggestions.map((suggestion, index) => (
              <SuggestionItem
                key={suggestion.fieldName}
                suggestion={suggestion}
                isTop={index === 0}
                onAccept={() => {
                  onAcceptSuggestion(suggestion.fieldName);
                  setShowSuggestions(false);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface SuggestionItemProps {
  suggestion: { fieldName: string; confidence: number; reason: string };
  isTop: boolean;
  onAccept: () => void;
}

function SuggestionItem({ suggestion, isTop, onAccept }: SuggestionItemProps) {
  const { fieldName, confidence, reason } = suggestion;
  const confidencePercent = Math.round(confidence * 100);
  const isHighConfidence = confidence > 0.85;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px",
        background: isTop && isHighConfidence ? "#ecfdf5" : "#ffffff",
        borderRadius: "4px",
        border: `1px solid ${isTop && isHighConfidence ? "#a7f3d0" : "#e2e8f0"}`,
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "#1e293b",
            marginBottom: "2px",
          }}
        >
          {fieldName}
          {isTop && isHighConfidence && (
            <span
              style={{
                marginLeft: "6px",
                fontSize: "11px",
                color: "#059669",
                fontWeight: 600,
              }}
            >
              BEST MATCH
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: "11px",
            color: "#64748b",
          }}
        >
          {reason} · {confidencePercent}% confident
        </div>
      </div>

      <button
        type="button"
        onClick={onAccept}
        style={{
          padding: "4px 12px",
          fontSize: "12px",
          fontWeight: 500,
          color: isHighConfidence ? "#ffffff" : "#0891b2",
          background: isHighConfidence ? "#059669" : "transparent",
          border: isHighConfidence ? "none" : "1px solid #0891b2",
          borderRadius: "4px",
          cursor: "pointer",
          marginLeft: "8px",
        }}
      >
        {isTop && isHighConfidence ? "Apply" : "Use"}
      </button>
    </div>
  );
}

/**
 * SmartFieldBadge - Inline indicator for auto-suggested fields
 *
 * Use this to show when a field has been auto-populated by smart suggestions
 */
interface SmartFieldBadgeProps {
  confidence: number;
  onRemove?: () => void;
}

export function SmartFieldBadge({
  confidence,
  onRemove,
}: SmartFieldBadgeProps) {
  const confidencePercent = Math.round(confidence * 100);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "2px 8px",
        fontSize: "11px",
        fontWeight: 500,
        color: "#059669",
        background: "#d1fae5",
        borderRadius: "12px",
      }}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M5 13l4 4L19 7" />
      </svg>
      Auto-matched ({confidencePercent}%)
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          style={{
            background: "none",
            border: "none",
            color: "#059669",
            cursor: "pointer",
            padding: "0",
            marginLeft: "2px",
            fontSize: "14px",
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}
