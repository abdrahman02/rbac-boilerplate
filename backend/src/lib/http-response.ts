import type { Response } from "express";
import type { ApiResponse } from "../types/index.js";

/**
 * Sends a successful `ApiResponse` envelope. Defaults to HTTP 200 with no
 * message; pass `message` for success acknowledgements (e.g. "Password updated").
 */
export function sendSuccess<T>(res: Response, data: T, status = 200, message: string | null = null): void {
  const body: ApiResponse<T> = { success: true, data, message };
  res.status(status).json(body);
}

/**
 * Sends a successful `ApiResponse` envelope with HTTP 201 for created resources.
 */
export function sendCreated<T>(res: Response, data: T): void {
  sendSuccess(res, data, 201);
}

/**
 * Sends a failed `ApiResponse` envelope with the given status and message.
 */
export function sendError(res: Response, status: number, message: string): void {
  const body: ApiResponse<null> = { success: false, data: null, message };
  res.status(status).json(body);
}

/**
 * Sends a 400 Bad Request error envelope.
 */
export function sendBadRequest(res: Response, message: string): void {
  sendError(res, 400, message);
}

/**
 * Sends a 404 Not Found error envelope.
 */
export function sendNotFound(res: Response, message: string): void {
  sendError(res, 404, message);
}
