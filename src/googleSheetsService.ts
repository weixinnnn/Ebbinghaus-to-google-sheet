import { GoogleSpreadsheet } from "google-spreadsheet";
import googleConfig from "../google.json";

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
  console.log("cp1");
  console.log("process.env.SPREADSHEET_ID2", process.env.SPREADSHEET_ID);

  // Load the document properties and worksheets
  await spreadsheet.loadInfo();
  console.log("cp2");

  _spreadsheet = spreadsheet;
  return spreadsheet;
};

const getSheet = async (name: string) => {
  const spreadsheet = await getSpreadsheet();
  let sheet = spreadsheet.sheetsByTitle[name];
  if (!sheet) {
    sheet = await spreadsheet.addSheet({ title: name });
  }
  return sheet;
};

export { getSheet };
