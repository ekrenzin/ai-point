import { BufferMemory } from "langchain/memory";
import { OpenAI } from "langchain/llms/openai";
import { ConversationChain } from "langchain/chains";
import { getMemory, addMemory, deleteMemory } from "../firebase/utils/memory";
import { HumanChatMessage, AIChatMessage } from "langchain/schema";
import { ChatMessageHistory } from "langchain/memory";
import { MemoryCredentials, interaction } from "../types";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  MessagesPlaceholder,
} from "langchain/prompts";

class Memorable {
  private credentials: MemoryCredentials;
  private model: OpenAI;

  public constructor(credentials: MemoryCredentials) {
    const model = new OpenAI({
      temperature: 0.9,
      modelName: "text-davinci-003",
      maxTokens: 500,
    });

    this.model = model;
    this.credentials = credentials;
  }

  private async remember(): Promise<BufferMemory> {
    const memRecords = await getMemory(this.credentials);
    let pastMessages: any[] = [];
    for (const interaction of memRecords) {
      const { message, response } = interaction;
      pastMessages.push(new HumanChatMessage(message));
      pastMessages.push(new AIChatMessage(response));
    }
    const chatHistory = new ChatMessageHistory(pastMessages);
    const memory = new BufferMemory({ 
        chatHistory,
     });
    return memory;
  }

  public async chainCall(input: string): Promise<string> {
    const memory = await this.remember();
    
    const chain = new ConversationChain({
      llm: this.model,
      memory: memory,
    });
    
    const res = await chain.call({ input });
    const response = res.response;
    return response;
  }

  public async memorize(data: interaction): Promise<void> {
    await addMemory(this.credentials, data);
  }

  public async forget(): Promise<void> {
    await deleteMemory(this.credentials);
  }
}

export { Memorable };
