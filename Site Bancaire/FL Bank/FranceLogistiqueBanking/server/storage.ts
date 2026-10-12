
import {
  type Employee,
  type InsertEmployee,
  type Transaction,
  type InsertTransaction,
  employees,
  transactions,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getEmployee(id: string): Promise<Employee | undefined>;
  getAllEmployees(): Promise<Employee[]>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(
    id: string,
    employee: Partial<InsertEmployee>,
  ): Promise<Employee | undefined>;
  deleteEmployee(id: string): Promise<boolean>;

  getTransaction(id: string): Promise<Transaction | undefined>;
  getAllTransactions(): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
}

export class DatabaseStorage implements IStorage {
  async getEmployee(id: string): Promise<Employee | undefined> {
    const [employee] = await db
      .select()
      .from(employees)
      .where(eq(employees.id, id))
      .limit(1);

    return employee;
  }

  async getAllEmployees(): Promise<Employee[]> {
    return db.select().from(employees);
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const [created] = await db
      .insert(employees)
      .values(employee)
      .returning();

    return created;
  }

  async updateEmployee(
    id: string,
    updates: Partial<InsertEmployee>,
  ): Promise<Employee | undefined> {
    const [updated] = await db
      .update(employees)
      .set(updates)
      .where(eq(employees.id, id))
      .returning();

    return updated;
  }

  async deleteEmployee(id: string): Promise<boolean> {
    const deleted = await db
      .delete(employees)
      .where(eq(employees.id, id))
      .returning({ id: employees.id });

    return deleted.length > 0;
  }

  async getTransaction(id: string): Promise<Transaction | undefined> {
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id))
      .limit(1);

    return transaction;
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return db
      .select()
      .from(transactions)
      .orderBy(desc(transactions.createdAt));
  }

  async createTransaction(
    transaction: InsertTransaction,
  ): Promise<Transaction> {
    const [created] = await db
      .insert(transactions)
      .values(transaction)
      .returning();

    return created;
  }
}

export const storage = new DatabaseStorage();
