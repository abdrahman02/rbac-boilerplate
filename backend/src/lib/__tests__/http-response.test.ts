import type { Response } from "express";
import { describe, expect, it } from "vitest";
import { sendBadRequest, sendCreated, sendError, sendNotFound, sendSuccess } from "../http-response.js";

/**
 * Builds a minimal Express Response mock that records the status code and JSON body.
 */
function createMockResponse(): { res: Response; getStatus: () => number; getBody: () => unknown } {
  let status = 0;
  let body: unknown = null;
  const res = {
    status(code: number) {
      status = code;
      return this;
    },
    json(payload: unknown) {
      body = payload;
      return this;
    },
  } as unknown as Response;

  return { res, getStatus: () => status, getBody: () => body };
}

describe("sendSuccess", () => {
  it("responds with 200 and a success envelope by default", () => {
    const { res, getStatus, getBody } = createMockResponse();
    sendSuccess(res, { id: 1 });
    expect(getStatus()).toBe(200);
    expect(getBody()).toEqual({ success: true, data: { id: 1 }, message: null });
  });

  it("honours a custom status code", () => {
    const { res, getStatus } = createMockResponse();
    sendSuccess(res, null, 202);
    expect(getStatus()).toBe(202);
  });

  it("includes a success message when provided", () => {
    const { res, getBody } = createMockResponse();
    sendSuccess(res, null, 200, "Password updated successfully.");
    expect(getBody()).toEqual({ success: true, data: null, message: "Password updated successfully." });
  });
});

describe("sendCreated", () => {
  it("responds with 201 and a success envelope", () => {
    const { res, getStatus, getBody } = createMockResponse();
    sendCreated(res, { id: 9 });
    expect(getStatus()).toBe(201);
    expect(getBody()).toEqual({ success: true, data: { id: 9 }, message: null });
  });
});

describe("sendError", () => {
  it("responds with the given status and an error envelope", () => {
    const { res, getStatus, getBody } = createMockResponse();
    sendError(res, 409, "Conflict");
    expect(getStatus()).toBe(409);
    expect(getBody()).toEqual({ success: false, data: null, message: "Conflict" });
  });
});

describe("sendNotFound", () => {
  it("responds with 404 and the provided message", () => {
    const { res, getStatus, getBody } = createMockResponse();
    sendNotFound(res, "Role not found");
    expect(getStatus()).toBe(404);
    expect(getBody()).toEqual({ success: false, data: null, message: "Role not found" });
  });
});

describe("sendBadRequest", () => {
  it("responds with 400 and the provided message", () => {
    const { res, getStatus, getBody } = createMockResponse();
    sendBadRequest(res, "Invalid role ID");
    expect(getStatus()).toBe(400);
    expect(getBody()).toEqual({ success: false, data: null, message: "Invalid role ID" });
  });
});
