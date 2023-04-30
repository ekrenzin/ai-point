import express, { Request, Response } from 'express';
import { LangChainModel } from './langchain/Model';
import dotenv from 'dotenv';
import { OpenAI } from "langchain/llms/openai";
dotenv.config();

LangChainModel.init();

const app = express();

app.use(express.json());

try {
  app.listen(8080);
} catch (e) {
  app.listen(3000);
}

/**
 * Handles POST requests to the '/api/actions' route.
 * @param {Request} req - The express request object.
 * @param {Response} res - The express response object.
 */
app.post('/api/actions', async function (req: Request, res: Response) {
  try {
    const body = req.body;
    const { content } = body;
    // const model = LangChainModel.getModel();
    const model = new OpenAI({ temperature: 0.9, maxConcurrency: 1, modelName: 'text-davinci-003', maxTokens: 500 });
    console.log(model)
    const data = await model.call(content);
    console.log(data);
    // const completion = await model.generatePrompt(prompt)
    // data.push(completion || 'MISSING');
    res.status(200).json({ result: data });
  } catch (error: any) {
    handleError(error, res);
  }
});


/**
 * Handles errors.
 * @param {Error} error - The error object.
 * @param {Response} res - The express response object.
 */
function handleError(error: Error, res: Response) {
  console.error(`Error with OpenAI API request: ${error.message}`);
  res.status(500).json({
    error: {
      message: 'An error occurred during your request.',
    }
  });
}

export {
  app
};
