
import Cheerio from 'cheerio';
function splitStringIntoChunks(text, characterCount) {
    const chunks = []
    //split the text into chunks of characterCount characters
    while (text.length > characterCount) {
        chunks.push(text.substring(0, characterCount))
        text = text.substring(characterCount)
    }
    
    //add the last chunk
    chunks.push(text)
    return chunks
}
/**
 * Merges adjacent chunks of a given array of chunks.
 * Each chunk is merged with its previous and next chunk.
 * The first and last chunk are only merged with their adjacent chunks.
 * Example: [a, b, c, d, e] => [ab, abc, bcd, cde, de]
 *
 * @param {string[]} chunks - An array of string chunks.
 * @returns {string[]} - An array of merged string chunks.\
 */

function mergeCloseChunksIntoString(chunks) {
    //merge the chunk before and after the chunk into the chunk
    //example [a, b, c, d, e] => [ab, abc, bcd, cde, de]
    const mergedChunks = []
    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i]
        if (i > 0) {
            mergedChunks.push(chunks[i - 1] + chunk)
        }
        if (i < chunks.length - 1) {
            mergedChunks.push(chunk + chunks[i + 1])
        }
    }
    return mergedChunks
}


function parseOutHtml(html) {

    // Load the HTML string into cheerio
    const $ = Cheerio.load(html);
    $('script').remove();
    $('nav').remove();
  
    const bodyContent = $('body').html();
    return bodyContent
  }

  
export {
    splitStringIntoChunks,
    mergeCloseChunksIntoString,
    parseOutHtml
}