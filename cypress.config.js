const { defineConfig } = require("cypress");

function getDataFromHtmlWatchlistIntoJson() {
  const XLSX = require("xlsx");
  const filePath = "./cypress/xlsx/ground3_result2.xlsx";
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  return jsonData;
}

module.exports = defineConfig({
  e2e: {
    watchForFileChanges: false,
    responseTimeout: 300000,
    pageLoadTimeout: 600000,
    setupNodeEvents(on, config) {
      on("task", {
        readXlsxFile() {
          return getDataFromHtmlWatchlistIntoJson();
        },
      });
    },
  },
});
