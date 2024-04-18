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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WikiBot = void 0;
const axios_1 = __importDefault(require("axios"));
const categories_json_1 = __importDefault(require("./categories.json"));
const fs_1 = __importDefault(require("fs"));
/**
 * Utility class for fetching a random Wikipedia page using the MediaWiki API.
 */
class WikiBot {
    /**
     * Creates a new instance of the `WikiBot` class.
     */
    constructor() { }
    getCategoryList() {
        //map the keys to an array
        const categoryList = Object.keys(categories_json_1.default);
        return categoryList;
    }
    /**
     * Fetches a random page title from the English Wikipedia using the MediaWiki API.
     * @returns A Promise that resolves to the title of a random Wikipedia page.
     * @throws An Error if no random page is found in the response.
     */
    randomPage() {
        return __awaiter(this, void 0, void 0, function* () {
            const wikiUrl = "https://en.wikipedia.org/w/api.php?action=query&list=random&rnlimit=1&format=json&origin=*&rnnamespace=0";
            const res = yield axios_1.default.get(wikiUrl);
            const json = res.data;
            if (!json.query.random)
                throw new Error("No random page found");
            const title = json.query.random[0].title;
            const category = "Random";
            const url = `https://en.wikipedia.org/wiki/${title}`;
            const pageData = yield this.getPageData(title);
            const page = {
                url: url,
                title: title,
                content: pageData,
                category: category,
            };
            return page;
        });
    }
    /**
     * Fetches a random page title from the English Wikipedia using the MediaWiki API.
     * @returns A Promise that resolves to the title of a random Wikipedia page.
     * @throws An Error if no random page is found in the response.
     */
    randomPageFromCategory(inputCategory) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryTitle = inputCategory || this.getRandomCategory();
                //get a random subcategory from the category list where categoryTitle is the parent
                const unsafeCategories = categories_json_1.default;
                const category = unsafeCategories[categoryTitle][Math.floor(Math.random() * unsafeCategories[categoryTitle].length)];
                console.log({ inputCategory, category });
                const titles = yield this.getTitlesInCategory(category, categoryTitle);
                const randomTitle = this.getRandomTitle(titles);
                const pageData = yield this.getPageData(randomTitle);
                const page = {
                    url: `https://en.wikipedia.org/wiki/${randomTitle}`,
                    title: randomTitle,
                    content: pageData,
                    category: category,
                };
                return page;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    /**
     * Returns a random category from the categories array.
     * @throws An Error if the categories array is empty.
     */
    getRandomCategory() {
        //get the keys from the categories object
        const categoryList = Object.keys(categories_json_1.default);
        if (categoryList.length === 0) {
            throw new Error("No categories available");
        }
        return categoryList[Math.floor(Math.random() * categoryList.length)];
    }
    /**
     * Fetches the titles of pages in the given category using the MediaWiki API.
     * @param category The name of the category to fetch titles from.
     * @returns A Promise that resolves to an array of page titles.
     * @throws An Error if no pages are found in the category.
     */
    getTitlesInCategory(category, categoryTitle) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiEndpoint = `https://en.wikipedia.org/w/api.php`;
            const params = {
                action: "query",
                format: "json",
                list: "categorymembers",
                cmtitle: `Category:${category}`,
                cmlimit: 500,
                cmprop: "title",
                cmtype: "page",
            };
            const res = yield axios_1.default.get(apiEndpoint, { params });
            const json = res.data;
            if (!json.query ||
                !json.query.categorymembers ||
                json.query.categorymembers.length === 0) {
                console.warn("No pages found in category, removing category: ", category);
                console.log(params);
                //update the categories.json file categoryTitle is the parent category, remove the category from the list
                const unsafeCategories = categories_json_1.default;
                unsafeCategories[categoryTitle].splice(unsafeCategories[categoryTitle].indexOf(category), 1);
                fs_1.default.writeFileSync("./categories.json", JSON.stringify(categories_json_1.default));
                throw new Error("No pages found in category");
            }
            return json.query.categorymembers.map((page) => page.title);
        });
    }
    /**
     * Returns a random title from the given array of titles.
     * @param titles An array of page titles.
     * @throws An Error if the titles array is empty.
     */
    getRandomTitle(titles) {
        if (titles.length === 0) {
            throw new Error("No titles available");
        }
        return titles[Math.floor(Math.random() * titles.length)];
    }
    /**
     * Retrieves a Wikipedia page by its title and returns its content.
     * @async
     * @param {string} title - The title of the Wikipedia page to retrieve.
     * @returns {Promise<string>} The content of the Wikipedia page as a string.
     * @throws {Error} If no page is found for the given title.
     */
    getPageData(title) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get("https://en.wikipedia.org/w/api.php", {
                params: {
                    action: "query",
                    format: "json",
                    prop: "extracts",
                    exintro: true,
                    explaintext: true,
                    titles: title,
                },
            });
            const pages = response.data.query.pages;
            const page = Object.values(pages)[0];
            if (!page)
                throw new Error("No page found");
            if (!page.extract)
                throw new Error("No page found");
            const content = page.extract;
            return content;
        });
    }
}
exports.WikiBot = WikiBot;
//# sourceMappingURL=WikiBot.js.map