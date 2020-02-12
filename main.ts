import { parse } from "https://deno.land/std/flags/mod.ts";
import { TextProtoReader } from "https://deno.land/std/textproto/mod.ts";
import { encode } from "https://deno.land/std/strings/mod.ts";
import { BufReader } from "https://deno.land/std/io/bufio.ts";
import Spinner from "https://raw.githubusercontent.com/ameerthehacker/cli-spinners/master/mod.ts";
import StackSearch from "./api.ts";
import * as print from "./prints.ts";
import { escape_html_tags } from "./helpers.ts";

const args = parse(Deno.args);
const spinner = Spinner.getInstance();

if (
  args.h ||
  args.help ||
  (args._.length === 0 && Object.keys(args).length < 2)
) {
  print.help();
}

if (args.q || args.question) {
  let query = args.q ? args.q : args.question;
  start_searching(query);
}

async function start_searching(question: string) {
  spinner.start("Searching for your question in StackOverFlow");
  let data = await StackSearch.getQuestionsWithTitleAdvanced(question);
  spinner.stop();
  console.log();

  data.forEach((element, i) => {
    console.log(i + 1 + ". " + element.title);
  });

  console.log();
  print.which_answer_message();
  const tpr = new TextProtoReader(new BufReader(Deno.stdin));

  while (true) {
    await Deno.stdout.write(encode("> "));
    const line: string | typeof Deno.EOF = await tpr.readLine();

    if (line == "close" || line == "exit") {
      break;
    }

    if (isNaN(Number(line))) {
      print.not_a_number();
    } else {
      if (Number(line) >= 1 && Number(line) <= data.length) {
        const choise: number = Number(line);
        const questionObject = data[choise - 1];
        const question_id = questionObject.question_id;
        let answers = await StackSearch.getAnswersFromQuestion(question_id);

        answers.forEach((element, i) => {
          const title: string = element.title;
          const body: string = escape_html_tags(element.body);
          const link: string = data[choise - 1].link;
          const score: number = element.score;
          const is_accepted: boolean = element.is_accepted;

          print.answer(i+1, title, body, link, score, is_accepted);
        });
      } else {
        print.not_a_valid_number();
      }
    }
  }

  Deno.exit();
}
