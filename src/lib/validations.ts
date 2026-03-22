import { z } from "zod";

export const chatBodySchema = z.object({
  botId: z.string().uuid(),
  message: z.string().min(1).max(8000),
});

export const uploadBodySchema = z.object({
  botId: z.string().uuid(),
  content: z.string().min(1).max(500_000),
});

export const botBodySchema = z.object({
  organizationId: z.string().uuid(),
  name: z.string().min(1).max(200),
  settings: z.record(z.string(), z.unknown()).optional(),
});
