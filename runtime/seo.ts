const puppeteer = require("puppeteer");

// search 墨沫 with google
// click mermer.com.tw

const doJob = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.google.com/search?q=%E5%A2%A8%E6%B2%AB");
  await page.waitForSelector("a[href='https://mermer.com.tw/']");
  await page.click("a[href='https://mermer.com.tw/']");
};

doJob();