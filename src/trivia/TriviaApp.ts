import { Request, Response } from "express";
import { TriviaBot } from "./TriviaBot";

async function triviaPost(req: Request, res: Response) {
  try {
    const { method, credentials } = req.body;
    const bot = new TriviaBot(credentials);
    if (method === "question") {
      const question = await bot.generateNewQuestion();
      res.status(200).json({ result: question });
    } else if (method === "answer") {
      const answer = req.body;
      const result = await bot.checkAnswer(answer);
      res.status(200).json({ result });
    } else if (method === "repeat") {
      const question = await bot.repeatQuestion();
      res.status(200).json({ result: question });
    } else if (method === "score") {
      const score = await bot.getScore();
      res.status(200).json({ result: score });
    }
  } catch (error: any) {
    console.error(`Error with OpenAI API request: ${error.message}`);
  }
}

export { triviaPost };
