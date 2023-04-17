
import weaviate from 'weaviate-ts-client';
const client = weaviate.client({
  scheme: 'https',
  host: 'open-site-i8ifcebl.weaviate.network',
  headers: {
    'X-OpenAI-Api-Key': process.env.OPENAI_API_KEY,
    'Authorization': 'Bearer ' + process.env.WEAVIATE_API_KEY,
  },
});

export { client }