const { PrismaClient, Prisma } = require("@prisma/client");
const archiver = require("archiver");
const fs = require("fs");
const { join } = require("path");
const XLSX = require("xlsx");
const puppeteer = require("puppeteer");
require('dotenv').config({ path: `.env.local`, override: true });

const prisma = new PrismaClient();

const sleep = async (ms: number = 1000) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

let isBusy = false;

const missionFolder = (id: string) => {
  const resultFolder = "./result";
  const projectFolder = join(resultFolder, id);
  return projectFolder;
};

const zipFolder = async (sourceFolder: string, zipFilePath: string) => {
  const output = fs.createWriteStream(zipFilePath);
  const archive = archiver("zip", {
    zlib: { level: 9 }, // Sets the compression level.
  });
  archive.pipe(output);
  archive.directory(sourceFolder, false);
  await archive.finalize();
};

const closeMission = async (mission) => {
  const rFolder = missionFolder("");
  const mFolder = missionFolder(mission.id);

  // create result file
  const jobs = await prisma.jobs.findMany({
    where: {
      mission_id: mission.id,
    },
    orderBy: {
      created_at: "asc",
    },
  });
  const workbook = XLSX.utils.book_new();
  const sheetList = {};
  for (let job of jobs) {
    if (!sheetList[job.sheet]) {
      sheetList[job.sheet] = {
        name: job.sheet,
        data: [],
      };
    }
    const row = JSON.parse(job.data);
    row["Distance(km)"] = job.distance;
    sheetList[job.sheet].data.push(row);
  }
  for (let sheetName in sheetList) {
    const sheet = XLSX.utils.json_to_sheet(sheetList[sheetName].data);
    XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
  }
  const resultFile = join(mFolder, "result.xlsx");
  XLSX.writeFile(workbook, resultFile);

  // zip result folder
  const zipFile = join(rFolder, `${mission.id}.zip`);
  await zipFolder(mFolder, zipFile);

  // update mission status
  await prisma.missions.update({
    where: {
      id: mission.id,
    },
    data: {
      done: true,
    },
  });
};

const closeMissions = async () => {
  // close missions
  const missions = await prisma.missions.findMany({
    where: {
      done: false,
    },
  });

  for (let mission of missions) {
    const jobs = await prisma.jobs.findMany({
      where: {
        mission_id: mission.id,
        done: false,
      },
    });

    if (jobs.length === 0) {
      await closeMission(mission);
    }
  }
};

const ensureMissionFolder = async (folder: string) => {
  try {
    if(fs.existsSync(folder)) return;
    await fs.promises.mkdir(folder);
  } catch (e) {
  }
}

const doJob = async (job) => {
  const data = JSON.parse(job.data);
  const id = data["NO"];
  const mFolder = missionFolder(job.mission_id);
  await ensureMissionFolder(mFolder);
  const filePath = join(mFolder, `${job.sheet}-${job.row}-${id}.png`);
  const encodeAddress1 = encodeURIComponent(data["起點"] as string);
  const encodeAddress2 = encodeURIComponent(data["終點"] as string);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    `https://www.google.com/maps/dir/${encodeAddress1}/${encodeAddress2}/`
  );

  await page.waitForSelector("div.widget-directions > div > div:nth-child(2) > div > div > div > div:nth-child(2) > button");
  await page.click("div.widget-directions > div > div:nth-child(2) > div > div > div > div:nth-child(2) > button");
  await sleep(3000)
  const n = await page.$("#section-directions-trip-0");
  const t = await n?.getProperty("textContent");
  const j = (await t?.jsonValue()) || "";
  const d =
    (j.match(/([0-9]*[.])?[0-9]+ [km|公里]/)?.at(0) as unknown as string) ||
    "?? km";
  const distance = (d.split(" ")?.at(0) || "??");

  // wait for the selector appear on the page
  await page.screenshot({
    type: "png", // can also be "jpeg" or "webp" (recommended)
    path: filePath, // where to save it
    fullPage: true, // will scroll down to capture everything if true
  });

  browser.close();

  await prisma.jobs.update({
    where: {
      id: job.id,
    },
    data: {
      distance,
      done: true,
    },
  });
};

const doJobs = async (counts: Number = 10) => {
  if (isBusy) return;
  isBusy = true;
  const jobs = await prisma.jobs.findMany({
    where: {
      done: false,
    },
    orderBy: {
      created_at: "asc",
    },
  });
  if (jobs.length === 0) {
    isBusy = false;
    return;
  }

  for (let job of jobs) {
    await doJob(job);
    await sleep(1000);
  }
  closeMissions();
  isBusy = false;
};

const start = async () => {
  await doJobs();
  setTimeout(start, 10000);
};

start();
prisma.$disconnect();