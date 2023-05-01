import { db } from "../firebase";
import { MemoryCredentials, interaction } from "../../types";


async function addMemory(
  credentials: MemoryCredentials,
  data: interaction
): Promise<string> {
  const { uid, chain } = credentials;
  const memoryRef = db.collection(`memory/${uid}/chains/${chain}/interactions`);
  const res = await memoryRef.add(data);
  return res.id;
}

async function getMemory(
  credentials: MemoryCredentials
): Promise<interaction[]> {
  const { uid, chain } = credentials;
  const memoryRef = db.collection(`memory/${uid}/chains/${chain}/interactions`);
  const snapshot = await memoryRef.get();
  if (snapshot.empty) {
    return [];
  }
  const interactions: interaction[] = [];
  snapshot.forEach((doc) => {
    interactions.push(doc.data() as interaction);
  });
  return interactions;
}

async function deleteMemory(credentials: MemoryCredentials): Promise<void> {
  const { uid, chain } = credentials;
  const memoryRef = db.collection(`memory/${uid}/chains/${chain}/interactions`);
  const snapshot = await memoryRef.get();
  if (snapshot.empty) {
    return;
  }
  for (const doc of snapshot.docs) {
    await doc.ref.delete();
  }
}

export { addMemory, getMemory, deleteMemory };
