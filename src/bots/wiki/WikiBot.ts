import axios, { AxiosResponse } from "axios";
import categories from "./categories.json";
import { WikiPage } from "./WikiTypes";
import fs from "fs";
/**
 * Utility class for fetching a random Wikipedia page using the MediaWiki API.
 */
class WikiBot {
  /**
   * Creates a new instance of the `WikiBot` class.
   */
  public constructor() {}

  /**
   * Fetches a random page title from the English Wikipedia using the MediaWiki API.
   * @returns A Promise that resolves to the title of a random Wikipedia page.
   * @throws An Error if no random page is found in the response.
   */
  public async randomPage(): Promise<WikiPage> {
    const wikiUrl =
      "https://en.wikipedia.org/w/api.php?action=query&list=random&rnlimit=1&format=json&origin=*&rnnamespace=0";
    const res: AxiosResponse = await axios.get(wikiUrl);
    const json: any = res.data;
    if (!json.query.random) throw new Error("No random page found");

    const title = json.query.random[0].title;
    const category = "Random"
    const url = `https://en.wikipedia.org/wiki/${title}`;
    const pageData = await this.getPageData(title);
    const page: WikiPage = {
      url: url,
      title: title,
      content: pageData,
      category: category,
    };
    return page;
  }
  /**
   * Fetches a random page title from the English Wikipedia using the MediaWiki API.
   * @returns A Promise that resolves to the title of a random Wikipedia page.
   * @throws An Error if no random page is found in the response.
   */
  public async randomPageFromCategory(): Promise<WikiPage> {
    try {
      const randomCategory = this.getRandomCategory();
      const titles = await this.getTitlesInCategory(randomCategory);
      const randomTitle = this.getRandomTitle(titles);
      const pageData = await this.getPageData(randomTitle);
      const page: WikiPage = {
        url: `https://en.wikipedia.org/wiki/${randomTitle}`,
        title: randomTitle,
        content: pageData,
        category: randomCategory,
      };
      return page;
    } catch (err: any) {
      if (err.message === "No pages found in category") {
        return await this.randomPage();
      } else {
        throw new Error(err.message);
      }
    }
  }

  /**
   * Returns a random category from the categories array.
   * @throws An Error if the categories array is empty.
   */
  private getRandomCategory(): string {
    if (categories.length === 0) {
      throw new Error("No categories available");
    }
    return categories[Math.floor(Math.random() * categories.length)];
  }

  /**
   * Fetches the titles of pages in the given category using the MediaWiki API.
   * @param category The name of the category to fetch titles from.
   * @returns A Promise that resolves to an array of page titles.
   * @throws An Error if no pages are found in the category.
   */
  private async getTitlesInCategory(category: string): Promise<string[]> {
    const apiEndpoint = `https://en.wikipedia.org/w/api.php`;
    const params = {
      action: "query",
      format: "json",
      list: "categorymembers",
      cmtitle: `Category:${category}`,
      cmlimit: 500, // maximum number of pages to get
      cmprop: "title",
      cmtype: "page",
    };
    const res: AxiosResponse = await axios.get(apiEndpoint, { params });
    const json: any = res.data;
    if (
      !json.query ||
      !json.query.categorymembers ||
      json.query.categorymembers.length === 0
    ) {
      console.warn("No pages found in category, removing category: ", category);
      categories.splice(categories.indexOf(category), 1);
      fs.writeFileSync("./categories.json", JSON.stringify(categories));
      throw new Error("No pages found in category");
    }
    return json.query.categorymembers.map((page: any) => page.title);
  }

  /**
   * Returns a random title from the given array of titles.
   * @param titles An array of page titles.
   * @throws An Error if the titles array is empty.
   */
  private getRandomTitle(titles: string[]): string {
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
  public async getPageData(title: string) {
    const response = await axios.get("https://en.wikipedia.org/w/api.php", {
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
    const page: any = Object.values(pages)[0];

    if (!page) throw new Error("No page found");
    if (!page.extract) throw new Error("No page found");

    const content = page.extract;

    return content;
  }
}

export { WikiBot };
