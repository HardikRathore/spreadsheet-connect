const { google } = require("googleapis");
const googleSheets = google.sheets("v4");
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

getAuthToken = async () => {
  const auth = new google.auth.GoogleAuth({
    scopes: SCOPES,
  });
  const authToken = await auth.getClient();
  return authToken;
};

getAuth = async () => {
  const auth = new google.auth.GoogleAuth({
    scopes: SCOPES,
  });
  return auth;
};

getSpreadSheet = async ({ spreadsheetId, auth }) => {
  const res = await googleSheets.spreadsheets.get({
    spreadsheetId,
    auth,
  });
  return res;
};

fetchData = async ({ spreadSheet, spreadsheetId, auth }) => {
  let obj = {};
  let idx = 0;
  for await (const sheet of spreadSheet.data.sheets) {
    let getRows = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: sheet.properties.title,
    });
    const title = spreadSheet.data.sheets[idx].properties.title;
    obj[title] = getRows.data.values;
    idx++;
  }
  return obj;
};

updateData = async (req) => {
  const spreadsheet_id = req.body.spreadsheet_id;
  const sheet_id = req.body.sheet_id;
  const row_number = req.body.row_number;
  const column_number = req.body.column_number;
  const value = req.body.value;
  const googleSheets = google.sheets({
    version: "v4",
    auth: await getAuthToken(),
  });
  if (
    !(
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    )
  ) {
    throw new Error("Not a valid entry try using boolean, string or number");
  }
  const updateValue = await googleSheets.spreadsheets.values.update({
    spreadsheetId: spreadsheet_id,
    range: `${sheet_id}!${column_number}${row_number}`,
    requestBody: {
      values: [[value]],
    },
    valueInputOption: "USER_ENTERED",
  });
};

module.exports = {
  getAuthToken,
  getSpreadSheet,
  fetchData,
  updateData,
  getAuth,
};
