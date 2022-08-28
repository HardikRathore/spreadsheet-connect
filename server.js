const express = require("express");
const {
  getAuth,
  getAuthToken,
  getSpreadSheet,
  fetchData,
  updateData,
} = require("./service.js");

const app = express();
app.use(express.json());

app.get("/login", async (req, res) => {
  let authToken;
  try {
    authToken = await getAuthToken();
  } catch (e) {
    return res.send(e.message);
  }
  return res.send(authToken);
});

app.get("/spreadsheet/:id", async (req, res) => {
  let obj = {};
  try {
    const spreadsheetId = req.params.id;
    const auth = await getAuth();
    const spreadSheet = await getSpreadSheet({ spreadsheetId, auth });
    obj = await fetchData({ spreadSheet, spreadsheetId, auth });
  } catch (e) {
    return res.send(e.message);
  }
  return res.send(obj);
});

app.post("/spreadsheet/update", async (req, res) => {
  try {
    await updateData(req);
  } catch (e) {
    return res.send({ success: false, message: e.message });
  }
  return res.send({ success: true });
});

app.listen(1337, (req, res) => console.log("Server running on 1337"));
