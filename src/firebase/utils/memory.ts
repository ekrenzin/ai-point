import { db } from "../firebase";
import { MemoryCredentials, interaction } from "../../types";

async function addMemory(
  credentials: MemoryCredentials,
  data: interaction
): Promise<string> {
  const { uid, id, chain } = credentials;
  const memoryRef = db.collection(`memory/${id}/${uid}/${chain}/interactions`);
  const newData = { ...data, timestamp: Date.now() };
  const res = await memoryRef.add(newData);
  return res.id;
}

async function getMemory(
  credentials: MemoryCredentials
): Promise<interaction[]> {
  const { uid, id, chain } = credentials;
  const memoryRef = db.collection(`memory/${id}/${uid}/${chain}/interactions`);
  const snapshot = await memoryRef.orderBy('timestamp', 'desc').get();
  if (snapshot.empty) {
    return [];
  }
  const interactions: interaction[] = [];
  for (const doc of snapshot.docs) {
    const data = doc.data();
    interactions.push(data as interaction);
  }
  return interactions.sort((a, b) => {
    if (!a.timestamp || !b.timestamp) return 0;
    if (a.timestamp === b.timestamp) return 0;
    return a.timestamp - b.timestamp
  });
}

async function deleteMemory(credentials: MemoryCredentials): Promise<void> {
  const { uid, id, chain } = credentials;
  const memoryRef = db.collection(`memory/${id}/${uid}/${chain}/interactions`);
  const snapshot = await memoryRef.get();
  if (snapshot.empty) {
    return;
  }
  for (const doc of snapshot.docs) {
    await doc.ref.delete();
  }
}

export { addMemory, getMemory, deleteMemory };
