import "dotenv/config";
import { z } from "zod";

const environment = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  PORT: z.coerce.number().default(4000),
  WEB_URL: z.string().default("http://localhost:5173")
});

export const env = environment.parse(process.env);

