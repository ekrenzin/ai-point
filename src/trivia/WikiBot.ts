import axios, { AxiosResponse } from "axios";

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
  public async randomPage(): Promise<string> {
    const wikiUrl =
      "https://en.wikipedia.org/w/api.php?action=query&list=random&rnlimit=1&format=json&origin=*&rnnamespace=0";
    const res: AxiosResponse = await axios.get(wikiUrl);
    const json: any = res.data;
    if (!json.query.random) throw new Error("No random page found");

    const title = json.query.random[0].title;
    return title;
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
