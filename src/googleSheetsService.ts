import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";
import googleConfig from "../google.json";
import { recurring } from "./utils";

let isSpreadsheetLoaded = false;
let _spreadsheet: GoogleSpreadsheet;

const getSpreadsheet = async () => {
  if (_spreadsheet) {
    return _spreadsheet;
  }
  const spreadsheet = new GoogleSpreadsheet(process.env.SPREADSHEET_ID);
  // Load the credentials from a JSON file (service account)
  await spreadsheet.useServiceAccountAuth({
    client_email: googleConfig.client_email,
    private_key: googleConfig.private_key,
  });
  // Load the document properties and worksheets
  await spreadsheet.loadInfo();

  _spreadsheet = spreadsheet;
  return spreadsheet;
};

const getSheet = async (
  name: string,
  createSheet: () => Promise<GoogleSpreadsheetWorksheet>
) => {
  const spreadsheet = await getSpreadsheet();
  let sheet = spreadsheet.sheetsByTitle[name];
  if (!sheet) {
    sheet = await createSheet();
  }
  return sheet;
};

const createOverviewSheet = async () => {
  const spreadsheet = await getSpreadsheet();
  const recurringPeriods = Object.values(recurring);
  const sheet = await spreadsheet.addSheet({
    title: "Overview",
    headerValues: [
      "Phrase",
      "Recurring",
      ...Array(recurringPeriods.length - 1).fill(""),
      "Remarks",
    ],
  });
  await sheet.addRows([["", ...recurringPeriods]]);

  // Merge Phrase header
  // @ts-ignore
  await sheet.mergeCells({
    startRowIndex: 0,
    endRowIndex: 2,
    startColumnIndex: 0,
    endColumnIndex: 1,
  });
  // Merge Recurring header
  // @ts-ignore
  await sheet.mergeCells({
    startRowIndex: 0,
    endRowIndex: 1,
    startColumnIndex: 1,
    endColumnIndex: 9,
  });
  // Merge Remark header
  // @ts-ignore
  await sheet.mergeCells({
    startRowIndex: 0,
    endRowIndex: 2,
    startColumnIndex: 9,
    endColumnIndex: 10,
  });
  return sheet;
};

const getOverviewSheet = () => getSheet("Overview", createOverviewSheet);

const createLearningSheet = async (title: string) => {
  const spreadsheet = await getSpreadsheet();
  const sheet = await spreadsheet.addSheet({
    title,
    headerValues: ["Phrase", "Recurring"],
  });

  return sheet;
};

const getLearningSheet = (title: string) =>
  getSheet(title, () => createLearningSheet(title));

const insertOverviewSheet = async (phrase: string) => {
  const overviewSheet = await getOverviewSheet();
  await overviewSheet.addRow([phrase]);
};

export { getOverviewSheet, getLearningSheet };
