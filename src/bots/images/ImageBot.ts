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

  public async getCategoryImage(category: string) {
    const images = await getImageUrls(category);
    if (images.length === 0) {
      const newImages = await this.createImages(category);
      await storeImageUrls(newImages);
      return newImages[0];
    }
    return images[0];
  }

  private async createImages(category: string): Promise<Image[]> {
    const response = await this.openai.createImage({
      prompt: "a white siamese cat",
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
    return urls;
  }
}

export { ImageBot };
