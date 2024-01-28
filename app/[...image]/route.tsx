import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ImageResponse } from '@vercel/og';
import React from "react";

const prisma = new PrismaClient();

export async function GET(request: NextRequest, response: NextResponse) {
  // print current path
  const imageURL = `https://cfv.cafeca.io/isunfa.png`;
  const url = new URL(request.url);
  const name = url.searchParams.get("name") as string;
  const ip = request.headers.get("x-forwarded-for") as string;

  // div background image = imageURL
  const jsx = (
    <img width="400" height="135"src={imageURL} />
  );
  
  const visitor = { ip, name };
  await prisma.visitors.create({ data: visitor });

  return new ImageResponse(
    jsx, {
      width: 400,
      height: 135,
    }
  );
}
