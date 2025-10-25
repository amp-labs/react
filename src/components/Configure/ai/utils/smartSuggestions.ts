/**
 * AI Helper Utilities for Smart Field Suggestions
 *
 * This module provides client-side AI/heuristics for:
 * - Field mapping suggestions
 * - Smart defaults based on common patterns
 * - Contextual help and validation
 * - Error recovery suggestions
 *
 * Approach: Pattern matching and rule-based heuristics (no external API calls)
 */

import {
  FieldMetadata,
  HydratedIntegrationField,
  HydratedIntegrationFieldExistent,
  HydratedIntegrationObject,
  instanceOfHydratedIntegrationFieldExistent,
} from "@generated/api/src";

// Common field name patterns and their likely mappings
const FIELD_PATTERNS = {
  email: [
    "email",
    "emailAddress",
    "email_address",
    "e_mail",
    "contact_email",
    "userEmail",
  ],
  firstName: [
    "firstName",
    "first_name",
    "fname",
    "givenName",
    "given_name",
    "forename",
  ],
  lastName: [
    "lastName",
    "last_name",
    "lname",
    "surname",
    "familyName",
    "family_name",
  ],
  fullName: [
    "name",
    "fullName",
    "full_name",
    "displayName",
    "display_name",
    "contact_name",
  ],
  phone: [
    "phone",
    "phoneNumber",
    "phone_number",
    "tel",
    "telephone",
    "mobile",
    "cell",
  ],
  company: [
    "company",
    "companyName",
    "company_name",
    "organization",
    "org",
    "account",
  ],
  address: ["address", "street", "streetAddress", "street_address", "location"],
  city: ["city", "town", "locality"],
  state: ["state", "province", "region"],
  postalCode: [
    "postalCode",
    "postal_code",
    "zipCode",
    "zip_code",
    "zip",
    "postcode",
  ],
  country: ["country", "countryCode", "country_code", "nation"],
  createdAt: [
    "createdAt",
    "created_at",
    "dateCreated",
    "date_created",
    "createDate",
    "create_date",
  ],
  updatedAt: [
    "updatedAt",
    "updated_at",
    "dateModified",
    "date_modified",
    "modifiedDate",
    "lastModified",
    "last_modified",
  ],
  id: ["id", "userId", "user_id", "contactId", "contact_id", "customerId"],
};

/**
 * Normalize field name for comparison (remove common prefixes/suffixes, case insensitive)
 */
function normalizeFieldName(fieldName: string): string {
  return fieldName
    .toLowerCase()
    .replace(/^(amp_|user_|contact_|customer_)/, "") // remove common prefixes
    .replace(/_(id|key|value)$/, "") // remove common suffixes
    .replace(/[_-]/g, ""); // remove separators
}

/**
 * Calculate similarity score between two field names
 */
function calculateSimilarity(field1: string, field2: string): number {
  const norm1 = normalizeFieldName(field1);
  const norm2 = normalizeFieldName(field2);

  // Exact match
  if (norm1 === norm2) return 1.0;

  // Check if one contains the other
  if (norm1.includes(norm2) || norm2.includes(norm1)) {
    const shorter = Math.min(norm1.length, norm2.length);
    const longer = Math.max(norm1.length, norm2.length);
    return shorter / longer;
  }

  // Levenshtein distance for fuzzy matching
  const distance = levenshteinDistance(norm1, norm2);
  const maxLen = Math.max(norm1.length, norm2.length);
  return 1 - distance / maxLen;
}

/**
 * Simple Levenshtein distance implementation
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost, // substitution
      );
    }
  }

  return matrix[len1][len2];
}

/**
 * Suggest field mappings based on field names and patterns
 */
