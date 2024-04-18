"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemorableChat = void 0;
const Memorable_1 = require("./Memorable");
const openai_1 = require("langchain/chat_models/openai");
const prompts_1 = require("langchain/prompts");
class MemorableChat extends Memorable_1.Memorable {
    constructor(credentials) {
        super(credentials);
        const model = new openai_1.ChatOpenAI();
        this.model = model;
    }
    getPrompt() {
        const chatPrompt = prompts_1.ChatPromptTemplate.fromPromptMessages([
            prompts_1.SystemMessagePromptTemplate.fromTemplate("You are a trivia bot ai. You respond with a variety of easy and hard trivia questions."),
            new prompts_1.MessagesPlaceholder("history"),
            prompts_1.HumanMessagePromptTemplate.fromTemplate("{input}"),
        ]);
        return chatPrompt;
    }
}
exports.MemorableChat = MemorableChat;
//# sourceMappingURL=MemorableChat.js.map