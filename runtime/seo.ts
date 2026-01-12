import { Browser } from 'puppeteer';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import puppeteerExtra from 'puppeteer-extra';

puppeteerExtra.use(StealthPlugin());

let browser: Browser;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const shuffle = (array: string[]) => array.sort(() => Math.random() - 0.5);

const searchTitle = async (title: string) => {
  const page = await browser.pages().then(pages => pages[0] || browser.newPage());
  await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36");
  const basicUrl = 'https://google.com/';
  await page.goto(basicUrl);
  const searchQuery = `${title} mermer`;
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
  await page.waitForSelector("a[href*='mermer.com.tw']");
  await page.click("a[href*='mermer.com.tw']");

  // log the url and title
  console.log(page.url(), new Date().toISOString());

  // sleep for 10 - 180 seconds
  await sleep(Math.floor(Math.random() * 170000) + 10000);

  // close the browser
  // await page.close();
};

const getTitle = async (url: string) => {
  const page = await browser.pages().then(pages => pages[0] || browser.newPage());
  await page.goto(url);

  // get the title
  const title = await page.title();
  await sleep(5000);
  // await page.close();
  return title;
}

const scan = async () => {
  // get site map from https://mermer.com.tw/sitemap.xml
  browser = await puppeteerExtra.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
  });
  const page = await browser.pages().then(pages => pages[0] || browser.newPage());
  await page.goto('https://mermer.com.tw/sitemap.xml');

  // get all the links
  const rawlinks = await page.$$eval('loc', (locs) => locs.map((loc) => loc.textContent))
  const validLinks = rawlinks.filter((link): link is string => link !== null);
  const fullLinks = validLinks.filter((link) => link.includes('knowledge-management/20'));
  const links = shuffle(fullLinks.filter(() => Math.random() > 0.5));
  // await page.close();
  await sleep(1000);

  // get the link title and run searchTitle for each title
  for (const link of links) {
    const title = await getTitle(link);
    console.log(title);
    await searchTitle(title);
  }

  browser.close();
  // sleep for 3 - 24 hours
  await sleep(Math.floor(Math.random() * 86400000) + 10800000);
  scan();
}

scan();
