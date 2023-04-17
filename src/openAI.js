import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


async function createCompletion(prompt, content) {
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt.base + content + prompt.end,
        temperature: 0.6,
        max_tokens: 500,
    });
    return completion
}

export { openai, createCompletion }