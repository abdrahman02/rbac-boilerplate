import { asyncHandler } from "../lib/async-handler.js";
import * as svc from "../services/dashboard.service.js";

export const roleDistribution = asyncHandler(async (_req, res) => {
  const result = await svc.getRoleDistribution();
  res.status(200).json(result);
});

export const stats = asyncHandler(async (_req, res) => {
  const result = await svc.getDashboardStats();
  res.status(200).json(result);
});

export const exportDashboard = asyncHandler(async (req, res) => {
  const permissions = req.user?.permissions ?? [];
  const buffer = await svc.buildExportWorkbook(permissions);

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const timeStr = now.toISOString().slice(11, 19).replace(/:/g, "-");

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", `attachment; filename="rbac-report-${dateStr}-${timeStr}.xlsx"`);
  res.send(buffer);
});
