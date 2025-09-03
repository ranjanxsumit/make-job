import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { ensureSchema } from "./db";
import { ensureSeed } from "./seed";
import { createJob, listJobs } from "./routes/jobs";
import { handleSeed } from "./routes/seed";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Init DB schema (best-effort)
  ensureSchema().then(() => ensureSeed()).catch((e) => console.error("Failed to ensure schema/seed", e));

  // API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Seed
  app.post("/api/seed", handleSeed);

  // Job routes
  app.get("/api/jobs", listJobs);
  app.post("/api/jobs", createJob);

  return app;
}
