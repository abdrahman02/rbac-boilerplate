import { createApp } from "./app.js";
import { testConnection } from "./config/database.js";
import { env } from "./config/env.js";

async function bootstrap(): Promise<void> {
  await testConnection();
  console.log("✓ Database connected");

  const app = createApp();

  app.listen(Number(env.PORT), () => {
    console.log(`✓ Server running at http://localhost:${env.PORT}`);
    console.log(`  Environment: ${env.NODE_ENV}`);
  });
}

bootstrap().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
