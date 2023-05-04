import { BufferWindowMemory } from "langchain/memory";
import { getMemory, addMemory, deleteMemory } from "../firebase/utils/memory";
import { ChatMessageHistory } from "langchain/memory";
import { MemoryCredentials, interaction } from "../types";

class Memorable {
  public credentials: MemoryCredentials;

  public constructor(credentials: MemoryCredentials) {
    this.credentials = credentials;
  }

  public async remember(k: number = 10): Promise<BufferWindowMemory> {
    const memRecords = await getMemory(this.credentials);
    const chatHistory = new ChatMessageHistory();
    for (const interaction of memRecords) {
      const { message, response, timestamp } = interaction;
      chatHistory.addAIChatMessage(response);
      chatHistory.addUserMessage(message);
    }
    const memory = new BufferWindowMemory({
      chatHistory,
      k,
      returnMessages: true,
      memoryKey: "history",
    });
    return memory;
  }

  public async memorize(data: interaction): Promise<void> {
    await addMemory(this.credentials, data);
  }

  public async forget(): Promise<void> {
    await deleteMemory(this.credentials);
  }
}

export { Memorable };
