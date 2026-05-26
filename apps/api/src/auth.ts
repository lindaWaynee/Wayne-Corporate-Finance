import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { env } from "./config.js";

type TokenPayload = {
  userId: string;
  role: Role;
  email: string;
};

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "8h" });
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Autenticacao necessaria." });
    return;
  }

  try {
    req.auth = jwt.verify(header.slice(7), env.JWT_SECRET) as TokenPayload;
    next();
  } catch {
    res.status(401).json({ message: "Sessao invalida ou expirada." });
  }
}

export function permit(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      res.status(403).json({ message: "Acesso nao autorizado para este perfil." });
      return;
    }
    next();
  };
}

