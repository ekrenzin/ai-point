import express, { Request, Response } from "express";
import { LangChainModel } from "./langchain/Model";
import { MemorableChat } from "./langchain/MemorableChat";
import dotenv from "dotenv";
import { OpenAI } from "langchain/llms/openai";
import { extractCredentials } from "./middleware/credentials";
import { triviaPost } from "./bots/trivia/TriviaApp";

dotenv.config();

LangChainModel.init();

const app = express();

app.use(express.json());
app.use("/api/memorable/:category", (req, res, next) => {
  const credentials = extractCredentials(req);
  req.body.credentials = credentials;
  next();
});

app.use("/api/trivia", (req, res, next) => {
  const credentials = extractCredentials(req);
  req.body.credentials = credentials;
  next();
});

app.post("/api/trivia", triviaPost);

try {
  app.listen(8000);
} catch (e) {
  app.listen(3000);
}

export default app;