export function suggestFieldMapping(
  requiredField: HydratedIntegrationField,
  availableFields: { [key: string]: FieldMetadata },
): Array<{ fieldName: string; confidence: number; reason: string }> {
  const suggestions: Array<{
    fieldName: string;
    confidence: number;
    reason: string;
  }> = [];

  // Type guard: only HydratedIntegrationFieldExistent has fieldName
  if (!instanceOfHydratedIntegrationFieldExistent(requiredField)) {
    return suggestions;
  }

  // Type is now narrowed to HydratedIntegrationFieldExistent
  const existentField = requiredField as HydratedIntegrationFieldExistent;
  const requiredFieldName = existentField.fieldName || "";

  // Check against common patterns first
  for (const [patternName, patterns] of Object.entries(FIELD_PATTERNS)) {
    if (
      patterns.some(
        (p) => normalizeFieldName(p) === normalizeFieldName(requiredFieldName),
      )
    ) {
      // This required field matches a known pattern
      for (const [availableFieldName] of Object.entries(availableFields)) {
        if (
          patterns.some(
            (p) =>
              normalizeFieldName(p) === normalizeFieldName(availableFieldName),
          )
        ) {
          suggestions.push({
            fieldName: availableFieldName,
            confidence: 0.95,
            reason: `Common ${patternName} field pattern`,
          });
        }
      }
    }
  }

  // If no pattern matches, use similarity scoring
  if (suggestions.length === 0) {
    for (const [availableFieldName] of Object.entries(availableFields)) {
      const similarity = calculateSimilarity(
        requiredFieldName,
        availableFieldName,
      );

      if (similarity > 0.6) {
        // Only suggest if similarity is above threshold
        suggestions.push({
          fieldName: availableFieldName,
          confidence: similarity,
          reason:
            similarity > 0.9 ? "Very similar field name" : "Similar field name",
        });
      }
    }
  }

  // Sort by confidence (highest first)
  return suggestions.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Generate smart defaults for an integration based on manifest analysis
 */
export function generateSmartDefaults(
  integrationObject: HydratedIntegrationObject,
  availableFields: { [key: string]: FieldMetadata },
): {
  suggestedMappings: { [requiredField: string]: string };
  confidence: { [requiredField: string]: number };
} {
  const suggestedMappings: { [requiredField: string]: string } = {};
  const confidence: { [requiredField: string]: number } = {};

  const requiredFields = integrationObject.requiredFields || [];

  for (const requiredField of requiredFields) {
    // Only process HydratedIntegrationFieldExistent which has fieldName
    if (!instanceOfHydratedIntegrationFieldExistent(requiredField)) {
      continue;
    }

    const existentField = requiredField as HydratedIntegrationFieldExistent;
    const suggestions = suggestFieldMapping(existentField, availableFields);

    if (suggestions.length > 0 && suggestions[0].confidence > 0.8) {
      // Only auto-suggest if confidence is high
      const fieldName = existentField.fieldName || "";
      suggestedMappings[fieldName] = suggestions[0].fieldName;
      confidence[fieldName] = suggestions[0].confidence;
    }
  }

  return { suggestedMappings, confidence };
}

/**
 * Analyze validation errors and provide helpful suggestions
 */
export function suggestErrorFix(
  errorMessage: string,
  fieldName: string,
): string | null {
  const lowerError = errorMessage.toLowerCase();

  // Common error patterns and suggestions
  if (
    lowerError.includes("required") ||
    lowerError.includes("missing") ||
    lowerError.includes("must be")
  ) {
    return `The field "${fieldName}" is required. Please select a mapping from your available fields.`;
  }

  if (lowerError.includes("type") || lowerError.includes("format")) {
    return `The field "${fieldName}" has a type or format mismatch. Check that your selected field is the correct data type.`;
  }

  if (lowerError.includes("unique") || lowerError.includes("duplicate")) {
    return `The field "${fieldName}" must be unique. Make sure you haven't used this field mapping elsewhere.`;
  }

  if (lowerError.includes("invalid")) {
    return `The value for "${fieldName}" is invalid. Please check the field requirements and try again.`;
  }

  return null;
}

/**
 * Get contextual help for a field based on its properties
 */
export function getFieldHelp(field: HydratedIntegrationField): {
  title: string;
  description: string;
  examples?: string[];
} {
  // Type guard: only HydratedIntegrationFieldExistent has these properties
  if (!instanceOfHydratedIntegrationFieldExistent(field)) {
    return {
      title: "Field Information",
      description: "Information about this field mapping.",
    };
  }

  const existentField = field as HydratedIntegrationFieldExistent;
  const fieldName = existentField.fieldName || "";
  // Note: HydratedIntegrationFieldExistent doesn't have 'required' property
  // We'll default to false
  const isRequired = false;

  // Pattern-based help
  for (const [patternName, patterns] of Object.entries(FIELD_PATTERNS)) {
    if (
      patterns.some(
        (p) => normalizeFieldName(p) === normalizeFieldName(fieldName),
      )
    ) {
      return getPatternHelp(patternName, isRequired);
    }
  }

  // Generic help
  return {
    title: `About ${fieldName}`,
    description: isRequired
      ? `This field is required for the integration to work properly.`
      : `This optional field can enhance your integration.`,
  };
}

/**
 * Get pattern-specific help text
 */
function getPatternHelp(
  pattern: string,
  isRequired: boolean,
): { title: string; description: string; examples?: string[] } {
  const helpMap: {
    [key: string]: { title: string; description: string; examples?: string[] };
  } = {
    email: {
      title: "Email Address",
      description: isRequired
        ? "Required email field for contact identification and communication."
        : "Optional email field for additional contact information.",
      examples: ["user@example.com", "contact@company.com"],
    },
    firstName: {
      title: "First Name",
      description: isRequired
        ? "Required field for the contact's first or given name."
        : "Optional field for personalizing communications.",
      examples: ["John", "Jane"],
    },
    lastName: {
      title: "Last Name",
      description: isRequired
        ? "Required field for the contact's last or family name."
        : "Optional field for complete contact identification.",
      examples: ["Doe", "Smith"],
    },
    phone: {
      title: "Phone Number",
      description: isRequired
        ? "Required phone number for contact."
        : "Optional phone number for additional contact methods.",
      examples: ["+1-555-0100", "(555) 123-4567"],
    },
    company: {
      title: "Company Name",
      description: isRequired
        ? "Required field for the organization or company name."
        : "Optional field for business context.",
      examples: ["Acme Corp", "Tech Startup Inc"],
    },
  };

  return (
    helpMap[pattern] || {
      title: `About ${pattern}`,
      description: isRequired
        ? "This field is required."
        : "This field is optional.",
    }
  );
}

/**
 * Detect field relationships and dependencies
 */
export function detectFieldRelationships(fields: HydratedIntegrationField[]): {
  [fieldName: string]: string[];
} {
  const relationships: { [fieldName: string]: string[] } = {};

  // Filter to only HydratedIntegrationFieldExistent which has fieldName
  const existentFields = fields.filter(
    (f): f is HydratedIntegrationFieldExistent =>
      instanceOfHydratedIntegrationFieldExistent(f),
  );

  const fieldNames = existentFields.map((f) => f.fieldName || "");

  // Common field relationship patterns
  const relationshipPatterns = [
    { parent: ["firstName", "first_name"], child: ["lastName", "last_name"] },
    { parent: ["address", "street"], child: ["city", "state", "postalCode"] },
    { parent: ["company"], child: ["companySize", "industry"] },
  ];

  for (const pattern of relationshipPatterns) {
    const parentField = fieldNames.find((name) =>
      pattern.parent.some(
        (p) => normalizeFieldName(p) === normalizeFieldName(name),
      ),
    );

    if (parentField) {
      const relatedFields = fieldNames.filter((name) =>
        pattern.child.some(
          (c) => normalizeFieldName(c) === normalizeFieldName(name),
        ),
      );

      if (relatedFields.length > 0) {
        relationships[parentField] = relatedFields;
      }
    }
  }

  return relationships;
}
