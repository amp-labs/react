import type {
  HydratedIntegrationFieldExistent,
  IntegrationFieldMapping,
} from "@generated/api/src";
import { describe, expect, it } from "@jest/globals";

import { getFieldDisplayName, isIntegrationFieldMapping } from "./manifest";

describe("isIntegrationFieldMapping", () => {
  it("treats a field without fieldName as a mapping", () => {
    expect(isIntegrationFieldMapping({ mapToName: "priority" })).toBe(true);
  });

  it("treats a field with fieldName as an existent field", () => {
    expect(
      isIntegrationFieldMapping({ fieldName: "email", displayName: "Email" }),
    ).toBe(false);
  });
});

describe("getFieldDisplayName", () => {
  describe("existent fields", () => {
    it("uses the provider displayName when the builder defined no mapping", () => {
      const field: HydratedIntegrationFieldExistent = {
        fieldName: "email",
        displayName: "Email",
      };

      expect(getFieldDisplayName(field)).toBe("Email");
    });

    it("falls back to fieldName when there is no displayName", () => {
      const field = {
        fieldName: "estimate_number",
        displayName: "",
      } as HydratedIntegrationFieldExistent;

      expect(getFieldDisplayName(field)).toBe("estimate_number");
    });

    // The reported bug. A nested field has no provider metadata, so the server
    // hydrates displayName as TitleCase(fieldName) and the raw path renders.
    it("prefers mapToDisplayName over a JSONPath displayName", () => {
      const field: HydratedIntegrationFieldExistent = {
        fieldName: "$['Customer']['Email']",
        displayName: "$['Customer']['Email']",
        mapToName: "customer_email",
        mapToDisplayName: "Customer Email",
      };

      expect(getFieldDisplayName(field)).toBe("Customer Email");
    });

    // displayName outranks mapToName, and the server always populates it, so a
    // nested field needs mapToDisplayName to render a readable label.
    it("falls back to displayName when mapToDisplayName is absent", () => {
      const field: HydratedIntegrationFieldExistent = {
        fieldName: "$['Customer']['First_name']",
        displayName: "$['Customer']['First_name']",
        mapToName: "customer_first_name",
      };

      expect(getFieldDisplayName(field)).toBe("$['Customer']['First_name']");
    });

    it("prefers mapToDisplayName over a usable provider displayName", () => {
      const field: HydratedIntegrationFieldExistent = {
        fieldName: "firstname",
        displayName: "First Name",
        mapToName: "customer_first_name",
        mapToDisplayName: "Customer First Name",
      };

      expect(getFieldDisplayName(field)).toBe("Customer First Name");
    });

    it("prefers the provider displayName over mapToName", () => {
      const field: HydratedIntegrationFieldExistent = {
        fieldName: "phone",
        displayName: "Business Phone",
        mapToName: "customer_phone",
      };

      expect(getFieldDisplayName(field)).toBe("Business Phone");
    });
  });

  describe("field mappings", () => {
    it("uses mapToDisplayName when present", () => {
      const field: IntegrationFieldMapping = {
        mapToName: "priority",
        mapToDisplayName: "Priority",
      };

      expect(getFieldDisplayName(field)).toBe("Priority");
    });

    it("falls back to mapToName", () => {
      const field: IntegrationFieldMapping = { mapToName: "priority" };

      expect(getFieldDisplayName(field)).toBe("priority");
    });
  });
});
