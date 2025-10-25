/**
 * AI-Enhanced Components for InstallIntegration
 *
 * This module exports smart components and utilities for improving
 * the integration installation UX with AI-powered suggestions.
 */

// Smart Field Suggestions
export { SmartFieldSuggest, SmartFieldBadge } from "./SmartFieldSuggest";

// Contextual Help Components
export { ContextualHelp, ErrorHelp, QuickTip } from "./ContextualHelp";

// AI Utility Functions
export {
  suggestFieldMapping,
  generateSmartDefaults,
  suggestErrorFix,
  getFieldHelp,
  detectFieldRelationships,
} from "./utils/smartSuggestions";
