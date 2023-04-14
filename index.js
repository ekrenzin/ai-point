const express = require('express')
const app = express()
require('dotenv').config();

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);



app.get('/', async function (req, res) {
  console.log('Hello World', process.env.OPENAI_API_KEY)
  const openai = new OpenAIApi(configuration);
  const completion = await openai.createCompletion(
    {
      model: "text-davinci-003",
      prompt: "Hello world",
    }
  );
  console.log(completion.data);
})

app.listen(3000)

module.exports =  app
