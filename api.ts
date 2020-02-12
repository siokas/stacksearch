import { http_get } from "./helpers.ts";
import * as Config from "./config.ts";

/**
 * Using StackExchange API Version 2.2 to search through the StackOverFlow questions.
 */
class StackSearch {
  /**
   * It makes a simple search to the stackoverflow site and gets back all the results matching the search query
   *
   * @param title The search query
   */
  async getQuestionsWithTitle(title: string) {
    const data = await http_get(
      Config.stack_api_simple_search + Config.__intitle + title
    );
    return data["items"];
  }

  /**
   * It makes an advanced search to the stackoverflow site and gets back all the results matching the search query
   *
   * @param title The search query
   */
  async getQuestionsWithTitleAdvanced(title: string) {
    const data = await http_get(
      Config.stack_api_advanced_search + Config.__title + title
    );

    return data["items"];
  }

  /**
   * Gets all the possible answers from the given question
   *
   * @param id Question ID (got from the results of the search api)
   */
  async getAnswersFromQuestion(id: number) {
    const data = await http_get(
      Config.stack_api_question_with_all_answers.replace(
        /{id}/gi,
        id.toString()
      )
    );
    return data["items"];
  }
}

export default new StackSearch();
