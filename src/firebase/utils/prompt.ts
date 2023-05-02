import { db } from "../firebase";
import { MemoryCredentials } from "../../types";

async function setPrompt(
  credentials: MemoryCredentials,
  prompt: string
): Promise<void> {
  const { uid, chain } = credentials;
  const memoryRef = db.doc(`memory/${uid}/chains/${chain}/`);
  await memoryRef.set({ prompt });
}

async function getPrompt(credentials: MemoryCredentials): Promise<string> {
  const { uid, chain } = credentials;
  const memoryRef = db.doc(`memory/${uid}/chains/${chain}/`);
  const snapshot = await memoryRef.get();
  if (!snapshot.exists) {
    return "";
  }
  const data = snapshot.data();
  if (!data) {
    return "";
  }

  const prompt = data.prompt;
  return prompt;
}

export { setPrompt, getPrompt };
