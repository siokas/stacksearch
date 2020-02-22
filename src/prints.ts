import {
  bgYellow,
  bgGreen,
  blue,
  red,
  green,
  yellow,
  bold,
  black,
  magenta
} from "https://deno.land/std/fmt/colors.ts";

export function empty_line(): void {
  console.log();
}

export function line_seperator(): void {
  console.log("-----------------------------------------------------");
}

export function help(): void {
  console.log(yellow(bold("Description:")));
  console.log(
    "   Search Stack Overflow from your terminal. You can search Stack Overflow questions and browse through the best answers without leaving the terminal!"
  );

  console.log(yellow(bold("Usage:")));
  console.log("   stacksearch [query]");

  console.log();
  console.log(bold(magenta("To exit the app type [exit] or [close]")));
}

export function answer(
  count: number,
  title: string,
  body: string,
  link: string,
  score: number,
  is_accepted: boolean
): void {
  console.log();
  line_seperator();
  console.log();
  console.log(green(bold(count + ". " + title)));
  console.log(blue("(" + link + ")"));
  console.log(
    bgYellow(black("Score: " + score)) +
      "    " +
      (is_accepted ? bgGreen(" ✔️  ") : "")
  );
  console.log();
  console.log(body);
  console.log();
  line_seperator();
  console.log();
}

export function not_a_valid_number(): void {
  console.log(red("Please enter a valid number"));
}

export function which_answer_message(): void {
  console.log(
    bold(magenta("Enter the number of question to see the answers."))
  );
}

export function not_a_number(): void {
  console.log(red("Please enter a number"));
}

export function question_not_answered(): void {
  console.log(red("This question is not answered yet!"));
}

export function no_questions_matching_query(): void {
  console.log(red("Sorry! There are no questions matching your query."));
}
