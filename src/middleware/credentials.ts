import { Request } from "express";
import { MemoryCredentials } from "../types";

function extractCredentials(req: Request): MemoryCredentials {
  const body = req.body;
  const { id, uid } = body;

  const credentials = {
    uid,
    chain: id,
  };

  return credentials;
}

export { extractCredentials };