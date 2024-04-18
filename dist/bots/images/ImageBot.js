"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageBot = void 0;
const openai_1 = require("openai");
const supabase_1 = require("../../supabase/supabase");
class ImageBot {
    constructor() {
        const configuration = new openai_1.Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        this.openai = new openai_1.OpenAIApi(configuration);
    }
    getCategoryImages(category, title) {
        return __awaiter(this, void 0, void 0, function* () {
            const images = yield (0, supabase_1.getImageUrls)(category);
            if (images.length === 0) {
                const newImages = yield this.createImages(category, title);
                yield (0, supabase_1.storeImageUrls)(newImages);
                return newImages;
            }
            return images;
        });
    }
    createImagePrompt(category, title) {
        return __awaiter(this, void 0, void 0, function* () {
            const prompt = `Respond with a description of an art peiece about ${category}. Describe the lighting, the colors, the shadows, the texture, the origin.`;
            const response = yield this.openai.createCompletion({
                model: "gpt-3.5-turbo",
                prompt,
                max_tokens: 500,
                temperature: 1,
            });
            const output = response.data.choices[0].text || "";
            const cleanPrompt = `Remove all words that are not adjectives from this: ${output}`;
            const cleanResponse = yield this.openai.createCompletion({
                model: "gpt-3.5-turbo",
                prompt: cleanPrompt,
                max_tokens: 500,
                temperature: 1,
            });
            const cleanedOutput = category +
                title +
                (cleanResponse.data.choices[0].text || "").replace(/(\r\n|\n|\r)/gm, "") +
                " - acrylic painting - realism";
            return cleanedOutput;
        });
    }
    createImages(category, title) {
        return __awaiter(this, void 0, void 0, function* () {
            const imagePrompt = yield this.createImagePrompt(category, title);
            const response = yield this.openai.createImage({
                prompt: imagePrompt,
                n: 1,
                size: "1024x1024",
            });
            const images = response.data.data;
            if (!images)
                throw new Error("No images found");
            const urls = images.map((image) => {
                if (image.url)
                    return {
                        url: image.url,
                        category: category,
                    };
                else
                    throw new Error("No image url found");
            });
            console.log(urls, imagePrompt);
            return urls;
        });
    }
}
exports.ImageBot = ImageBot;
//# sourceMappingURL=ImageBot.js.map