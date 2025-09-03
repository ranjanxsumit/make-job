import { RequestHandler } from "express";
import { ensureSeed } from "../seed";

export const handleSeed: RequestHandler = async (_req, res) => {
  try {
    await ensureSeed();
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: String(e?.message ?? e) });
  }
};
