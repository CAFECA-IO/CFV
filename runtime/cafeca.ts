import { Browser } from 'puppeteer';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import puppeteerExtra from 'puppeteer-extra';

let browser: Browser;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const searchTitle = async (title: string) => {
  browser = await puppeteerExtra.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
  });
  const page = await browser.pages().then(pages => pages[0] || browser.newPage());
  await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36");
  const basicUrl = 'https://google.com/';
  await page.goto(basicUrl);
  const searchQuery = title;
  // const encodedSearchQuery = encodeURIComponent(`${title} mermer`);
  // 尋找 textarea 並輸入 searchQuery
  await sleep(Math.floor(Math.random() * 3000) + 1000);
  await page.waitForSelector('textarea', { visible: true });
  await sleep(Math.floor(Math.random() * 3000) + 1000);

  // focus the textarea
  await page.focus('textarea');
  await sleep(Math.floor(Math.random() * 3000) + 500);

  // keydown the query string
  const keyin = async (s: string) => {
    const promises = s.split('').map(async (char) => {
      await page.keyboard.type(char);
      await sleep(Math.floor(Math.random() * 500) + 100);
    });
    await Promise.all(promises);
  };
  await keyin(searchQuery);

  await sleep(Math.floor(Math.random() * 3000) + 1000);
  await page.keyboard.press('Enter');
  await page.waitForNavigation();
  // const searchUrl = `https://www.google.com/search?q=${encodedSearchQuery}`;
  // await sleep(1000);
  // await page.goto(searchUrl);

  // find the link https://mermer.com.tw/* and click it
  await page.screenshot({ path: 'debug_headless.png', fullPage: true });
  await page.waitForSelector("a[href*='cafeca.com.tw']");
  await page.click("a[href*='cafeca.com.tw']");

  // log the url and title
  console.log(page.url(), new Date().toISOString());

  // sleep for 10 - 180 seconds
  await sleep(Math.floor(Math.random() * 170000) + 10000);

  // close the browser
  await page.close();
};

searchTitle("碳會計 碳核算 碳健檢 綠色金融 CAFECA 卡菲卡");
