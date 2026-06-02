import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Application } from "express";
import morgan from "morgan";
import { env } from "./config/env.js";
import { setupSwagger } from "./config/swagger.js";
import auditLogsRouter from "./routes/audit-logs.js";
import authRouter from "./routes/auth.js";
import dashboardRouter from "./routes/dashboard.js";
import notificationsRouter from "./routes/notifications.js";
import permissionsRouter from "./routes/permissions.js";
import rolesRouter from "./routes/roles.js";
import usersRouter from "./routes/users.js";

export function createApp(): Application {
  const app = express();

  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type"],
    }),
  );

  app.use(morgan("dev"));
  app.use(express.json({ limit: "10kb" }));
  app.use(cookieParser());

  setupSwagger(app);

  app.use("/api/auth", authRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/roles", rolesRouter);
  app.use("/api/permissions", permissionsRouter);
  app.use("/api/audit-logs", auditLogsRouter);
  app.use("/api/dashboard", dashboardRouter);
  app.use("/api/notifications", notificationsRouter);

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  return app;
}
