import { ResponseError } from "@generated/api/src";
import { handleServerError } from "src/utils/handleServerError";

/** Matches the delimiter in handleServerError. */
const REMEDY_DELIMITER = "\x1e";

function createMockResponse(
  status: number,
  statusText: string,
  body: object,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    statusText,
    headers: { "Content-Type": "application/json" },
  });
}

describe("handleServerError", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("ResponseError handling", () => {
    it("calls setError with causes joined by newline", async () => {
      const response = createMockResponse(400, "Bad Request", {
        causes: ["field X is required", "field Y is invalid"],
        detail: "validation failed",
      });
      const error = new ResponseError(response, "Bad Request");
      const setError = jest.fn();

      await handleServerError(error, setError);

      expect(setError).toHaveBeenCalledWith(
        "field X is required\nfield Y is invalid",
      );
    });

    it("calls setError with detail when causes is absent", async () => {
      const response = createMockResponse(400, "Bad Request", {
        detail: "something went wrong",
      });
      const error = new ResponseError(response, "Bad Request");
      const setError = jest.fn();

      await handleServerError(error, setError);

      expect(setError).toHaveBeenCalledWith("something went wrong");
    });

    it("includes remedy in the error message when present", async () => {
      const response = createMockResponse(400, "Bad Request", {
        detail: "missing scope",
        remedy: "Add the 'read' scope to your OAuth app",
      });
      const error = new ResponseError(response, "Bad Request");
      const setError = jest.fn();

      await handleServerError(error, setError);

      expect(setError).toHaveBeenCalledWith(
        `missing scope${REMEDY_DELIMITER}Add the 'read' scope to your OAuth app`,
      );
    });

    it("does not call setError when setError is not provided", async () => {
      const response = createMockResponse(500, "Internal Server Error", {
        detail: "db error",
      });
      const error = new ResponseError(response, "Internal Server Error");

      await handleServerError(error);
    });

    it("handles non-JSON response body gracefully", async () => {
      const response = new Response("not json", {
        status: 500,
        statusText: "Internal Server Error",
      });
      const error = new ResponseError(response, "Internal Server Error");
      const setError = jest.fn();

      await handleServerError(error, setError);

      expect(setError).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenNthCalledWith(
        2,
        "Error parsing error response body:",
        expect.objectContaining({
          message: expect.stringContaining("not valid JSON"),
        }),
      );
    });
  });

  describe("non-ResponseError handling", () => {
    it("calls setError with error.message for non-ResponseError", async () => {
      const error = new Error("network failure");
      const setError = jest.fn();

      await handleServerError(error, setError);

      expect(setError).toHaveBeenCalledWith("network failure");
    });

    it("does not call setError when setError is not provided for non-ResponseError", async () => {
      const error = new Error("network failure");

      await handleServerError(error);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Unexpected error:",
        "network failure",
      );
    });
  });
});
