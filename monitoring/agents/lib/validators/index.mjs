import { validateContent } from "./content-validator.mjs";
import { validateSchema } from "./schema-validator.mjs";
import { validateMeta } from "./meta-validator.mjs";
import { validateTechnicalFix } from "./technical-validator.mjs";
import { validateFileContent } from "./diff-validator.mjs";

const AGENT_VALIDATORS = {
  "content-writer": (code, metadata) => validateContent(code, metadata),
  "schema-generator": (code, metadata) => validateSchema(code),
  "meta-tag-optimizer": (_code, metadata) => validateMeta(metadata),
  "technical-fixer": (code, metadata) => validateTechnicalFix(code, metadata),
  "homepage-optimizer": (code, metadata) => validateTechnicalFix(code, metadata),
  "internal-link-optimizer": (code, metadata) =>
    validateTechnicalFix(code, metadata),
};

/**
 * Validate agent output before commit.
 * @param {string} agentType - The agent name
 * @param {string} code - The generated/modified code
 * @param {object} metadata - Additional context (targetKeyword, originalSize, etc.)
 * @returns {{ passed: boolean, errors: string[] }}
 */
export function validate(agentType, code, metadata = {}) {
  const agentValidator = AGENT_VALIDATORS[agentType];
  if (!agentValidator) {
    return { passed: true, errors: [] };
  }
  return agentValidator(code, metadata);
}

export { validateFileContent };
