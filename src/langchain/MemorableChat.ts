import { Memorable } from "./Memorable";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { MemoryCredentials } from "../types";
import { ConversationChain } from "langchain/chains";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  MessagesPlaceholder,
} from "langchain/prompts";

class MemorableChat extends Memorable {
  private model: ChatOpenAI;

  public constructor(credentials: MemoryCredentials) {
    super(credentials);
    const model = new ChatOpenAI();
    this.model = model;
  }

  private getPrompt(): ChatPromptTemplate {
    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        "You are a trivia bot ai. You respond with a variety of easy and hard trivia questions."
      ),
      new MessagesPlaceholder("history"),
      HumanMessagePromptTemplate.fromTemplate("{input}"),
    ]);
    return chatPrompt;
  }

  public async chainCall(input: string): Promise<string> {
    const memory = await this.remember();
    const prompt = this.getPrompt();
    const chain = new ConversationChain({
      llm: this.model,
      memory: memory,
      prompt: prompt,
    });

    const res = await chain.call({ input });
    const response = res.response;

    const interaction = { message: input, response }
    await this.memorize(interaction);

    return response;
  }
}

export { MemorableChat };
