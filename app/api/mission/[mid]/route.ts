import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import fs from "fs/promises";
import path from "path";
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

const getMissionZipPath = (mid: string) => {
  const folder = process.env.FOLDER as string;
  const missionZip = path.join(folder, `${mid}.zip`);
  return missionZip;
};

const getMissionFolder = (mid: string) => {
  const folder = process.env.FOLDER as string;
  const missionFolder = path.join(folder, mid);
  return missionFolder;
};

export async function DELETE(request: NextRequest, context: { params }) {
  const mid = context.params.mid;

  // delete mission
  try {
    await prisma.missions
      .delete({
        where: {
          id: mid,
        },
      });
  } catch(e) {};

  // delete jobs
  try {
    await prisma.jobs
      .deleteMany({
        where: {
          mission_id: mid,
        },
      })
  } catch(e) {};

  // delete folder
  const folder = process.env.FOLDER as string;
  const missionFolder = getMissionFolder(mid);
  try {
    await fs.rmdir(missionFolder, { recursive: true });
  } catch(e) {};

  // delete zip file
  const filePath = getMissionZipPath(mid);
  try {
    await fs.unlink(filePath);
  } catch(e) {};

  const result = {
    success: true,
  };
  return NextResponse.json(result);
}

export async function GET(request: NextRequest, context: { params }) {
  // get zip file
  const mid = context.params.mid;
  const filePath = getMissionZipPath(mid);
  const data = await fs.readFile(filePath);

  const contentType = "application/zip";

  const response = new NextResponse(data);
  response.headers.set("content-type", contentType);
  return response;
}
