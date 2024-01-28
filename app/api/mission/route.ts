import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import archiver from "archiver";
import fs from "fs";
import { join } from "path";
import { mkdir } from "fs/promises";
import XLSX, { read } from "xlsx";
import puppeteer from "puppeteer";
import { ITEMS_PER_PAGE } from "../../../constants/config";
import { getServerSession } from "next-auth/next";

const prisma = new PrismaClient();
const getUser = async () => {
  const session = await getServerSession(); 
  const sessionUser = session?.user;
  const dbUser = await prisma.users.findUnique({
    where: { email: sessionUser?.email },
  });
  return dbUser;
}

// 陸運： https://www.google.com/maps/
// 空運： https://www.icao.int/environmental-protection/Carbonoffset/Pages/default.aspx
// 海運： https://www.searates.com/services/distances-time/

// 港口資訊： https://www.marinetraffic.com/zh/ais/details/ports/1253?name=SHANGHAI&country=China
// 陸運海運空運：
// 起點 終點 航運別：

// 1. NO 起點 終點
// 2. replace_template.xlsx 覆蓋 template
// 3. 帳號管理 admin / 新增刪除 user / 自行變更密碼

const listMission = async (page: number = 1) => {
  const noResult = {
    totalPage: 0,
    missions: [],
  };
  const dbUser = await getUser();
  const user = {...dbUser, image: "/avatar_147144.png"};
  user.id = (user.id as string).substring(0, 16);
  const user_id = dbUser?.id;
  if (!user_id) return noResult;

  const missionsPerPage = ITEMS_PER_PAGE;
  const missionCount = await prisma.missions.count({
    where: {
      user_id,
    },
  });
  const pages = Math.ceil(missionCount / missionsPerPage);
  const rawMissions = await prisma.missions.findMany({
    where: {
      user_id,
    },
    skip: (page - 1) * missionsPerPage,
    take: missionsPerPage,
    orderBy: {
      created_at: "desc",
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
      created_at: "desc",
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

const missionFolder = (id: string) => {
  const resultFolder = "./result";
  const projectFolder = join(resultFolder, id);
  return projectFolder;
};
const createMission = async (name: string, file: Buffer): Promise<string> => {
  const dbUser = await getUser();
  const user_id = dbUser?.id;
  const quota = dbUser?.quota as number;
  if (!user_id) return "";

  // create Jobs into Mission
  const workbook = await read(file, { type: "buffer" });
  const sheetList = workbook.SheetNames;

  // count jobs in sheetList
  let jobCount = 0;
  for (let sheetName of sheetList) {
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet);

    for (let row of json) {
      jobCount++;
    }
  }

  // charge user
  if (quota < jobCount) return "";
  await prisma.users.update({
    where: {
      id: user_id,
    },
    data: {
      quota: quota - jobCount,
    },
  });

  // insert Missions into db with prisma and get primary key
  const mission = await prisma.missions.create({
    data: {
      name,
      user_id,
    },
  });
  const pid = mission.id;
  const folderPath = missionFolder(pid);
  await mkdir(folderPath, { recursive: true });

  for (let sheetName of sheetList) {
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet);
    const jobs: Prisma.JobsCreateInput[] = [];

    let count = 0;
    for (let row of json) {
      count++;
      const rowString = JSON.stringify(row);
      const values = Object.values(row || {});
      const address1 = row?.["起點"] as string;
      const address2 = row?.["終點"] as string;
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

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false });
  } else if(file.name === "replace_template.xlsx") {
    // replace template.xlsx in plublic folder
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(process.cwd(), "public", "template.xlsx");
    await fs.promises.writeFile(filePath, buffer);
    return NextResponse.json({ success: true });
  }

  const pid = file.name;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const mission = await createMission(pid, buffer);
  const result = { success: !!mission, mission };

  return NextResponse.json(result);
}

export async function GET(request: NextRequest, context: { params }) {
  const { searchParams } = new URL(request.url);
  const page = (searchParams?.get("page") as unknown as number) || 1;
  const missions = await listMission(page);

  return NextResponse.json(missions);
}
