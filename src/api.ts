import { http_get } from "./helpers.ts";
import * as Config from "./config.ts";
import { APIStackExchange } from "./interfaces.ts";

/**
 * Using StackExchange API Version 2.2 to search through the StackOverFlow questions.
 */
class StackSearch {
  /**
   * It makes a simple search to the stackoverflow site and gets back all the results matching the search query
   *
   * @param title The search query
   */
  async getQuestions(title: string): Promise<APIStackExchange> {
    const data: APIStackExchange = await http_get(
      Config.stack_api_simple_search + Config.__intitle + title
    );
    return data;
  }

  /**
   * It makes an advanced search to the stackoverflow site and gets back all the results matching the search query
   *
   * @param title The search query
   */
  async getQuestionsAdvanced(title: string): Promise<APIStackExchange> {
    const data: APIStackExchange = await http_get(
      Config.stack_api_advanced_search + Config.__title + title
    );

    return data;
  }

  /**
   * Gets all the possible answers from the given question
   *
   * @param id Question ID (got from the results of the search api)
   */
  async getAnswersFromQuestion(id: number): Promise<APIStackExchange> {
    const data: APIStackExchange = await http_get(
      Config.stack_api_question_with_all_answers.replace(
        /{id}/gi,
        id.toString()
      )
    );

    return data;
  }
}

export default new StackSearch();
