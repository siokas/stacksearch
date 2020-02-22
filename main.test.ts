import { test, runTests } from "https://deno.land/std@v0.32.0/testing/mod.ts";
import {
  assert,
  assertEquals,
  assertStrictEq,
  assertThrows,
  assertThrowsAsync
} from "https://deno.land/std@v0.32.0/testing/asserts.ts";

import StackSearchAPI from "./src/api.ts";

test(async function api_stackexchange_returns_questions_matching_query() {
  const question = "typescript error";
  let response = await StackSearchAPI.getQuestions(question);
  assert(response.length > 0);
});

test(
  async function api_stackexchange_returns_answers_from_given_question_id() {
    const question_id = "typescript error";
    let response = await StackSearchAPI.getAnswersFromQuestion(60349932);
    assert(response.length > 0);
  }
);
