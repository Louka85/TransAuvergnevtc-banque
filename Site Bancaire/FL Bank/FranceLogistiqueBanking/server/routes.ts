
import type { Express } from "express";
import { createServer, type Server } from "http";
import { count } from "drizzle-orm";
import { db } from "./db";
import { employees, transactions } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/health/db", async (_req, res) => {
    try {
      const [employeeResult] = await db
        .select({ total: count() })
        .from(employees);

      const [transactionResult] = await db
        .select({ total: count() })
        .from(transactions);

      res.json({
        connected: true,
        employees: employeeResult.total,
        transactions: transactionResult.total,
      });
    } catch (error) {
      console.error("Database connection test failed:", error);
      res.status(503).json({
        connected: false,
        error: "Database unavailable",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
