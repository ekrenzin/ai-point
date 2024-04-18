import { Configuration, OpenAIApi } from "openai";
import { getImageUrls, storeImageUrls } from "../../supabase/supabase";
import { Image } from "./ImageTypes";

class ImageBot {
  openai: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  public async getCategoryImages(
    category: string,
    title: string
  ): Promise<Image[]> {
    const images = await getImageUrls(category);
    if (images.length === 0) {
      const newImages = await this.createImages(category, title);
      await storeImageUrls(newImages);
      return newImages;
    }
    return images;
  }

  private async createImagePrompt(
    category: string,
    title: string
  ): Promise<string> {
    const prompt = `Respond with a description of an art peiece about ${category}. Describe the lighting, the colors, the shadows, the texture, the origin.`;
    const response = await this.openai.createCompletion({
      model: "gpt-3.5-turbo",
      prompt,
      max_tokens: 500,
      temperature: 1,
    });
    const output = response.data.choices[0].text || "";
    const cleanPrompt = `Remove all words that are not adjectives from this: ${output}`;
    const cleanResponse = await this.openai.createCompletion({
      model: "gpt-3.5-turbo",
      prompt: cleanPrompt,
      max_tokens: 500,
      temperature: 1,
    });
    const cleanedOutput =
      category +
      title +
      (cleanResponse.data.choices[0].text || "").replace(/(\r\n|\n|\r)/gm, "") +
      " - acrylic painting - realism";
    return cleanedOutput;
  }

  private async createImages(
    category: string,
    title: string
  ): Promise<Image[]> {
    const imagePrompt = await this.createImagePrompt(category, title);
    const response = await this.openai.createImage({
      prompt: imagePrompt,
      n: 1,
      size: "1024x1024",
    });
    const images = response.data.data;
    if (!images) throw new Error("No images found");
    const urls: Image[] = images.map((image) => {
      if (image.url)
        return {
          url: image.url,
          category: category,
        };
      else throw new Error("No image url found");
    });
    console.log(urls, imagePrompt);
    return urls;
  }
}

export { ImageBot };
