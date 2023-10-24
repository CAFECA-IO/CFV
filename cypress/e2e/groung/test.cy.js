describe('Ground', () => {
  async function takeScreenshot(address1, address2, no) {
    const address1Arr = encodeURIComponent(address1);
    const address2Arr = encodeURIComponent(address2);

    try {
      await cy.visit(`https://www.google.com.tw/maps/dir/${address1Arr}/${address2Arr}`, {
        failOnStatusCode: false,
      });
      cy.wait(1000);
      cy.screenshot(`/Zhonghua/${no}`, {capture: 'fullPage'});
    } catch (error) {
      console.log(error);
      console.log(no);
    }
  }

  it('run the xlsx file', () => {
    cy.task('readXlsxFile').then(async fileContents => {
      for (let i in fileContents) {
        if (i < 870 || i >= 5000) continue;
        const file = fileContents[i];
        await takeScreenshot(file.Origin, file.Destination, file.NO);
        //await cy.wait(1000);
        await cy.visit(`https://www.google.com.tw/`);
      }
    });
  });

  it.skip('run the xlsx file', () => {
    cy.task('readXlsxFile').then(async fileContents => {
      const file = fileContents[88];
      await takeScreenshot(file.Origin, file.Destination, file.NO);
      await cy.wait(1000);
    });
  });
});
