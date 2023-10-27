import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const listMission = async (page: number = 1) => {
  const missionsPerPage = 7;
  const prisma = new PrismaClient();
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

export async function GET(request: NextRequest) {
  const missions = await listMission();
  return NextResponse.json(missions);
}
