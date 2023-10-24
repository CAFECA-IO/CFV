import mime from "mime";
import { join } from "path";
import { writeFile, mkdir } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import XLSX, { read } from 'xlsx';
import puppeteer from 'puppeteer';

const genRanHex = (size: number = 16) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

const sleep = async (ms: number) => {
  console.log('sleep: ', ms);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const parseExcel = async (pid: string, file: Buffer) => {
  const resultFolder = './result';
  const projectFolder = join(resultFolder, pid);
  await mkdir(projectFolder, { recursive: true });
  const resultFile = join(projectFolder, 'result.xlsx');
  const workbook = await read(file, { type: 'buffer' });
  const newWorkbook = XLSX.utils.book_new();
  const sheetList = workbook.SheetNames;

  for(let sheetName of sheetList) {
    const sheet = workbook.Sheets[sheetName];
    const rsSheet = await parseSheet(projectFolder, sheetName, sheet);
    XLSX.utils.book_append_sheet(newWorkbook, rsSheet, sheetName);
    const sleepTime = Math.ceil(Math.random() * 500);
    await sleep(sleepTime);
  }
  XLSX.writeFile(newWorkbook, resultFile);
}
const parseSheet = async (projectFolder: string, sheetName: string, sheet: any) => {
  const json = XLSX.utils.sheet_to_json(sheet);
  const result: any[] = [];

  let count = 0;
  for(let row of json) {
    count++;
    const filePath = join(projectFolder, `${sheetName}-${count}.png`)
    const values = Object.values(row || {});
    const newRecord: any = row;
    const address1 = values[1] as string;
    const address2 = values[2] as string;
    const distance = await getDistance(filePath, address1, address2);

    newRecord['Distance'] = distance;
    result.push(newRecord);

    const sleepTime = Math.ceil(Math.random() * 100 + 100);
    await sleep(sleepTime);
  }

  const rsSheet = XLSX.utils.json_to_sheet(result);
  return rsSheet;
}

/* crawler */
async function getDistance(filePath: string, address1: string, address2: string, retryTime = 3) {
  try {
    // usual browser startup:
    const encodeAddress1 = encodeURIComponent(address1 as string);
    const encodeAddress2 = encodeURIComponent(address2 as string);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://www.google.com/maps/dir/${encodeAddress1}/${encodeAddress2}/`);

    const n = await page.$("#section-directions-trip-0");
    const t = await n?.getProperty('textContent');
    const j = await t?.jsonValue() || '';
    const d = j.match(/([0-9]*[.])?[0-9]+ [km|公里]/)?.at(0) as unknown as string;
    const distance = (d.split(' ')?.at(0) || '??') + ' km';

    // wait for the selector appear on the page
    await page.screenshot({
      type: "png", // can also be "jpeg" or "webp" (recommended)
      path: filePath,  // where to save it
      fullPage: true,  // will scroll down to capture everything if true
    });

    browser.close();
    return distance;
  } catch (error) {
    if(retryTime === 0) {
      return '?? km';
    } else {
      return getDistance(filePath, address1, address2, retryTime - 1);
    }
  }
}

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const pid = genRanHex();

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await parseExcel(pid, buffer);

  const path = join('/tmp', file.name);
  await writeFile(path, buffer);

  return NextResponse.json({ success: true });
}
