const puppeteer = require("puppeteer");
let browser;
// search 墨沫 with google
// click mermer.com.tw

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const shuffle = (array) => array.sort(() => Math.random() - 0.5);

const searchTitle = async (title) => {
  const page = await browser.newPage();
  const searchQuery = encodeURIComponent(`${title} mermer`);
  const searchUrl = `https://www.google.com/search?q=${searchQuery}`;
  await page.goto(searchUrl);

  // find the link https://mermer.com.tw/* and click it
  await page.waitForSelector("a[href*='mermer.com.tw/knowledge-management/20']");
  await page.click("a[href*='mermer.com.tw']");

  // log the url and title
  console.log(page.url());

  // sleep for 10 - 180 seconds
  await sleep(Math.floor(Math.random() * 170000) + 10000);

  // close the browser
  await page.close();
};

const getTitle = async (url) => {
  const page = await browser.newPage();
  await page.goto(url);

  // get the title
  const title = await page.title();
  await page.close();
  return title;
}

const scan = async () => {
  // get site map from https://mermer.com.tw/sitemap.xml
  browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://mermer.com.tw/sitemap.xml');

  // get all the links
  const rawlinks = await page.$$eval('loc', (locs) => locs.map((loc) => loc.textContent))
  const fullLinks = rawlinks.filter((link) => link.includes('knowledge-management/20'));
  const links = shuffle(fullLinks.filter((link) => Math.random() > 0.5));
  page.close();

  // get the link title and run searchTitle for each title
  for (let link of links) {
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
export { };
