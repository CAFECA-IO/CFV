import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import archiver from "archiver";
import fs from "fs";
import { join } from "path";
import { writeFile, mkdir } from "fs/promises";
import XLSX, { read } from "xlsx";
import puppeteer from "puppeteer";
import { ITEMS_PER_PAGE } from "../../../constants/config";

const prisma = new PrismaClient();

const listMission = async (page: number = 1) => {
  const missionsPerPage = ITEMS_PER_PAGE;
  const missionCount = await prisma.missions.count();
  const pages = Math.ceil(missionCount / missionsPerPage);
  const rawMissions = await prisma.missions.findMany({
    skip: (page - 1) * missionsPerPage,
    take: missionsPerPage,
    orderBy: {
      createdAt: "desc",
    },
  });
  const mids = rawMissions.map((mission) => mission.id);
  const rawJobs = await prisma.jobs.findMany({
    where: {
      mission_id: {
        in: mids,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const missions = rawMissions.map((mission) => {
    const jobsDone = rawJobs.filter(
      (job) => job.mission_id === mission.id && job.done === true
    ).length;
    const jobsTotal = rawJobs.filter(
      (job) => job.mission_id === mission.id
    ).length;
    const progress = Math.ceil((jobsDone / jobsTotal) * 100) / 100;
    const user = {
      id: 1,
      name: "admin",
      image: "/avatar_147144.png",
    };
    const data = {
      ...mission,
      progress,
      user,
    };
    return data;
  });
  const result = {
    totalPage: pages,
    missions,
  };
  return result;
};

const sleep = async (ms: number = 1000) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

let isBusy = false;
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
      createdAt: "asc",
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

  console.log("Mission Accomplished: ", mission.id);
};
const closeMissions = async () => {
  console.log("Closing Missions");
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
const doJob = async (job) => {
  const id = Object.values(JSON.parse(job.data)).at(0);
  const mFolder = missionFolder(job.mission_id);
  const filePath = join(mFolder, `${job.sheet}-${job.row}-${id}.png`);
  const encodeAddress1 = encodeURIComponent(job.from as string);
  const encodeAddress2 = encodeURIComponent(job.to as string);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    `https://www.google.com/maps/dir/${encodeAddress1}/${encodeAddress2}/`
  );

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
  console.log("Job done: ", job.id);
};
const doJobs = async (counts: Number = 10) => {
  if (isBusy) return;
  isBusy = true;
  const jobs = await prisma.jobs.findMany({
    where: {
      done: false,
    },
    orderBy: {
      createdAt: "asc",
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
  await sleep(10000);
  doJobs(counts);
};

const missionFolder = (id: string) => {
  const resultFolder = "./result";
  const projectFolder = join(resultFolder, id);
  return projectFolder;
};
const createMission = async (name: string, file: Buffer): Promise<string> => {
  // insert Missions into db with prisma and get primary key
  const mission = await prisma.missions.create({
    data: {
      name,
    },
  });
  const pid = mission.id;
  const folderPath = missionFolder(pid);
  await mkdir(folderPath, { recursive: true });

  // create Jobs into Mission
  const workbook = await read(file, { type: "buffer" });
  const sheetList = workbook.SheetNames;
  for (let sheetName of sheetList) {
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet);
    const jobs: Prisma.JobsCreateInput[] = [];

    let count = 0;
    for (let row of json) {
      count++;
      const rowString = JSON.stringify(row);
      const values = Object.values(row || {});
      const address1 = values[1] as string;
      const address2 = values[2] as string;
      const job: Prisma.JobsCreateInput = {
        mission_id: pid,
        sheet: sheetName,
        row: count,
        data: rowString,
        from: address1,
        to: address2,
      };
      await prisma.jobs.create({
        data: job,
      });
    }
  }

  return pid;
};
const parseExcel = async (pid: string, file: Buffer) => {
  const resultFolder = "./result";
  const projectFolder = missionFolder(pid);
  await mkdir(projectFolder, { recursive: true });
  const resultFile = join(projectFolder, "result.xlsx");
  const workbook = await read(file, { type: "buffer" });
  const newWorkbook = XLSX.utils.book_new();
  const sheetList = workbook.SheetNames;

  for (let sheetName of sheetList) {
    const sheet = workbook.Sheets[sheetName];
    const rsSheet = await parseSheet(projectFolder, sheetName, sheet);
    XLSX.utils.book_append_sheet(newWorkbook, rsSheet, sheetName);
    const sleepTime = Math.ceil(Math.random() * 500);
    await sleep(sleepTime);
  }
  XLSX.writeFile(newWorkbook, resultFile);
};
const parseSheet = async (
  projectFolder: string,
  sheetName: string,
  sheet: any
) => {
  const json = XLSX.utils.sheet_to_json(sheet);
  const result: any[] = [];

  let count = 0;
  for (let row of json) {
    count++;
    const filePath = join(projectFolder, `${sheetName}-${count}.png`);
    const values = Object.values(row || {});
    const newRecord: any = row;
    const address1 = values[1] as string;
    const address2 = values[2] as string;
    const distance = await getDistance(filePath, address1, address2);

    newRecord["Distance"] = distance;
    result.push(newRecord);

    const sleepTime = Math.ceil(Math.random() * 100 + 100);
    await sleep(sleepTime);
  }

  const rsSheet = XLSX.utils.json_to_sheet(result);
  return rsSheet;
};

/* crawler */
async function getDistance(
  filePath: string,
  address1: string,
  address2: string,
  retryTime = 3
) {
  try {
    // usual browser startup:
    const encodeAddress1 = encodeURIComponent(address1 as string);
    const encodeAddress2 = encodeURIComponent(address2 as string);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(
      `https://www.google.com/maps/dir/${encodeAddress1}/${encodeAddress2}/`
    );

    const n = await page.$("#section-directions-trip-0");
    const t = await n?.getProperty("textContent");
    const j = (await t?.jsonValue()) || "";
    const d =
      (j.match(/([0-9]*[.])?[0-9]+ [km|公里]/)?.at(0) as unknown as string) ||
      "?? km";
    const distance = (d.split(" ")?.at(0) || "??") + " km";

    // wait for the selector appear on the page
    await page.screenshot({
      type: "png", // can also be "jpeg" or "webp" (recommended)
      path: filePath, // where to save it
      fullPage: true, // will scroll down to capture everything if true
    });

    browser.close();
    return distance;
  } catch (error) {
    if (retryTime === 0) {
      return "?? km";
    } else {
      return getDistance(filePath, address1, address2, retryTime - 1);
    }
  }
}

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const pid = file.name;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const mission = await createMission(pid, buffer);
  doJobs();

  return NextResponse.json({ success: true });
}

export async function GET(request: NextRequest, context: { params }) {
  const { searchParams } = new URL(request.url);
  const page = (searchParams?.get("page") as unknown as number) || 1;
  const missions = await listMission(page);
  return NextResponse.json(missions);
}
