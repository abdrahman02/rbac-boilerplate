import type { Response } from "express";

const registry = new Map<number, Response>();

export const sseRegistry = {
  add: (userId: number, res: Response): void => {
    registry.set(userId, res);
  },
  remove: (userId: number): void => {
    registry.delete(userId);
  },
  push: (userId: number, event: string, data: unknown): void => {
    const res = registry.get(userId);
    res?.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  },
};
