import { Request, Response } from "express";
import { TriviaBot } from "./TriviaBot";

async function triviaPost(req: Request, res: Response) {
  try {
    const { method, credentials } = req.body;
    const bot = new TriviaBot(credentials);
    if (method === "question") {
      const { category } = req.body;
      const question = await bot.generateNewQuestion(category);
      res.status(200).json({ question });
    } else if (method === "answer") {
      const { question, answer } = req.body;
      const result = await bot.checkAnswer(question, answer);
      res.status(200).json({ result });
    } else if (method === "score") {
      const score = await bot.getScore();
      res.status(200).json({ result: score });
    } else if (method === "categories") {
      const categories = bot.getCategories();
      res.status(200).json({ categories });
    }
  } catch (error: any) {
    console.error(`Error with OpenAI API request: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
}

export { triviaPost };
