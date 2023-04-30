import {
  Configuration,
  OpenAIApi,
  CreateCompletionRequest,
  CreateCompletionResponse,
} from "openai";
import dotenv from 'dotenv';
dotenv.config();


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * Create a completion using the OpenAI API.
 * @param {any} prompt - The prompt for the completion.
 * @param {string} content - The content for the completion.
 * @returns {Promise<CreateCompletionResponse>} The completion.
 */
async function createCompletion(prompt: string): Promise<string> {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      temperature: 0.6,
      max_tokens: 500,
    });
    const data = response.data;
    const text = data.choices[0].text;
    return text || ""; // Extract data from the response
  } catch (error: any) {
    console.error(`Error with OpenAI API request: ${error.message}`);
    console.error({error})
    throw error;
  }
}

export { openai, createCompletion };
