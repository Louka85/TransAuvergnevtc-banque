
import type { Express } from "express";
import { createServer, type Server } from "http";
import { desc } from "drizzle-orm";
import { db } from "./db";
import { employees, transactions } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/health/db", async (_req, res) => {
    try {
      const employeeRows = await db.select().from(employees);
      const transactionRows = await db.select().from(transactions);

      res.json({
        connected: true,
        employees: employeeRows.length,
        transactions: transactionRows.length,
      });
    } catch (error) {
      console.error("Database connection test failed:", error);
      res.status(503).json({
        connected: false,
        error: "Database unavailable",
      });
    }
  });

  app.get("/api/dashboard", async (_req, res) => {
    try {
      const employeeRows = await db.select().from(employees);

      const transactionRows = await db
        .select()
        .from(transactions)
        .orderBy(desc(transactions.createdAt));

      const totalBalance = employeeRows.reduce(
        (total, employee) => total + Number(employee.balance),
        0
      );

      const pendingTransfers = transactionRows.filter(
        (transaction) => transaction.status === "pending"
      ).length;

      res.json({
        totalEmployees: employeeRows.length,
        pendingTransfers,
        totalBalance: totalBalance.toFixed(2),
        monthlyGrowth: "+0%",
        recentTransactions: transactionRows.slice(0, 5),
      });
    } catch (error) {
      console.error("Dashboard data error:", error);
      res.status(500).json({
        error: "Unable to load dashboard data",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
