import type { Request } from "express";
import { db } from "./db.js";

export async function recordAudit(
  req: Request,
  action: string,
  entity: string,
  entityId?: string,
  details?: object
) {
  await db.auditLog.create({
    data: {
      action,
      entity,
      entityId,
      details,
      userId: req.auth?.userId,
      ipAddress: req.ip
    }
  });
}

