import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import Cheerio from 'cheerio';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();


const app = express()
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const basePrompt = "Analyze this HTML. Respond with a title, and summary of the article. Include links to any images or videos in an array. "
const formatPrompt = " Format in a JSON object. {title, summary, images, videos}. The summary should be about the content of the article, not the content itself. Explain the purpose of the page, but do not summarize it. Your response should be a JSON object with no additional characters."

app.use(express.json()); // Make sure this line is present to parse the incoming JSON request body

app.post('/', async function (req, res) {

  try {
    console.log(req.body)
    //get the url from the body
    const url = req.body.url
    //get the html from the url
    const htmlRes = await fetch(url)
    const html = await htmlRes.text()
    const body = parseOutHtml(html)
    const fullPrompt = basePrompt + body + formatPrompt
    console.log({fullPrompt})
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: fullPrompt,
      temperature: 0.6,
      max_tokens: 500,
    });
    const text = completion.data.choices[0].text
    console.log(text)
    res.status(200).json({ result: text });
  } catch (error) {
    console.error(error);
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
})


function parseOutHtml(html) {

  // Load the HTML string into cheerio
  const $ = Cheerio.load(html);
  $('script').remove();
  $('nav').remove();
  
  const bodyContent = $('body').html();
  return bodyContent
}

app.listen(8080)

export {
  app
}