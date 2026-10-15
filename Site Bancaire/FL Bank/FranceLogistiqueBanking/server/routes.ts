import type { Express } from "express";
import { createServer, type Server } from "http";
import { desc, eq } from "drizzle-orm";
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

app.get("/api/employees", async (_req, res) => {
  try {
    const employeeRows = await db
      .select()
      .from(employees);

    res.json(employeeRows);
  } catch (error) {
    console.error("Employees API error:", error);
    res.status(500).json({
      error: "Unable to load employees",
    });
  }
});


  app.post("/api/employees", async (req, res) => {
    try {
      const { firstName, lastName, email, role, balance, bonus, status } =
        req.body;

      if (
        !firstName?.trim() ||
        !lastName?.trim() ||
        !email?.trim() ||
        !role ||
        balance === undefined ||
        !Number.isFinite(Number(balance)) ||
        Number(balance) < 0
      ) {
        return res.status(400).json({
          error: "Veuillez renseigner des informations valides.",
        });
      }

      const [newEmployee] = await db
        .insert(employees)
        .values({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          role,
          balance: Number(balance).toFixed(2),
          bonus: Number.isInteger(Number(bonus)) ? Number(bonus) : 0,
          status: status === "inactive" ? "inactive" : "active",
        })
        .returning();

      res.status(201).json(newEmployee);
    } catch (error) {
      console.error("Employee creation error:", error);

      res.status(500).json({
        error: "Impossible de créer l'employé. Vérifiez notamment si son adresse e-mail existe déjà.",
      });
    }
  });


  app.put("/api/employees/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { firstName, lastName, email, role } = req.body;

      if (
        !firstName?.trim() ||
        !lastName?.trim() ||
        !email?.trim() ||
        !role
      ) {
        return res.status(400).json({
          error: "Veuillez renseigner tous les champs obligatoires.",
        });
      }

      const [updatedEmployee] = await db
        .update(employees)
        .set({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          role,
        })
        .where(eq(employees.id, id))
        .returning();

      if (!updatedEmployee) {
        return res.status(404).json({
          error: "Employé introuvable.",
        });
      }

      res.json(updatedEmployee);
    } catch (error) {
      console.error("Employee update error:", error);
      res.status(500).json({
        error: "Impossible de modifier l'employé. Vérifiez notamment si son adresse e-mail existe déjà.",
      });
    }
  });

  
  const httpServer = createServer(app);
  return httpServer;
}
