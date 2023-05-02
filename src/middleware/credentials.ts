import { Request } from "express";
import { MemoryCredentials } from "../types";

function extractCredentials(req: Request): MemoryCredentials {
  const body = req.body;
  const { uid, chain } = body;
  const id = req.params.id;

  const credentials = {
    uid,
    chain,
    id
  };

  return credentials;
}

export { extractCredentials };
