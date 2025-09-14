// Google Apps Script: save POSTed JSON to a Google Sheet
// Updated to match the new Ambassador Camp 2026 survey fields

const SPREADSHEET_ID = "1LNy7zv_7fvww0145-pGrjA2muo5OmUJz9RHFGl3q6Dc"; // <-- replace with your Google Sheet ID
const SHEET_NAME = "Responses";

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);

    // Optional token check
    if (payload._secret !== "NOZIPHO") {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "error", message: "Invalid token" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

    // Define headers - updated to match all new survey fields
    const headers = [
      "Timestamp",
      "age",
      "gender",
      "federation",
      "hobbies",
      "interests",
      "sportingActivity",
      "spiritual",
      "mission",
      "skills",
      "fun",
      "speakers",
      "programItems",
      "lifeSkills",
      "hope",
      "otherIssues",
      "prizeDrawEntry",
      "badge"
    ];

    // Add header row if sheet is empty
    if (sheet.getLastRow() === 0) sheet.appendRow(headers);

    const headerRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];

    const row = headerRow.map(h => {
      if (h === "Timestamp") return new Date();
      const val = payload[h];
      // Handle arrays (spiritual, mission, skills, fun, lifeSkills) by joining with commas
      if (Array.isArray(val)) return val.join(", ");
      // Handle boolean (prizeDrawEntry) by converting to Yes/No
      if (typeof val === "boolean") return val ? "Yes" : "No";
      // Return the value as-is, or empty string if undefined
      return val || "";
    });

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
