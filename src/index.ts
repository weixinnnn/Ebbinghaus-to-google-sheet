import { getLearningSheet, getOverviewSheet } from "./googleSheetsService";
import moment from "moment";
import { RecurringKey, getFormattedDate, recurring } from "./utils";
require("dotenv").config();

(async () => {
  const phrase = process.argv[2];
  if (!phrase) return;

  const now = moment();
  const learningCurves = [];
  const recurringPeriods = Object.keys(recurring) as unknown as RecurringKey;

  for (let i = 0; i < recurringPeriods.length; i++) {
    const [, duration, timeUnit]: any[] =
      recurringPeriods[i].match(/(\d+)([a-zA-Z]+)/) || [];
    const date = getFormattedDate(now.clone().add(Number(duration), timeUnit));
    learningCurves.push(date);

    const learningSheet = await getLearningSheet(date);
    await learningSheet.addRows([
      [phrase, recurring[recurringPeriods[i] as RecurringKey]],
    ]);
  }

  const overviewSheet = await getOverviewSheet();
  await overviewSheet.addRows([[phrase, ...learningCurves]]);
})();
