import express from 'express';
import { createCompletion } from './openAI.js';
// import { splitStringIntoChunks, mergeCloseChunksIntoString } from './utils/textParser.js';


import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const app = express()
app.use(express.json());

try {
  app.listen(8080)
} catch (e) {
  app.listen(3000)
}

app.post('/api/actions', async function (req, res) {
  try {
    const body = req.body
    const { content, action } = body
    const data = []
    const prompt = getPrompt(action)
    const completion = await createCompletion(prompt, content)
    data.push(completion.data.choices[0].text)
    res.status(200).json({ result: data.join('') });
  } catch (error) {
    handleError(error, res)
  }
})

function getPrompt(action) {
  return require(`./prompts/${action}.json`)
}


function handleError(error, res) {
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


export {
  app
}