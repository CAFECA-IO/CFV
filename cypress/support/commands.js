// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// 拜訪 TideBit 首頁
Cypress.Commands.add('visitTideBit', () => {
  cy.visit('https://staging-001.tidebit.network/');
});
// 拜訪 TideBit analysis
Cypress.Commands.add('visitAnalysis', () => {
  cy.visit('https://staging-001.tidebit.network/analysis');
});
// 登入 TideBit
Cypress.Commands.add('login', (id, password) => {
  cy.contains('登入').click();
  cy.get('#identity_email').type(id);
  cy.get('#identity_password').type(password);
  cy.contains('提交').click();
});
// 選擇交易對
Cypress.Commands.add('selectTicker', (currency, tickers) => {
  cy.get('.selectedTicker').trigger('mouseover');
  cy.contains(currency).click();
  cy.contains(tickers).click();
});
// 掛限價單
Cypress.Commands.add('pendingLimitOrder', (type, price, amount) => {
  cy.get(`.active .market-trade--${type}`).as('targetTab');
  cy.get('@targetTab').find('input[name="price"]').type(price);
  cy.get('@targetTab').find('input[name="amount"]').type(amount);
  cy.get(`.active .market-trade--${type} > .btn`).click();
});
// 掛市價單
Cypress.Commands.add('pendingMarketOrder', (type, amount) => {
  cy.get(`.active .market-trade--${type}`).find('input[name="amount"]').type(amount);
  cy.get(`.active .market-trade--${type} > .btn`).click();
});
// testcase 002 進入管理人員設定
Cypress.Commands.add('enterAdminSettings', () => {
  cy.get('.admin-header__hamburger').click(); //打開 sidebar
  cy.contains('管理人員').click();
  cy.contains('管理人員設定').click();
  cy.wait(100);
  cy.contains('管理人員設定'); //驗證標題文字是否正確
});
// testcase 002 新增權限
Cypress.Commands.add('addAdmin', id => {
  cy.get('.screen__table-tool-icon').eq(1).click();
  cy.get('[name="user-setting-add-user-id"]').clear().type('test');
  cy.get('[name="user-setting-add-user-email"]').clear().type(id);
  cy.contains('Root').click();
  cy.contains('確認').click();
});
// testcase 004 調整出入金
//currency:貨幣種類, type:deposit/withdraw typeNumber:入金=1 出金=2, typeText:入金手續費/出金手續費
//inputFee:輸入值, outputFee:應輸出的值
Cypress.Commands.add('changeFee', (currency, type, typeNumber, typeText, inputFee, outputFee) => {
  cy.get('.screen__table-rows')
    .contains(currency)
    .siblings('.deposit__currency-text')
    .eq(`${typeNumber}`)
    .as('getFee');
  cy.get('@getFee').children('.screen__table-item--icon').click(); //抓取內容為 "BTC" 的 DOM 元素，再用 siblings 選擇器找到入金手續費按鈕的位置，命名為'depositFee'
  cy.contains(typeText);
  cy.contains(currency); //確認沒有找錯

  cy.get(`input[name="${type}-fee"]`).clear().type(inputFee); //先清空 input 再輸入
  cy.contains('確認').click();
  cy.wait(3000); //等待一段時間讓資料送出
  cy.get('@getFee').should('have.text', `${outputFee}%`); //檢查修改的值是否正確
});
// testcase 008 檢查委託單的撮合手續費
// 步驟：打開 sidebar -> 交易記錄 -> 成交紀錄 -> 檢查委託單的內容
Cypress.Commands.add('checkFee', (tradeNo, priceText, outText, feeText) => {
  cy.get('.tablet > .sidebar.item').click();
  cy.contains('交易記錄').click();
  cy.contains('成交紀錄').click();
  cy.get(`tbody > :nth-child(${tradeNo}) > :nth-child(4)`).should('contain', `${priceText}`); //價格
  cy.get(`tbody > :nth-child(${tradeNo}) > :nth-child(5)`).should('contain', `${outText}`); //流出
  cy.get(`:nth-child(${tradeNo}) > :nth-child(7)`).should('contain', `${feeText}`); //費用
});
// 008-B only
Cypress.Commands.add('checkFeeB', (priceText, outText, feeText) => {
  cy.contains(feeText).first().parents('tr').as('myData'); //用 feeText 向上查找委託單
  cy.get('@myData').should('contain', `${priceText}`); //價格
  cy.get('@myData').should('contain', `${outText}`); //流出
});
