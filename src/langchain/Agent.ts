import type {OpenAI} from "langchain/llms/openai";
import type { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { WebBrowser } from "langchain/tools/webbrowser";

export const run = async (model: OpenAI, embeddings: OpenAIEmbeddings) => {
  console.log("Running agent", model);
  const browser = new WebBrowser({ model, embeddings });

  const result = await browser.call(
    `"https://www.themarginalian.org/2015/04/09/find-your-bliss-joseph-campbell-power-of-myth","who is joseph campbell"`
  );

  console.log(result);
};