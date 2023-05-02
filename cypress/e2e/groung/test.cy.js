describe("Ground", () => {
  async function takeScreenshot(address1, address2, no) {
    const address1Arr = encodeURI(address1);
    const address2Arr = encodeURI(address2);

    try {
      await cy.visit(
        `https://www.google.com.tw/maps/dir/${address1Arr}/${address2Arr}`
      );
      cy.wait(1000);
      cy.screenshot(`/Zhonghua/${no}`, { capture: "fullPage" });
    } catch (error) {
      console.log(error);
      console.log(no);
    }
  }

  it("run the xlsx file", () => {
    cy.task("readXlsxFile").then(async (fileContents) => {
      for (let file of fileContents) {
        await takeScreenshot(file.Origin, file.Destination, file.NO);
        await cy.wait(1000);
        await cy.visit(`https://www.google.com.tw/`);
      }
    });
  });

  it.skip("run the xlsx file", () => {
    cy.task("readXlsxFile").then(async (fileContents) => {
      const file = fileContents[88];
      await takeScreenshot(file.Origin, file.Destination, file.NO);
      await cy.wait(1000);
    });
  });
});
