import bcrypt from "bcryptjs";
import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { Priority, RecordStatus, Role, TaskType, TransactionKind } from "@prisma/client";
import { z } from "zod";
import { recordAudit } from "./audit.js";
import { authenticate, permit, signToken } from "./auth.js";
import { env } from "./config.js";
import { db } from "./db.js";

const app = express();
app.use(helmet());
app.use(cors({ origin: env.WEB_URL }));
app.use(express.json({ limit: "10mb" }));
app.use(morgan("combined"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "online", service: "WAYNE CORPORATE FINANCE API" });
});

app.post("/api/auth/login", async (req, res) => {
  const input = z.object({ email: z.string().email(), password: z.string().min(6) }).parse(req.body);
  const user = await db.user.findUnique({ where: { email: input.email.toLowerCase() } });
  if (!user || !user.active || !(await bcrypt.compare(input.password, user.passwordHash))) {
    res.status(401).json({ message: "Credenciais invalidas." });
    return;
  }

  const token = signToken({ userId: user.id, role: user.role, email: user.email });
  // await recordAudit(req, "LOGIN", "User", user.id);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// app.use("/api", authenticate);

app.get("/api/dashboard", async (_req, res) => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const dueSoon = new Date(now.getTime() + 7 * 86400000);

  const [clients, pendingTasks, transactions, documents] = await Promise.all([
    db.client.findMany({ orderBy: { legalName: "asc" } }),
    db.task.findMany({
      where: { status: { in: [RecordStatus.PENDING, RecordStatus.URGENT, RecordStatus.IN_PROGRESS] } },
      include: { responsible: { select: { name: true } }, client: { select: { tradeName: true } } },
      orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
      take: 8
    }),
    db.transaction.findMany({
      where: { dueDate: { gte: monthStart, lt: monthEnd } },
      include: { client: { select: { tradeName: true } } },
      orderBy: { dueDate: "asc" }
    }),
    db.document.count()
  ]);

  const receivables = transactions.filter((item) => item.kind === TransactionKind.RECEIVABLE);
  const payables = transactions.filter((item) => item.kind === TransactionKind.PAYABLE);
  const sum = (items: typeof transactions) => items.reduce((total, item) => total + Number(item.amount), 0);
  const received = sum(receivables.filter((item) => item.status === RecordStatus.COMPLETED));
  const paid = sum(payables.filter((item) => item.status === RecordStatus.COMPLETED));

  res.json({
    metrics: {
      monthlyRevenue: sum(receivables),
      monthlyExpenses: sum(payables),
      balance: received - paid,
      cashFlow: sum(receivables) - sum(payables),
      activeClients: clients.filter((client) => client.state === "ACTIVE").length,
      delinquentClients: clients.filter((client) => client.state === "DELINQUENT").length,
      pendingIssues: pendingTasks.length,
      documents
    },
    dueSoon: transactions.filter((item) => item.dueDate <= dueSoon && item.status !== RecordStatus.COMPLETED),
    tasks: pendingTasks,
    transactions
  });
});

app.get("/api/clients", async (_req, res) => {
  res.json(await db.client.findMany({ include: { _count: { select: { documents: true, transactions: true } } }, orderBy: { legalName: "asc" } }));
});

app.get("/api/transactions", async (req, res) => {
  const parsed = z.object({
    kind: z.nativeEnum(TransactionKind).optional(),
    status: z.nativeEnum(RecordStatus).optional()
  }).parse(req.query);
  res.json(await db.transaction.findMany({ where: parsed, include: { client: true }, orderBy: { dueDate: "asc" } }));
});

app.post("/api/transactions", permit(Role.DIRECTOR, Role.MANAGER, Role.FINANCIAL_ANALYST), async (req, res) => {
  const data = z.object({
    kind: z.nativeEnum(TransactionKind),
    description: z.string().min(3),
    category: z.string().min(2),
    counterparty: z.string().min(2),
    dueDate: z.coerce.date(),
    amount: z.number().positive(),
    recurrence: z.string().optional(),
    priority: z.nativeEnum(Priority).default(Priority.NORMAL),
    notes: z.string().optional(),
    clientId: z.string().optional()
  }).parse(req.body);
  const transaction = await db.transaction.create({ data });
  await recordAudit(req, "CREATE", "Transaction", transaction.id, { kind: data.kind });
  res.status(201).json(transaction);
});

app.patch("/api/transactions/:id/status", permit(Role.DIRECTOR, Role.MANAGER, Role.FINANCIAL_ANALYST), async (req, res) => {
  const id = z.string().min(1).parse(req.params.id);
  const { status } = z.object({ status: z.nativeEnum(RecordStatus) }).parse(req.body);
  const transaction = await db.transaction.update({
    where: { id },
    data: { status, paymentDate: status === RecordStatus.COMPLETED ? new Date() : undefined }
  });
  await recordAudit(req, "STATUS_CHANGE", "Transaction", transaction.id, { status });
  res.json(transaction);
});

app.get("/api/documents", async (_req, res) => {
  res.json(await db.document.findMany({ include: { client: true }, orderBy: { uploadedAt: "desc" } }));
});

app.get("/api/tasks", async (_req, res) => {
  res.json(await db.task.findMany({ include: { responsible: true, client: true }, orderBy: { dueDate: "asc" } }));
});

app.patch("/api/tasks/:id/status", async (req, res) => {
  const id = z.string().min(1).parse(req.params.id);
  const { status } = z.object({ status: z.nativeEnum(RecordStatus) }).parse(req.body);
  const task = await db.task.update({ where: { id }, data: { status } });
  await recordAudit(req, "STATUS_CHANGE", "Task", task.id, { status });
  res.json(task);
});

app.get("/api/protocols", async (_req, res) => {
  res.json(await db.protocol.findMany({ include: { responsible: true, client: true }, orderBy: { occurredAt: "desc" } }));
});

app.get("/api/audit", permit(Role.DIRECTOR, Role.MANAGER, Role.AUDITOR), async (_req, res) => {
  res.json(await db.auditLog.findMany({ include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" }, take: 100 }));
});

app.post("/api/tasks", async (req, res) => {
  const data = z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    type: z.nativeEnum(TaskType),
    dueDate: z.coerce.date(),
    priority: z.nativeEnum(Priority).default(Priority.NORMAL),
    clientId: z.string().optional()
  }).parse(req.body);
  const task = await db.task.create({ data: { ...data, responsibleId: req.auth!.userId } });
  await recordAudit(req, "CREATE", "Task", task.id);
  res.status(201).json(task);
});
const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({
      message: "Dados invalidos.",
      issues: error.issues
    });
    return;
  }

  console.error(error);

  res.status(500).json({
    message: error instanceof Error ? error.message : "Erro interno"
  });
};

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  console.log(`WAYNE CORPORATE FINANCE API ativa na porta ${PORT}.`);
});