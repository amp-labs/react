export type ApiProblemParts = {
  detail: string;
  remedy?: string;
};

/** Internal delimiter between detail and remedy in serialized error strings. */
export const API_PROBLEM_REMEDY_DELIMITER = "\x1e";

const LEGACY_REMEDY_PATTERN = /\n\n\[Remedy\]\s*(.*)$/s;

export function getApiProblemParts(body: {
  causes?: string[];
  detail?: string;
  remedy?: string;
}): ApiProblemParts {
  const detail = body.causes?.join("\n") || body.detail || "";
  const remedy = body.remedy || undefined;
  return remedy ? { detail, remedy } : { detail };
}

export function serializeApiProblem(parts: ApiProblemParts): string {
  const trimmedDetail = parts.detail.trimEnd();
  if (!parts.remedy) {
    return trimmedDetail;
  }
  return `${trimmedDetail}${API_PROBLEM_REMEDY_DELIMITER}${parts.remedy}`;
}

export function parseApiProblemMessage(message: string): ApiProblemParts {
  const delimiterIndex = message.indexOf(API_PROBLEM_REMEDY_DELIMITER);
  if (delimiterIndex !== -1) {
    return {
      detail: message.slice(0, delimiterIndex),
      remedy: message.slice(
        delimiterIndex + API_PROBLEM_REMEDY_DELIMITER.length,
      ),
    };
  }

  const legacyMatch = message.match(LEGACY_REMEDY_PATTERN);
  if (legacyMatch) {
    return {
      detail: message.slice(0, legacyMatch.index),
      remedy: legacyMatch[1],
    };
  }

  return { detail: message };
}
